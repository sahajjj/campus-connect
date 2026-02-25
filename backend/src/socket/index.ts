import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Redis from 'ioredis';
import { RedisMemoryServer } from 'redis-memory-server';

export let redis: Redis;

const initializeRedis = async () => {
    try {
        redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
            maxRetriesPerRequest: 1,
            retryStrategy: () => null // Stop retrying after first failure
        });

        // Wait for connection or error
        await new Promise((resolve, reject) => {
            redis.on('ready', resolve);
            redis.on('error', reject);
        });

        console.log('Connected to local Redis successfully');
    } catch (err) {
        console.warn('⚠️ Local Redis connection failed. Provisioning in-memory Redis...');
        const redisServer = new RedisMemoryServer();
        const host = await redisServer.getHost();
        const port = await redisServer.getPort();

        redis = new Redis({ host, port });
        console.log(`✅ Dynamically connected to in-memory Redis at redis://${host}:${port}`);
    }

    // Clear old data on restart
    await redis.del('online_users');
    await redis.del('text_queue');
    await redis.del('video_queue');
};

initializeRedis();

export const getOnlineCount = async () => {
    return await redis.scard('online_users');
};

export const initializeSocket = (io: Server) => {
    // Middleware for socket authentication
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication required'));

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;

            // Fetch user from DB
            const user = await User.findById(decoded.userId);
            if (!user || user.isBanned) return next(new Error('User banned or not found'));

            socket.data.userId = decoded.userId;
            socket.data.email = user.email;
            next();
        } catch (err) {
            next(new Error('Invalid token'));
        }
    });

    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.data.email}`);

        // Add to online users
        await redis.sadd('online_users', socket.data.userId);
        const count = await getOnlineCount();
        io.emit('online_count', count);

        // Queue for matchmaking
        socket.on('join_queue', async (config: { type: 'text' | 'video' }) => {
            const queueKey = config.type === 'text' ? 'text_queue' : 'video_queue';

            // Try to find a match
            const matchedId = await redis.rpop(queueKey);

            if (matchedId && matchedId !== socket.id) {
                // Exclude self matches
                const partnerSocket = io.sockets.sockets.get(matchedId);

                if (partnerSocket) {
                    // Generate a room
                    const roomId = `room_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

                    socket.join(roomId);
                    partnerSocket.join(roomId);

                    // Save room association
                    socket.data.roomId = roomId;
                    partnerSocket.data.roomId = roomId;

                    socket.emit('matched', { roomId, initiator: false });
                    partnerSocket.emit('matched', { roomId, initiator: true });
                } else {
                    // Partner disconnected, add current user back to queue
                    await redis.lpush(queueKey, socket.id);
                }
            } else {
                // No match found, push self to queue
                await redis.lpush(queueKey, socket.id);
            }
        });

        // Signaling for WebRTC
        socket.on('offer', (data) => {
            socket.to(socket.data.roomId).emit('offer', data);
        });

        socket.on('answer', (data) => {
            socket.to(socket.data.roomId).emit('answer', data);
        });

        socket.on('ice_candidate', (data) => {
            socket.to(socket.data.roomId).emit('ice_candidate', data);
        });

        // Chat
        socket.on('message', (packet) => {
            socket.to(socket.data.roomId).emit('message', packet);
        });

        socket.on('typing', (isTyping) => {
            socket.to(socket.data.roomId).emit('typing', isTyping);
        });

        // Handle skip/disconnect inside room
        const handleLeave = async () => {
            const roomId = socket.data.roomId;
            if (roomId) {
                socket.to(roomId).emit('partner_left');
                socket.leave(roomId);
                socket.data.roomId = null;
            } else {
                // Remove from queue if they were in it
                await redis.lrem('text_queue', 0, socket.id);
                await redis.lrem('video_queue', 0, socket.id);
            }
        };

        socket.on('skip', async () => {
            await handleLeave();
        });

        socket.on('disconnect', async () => {
            await handleLeave();
            console.log(`User disconnected: ${socket.data.email}`);
            await redis.srem('online_users', socket.data.userId);
            const newCount = await getOnlineCount();
            io.emit('online_count', newCount);
        });
    });
};
