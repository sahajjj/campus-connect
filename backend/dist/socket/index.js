"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSocket = exports.getOnlineCount = exports.redis = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const ioredis_1 = __importDefault(require("ioredis"));
const redis_memory_server_1 = require("redis-memory-server");
const initializeRedis = async () => {
    try {
        exports.redis = new ioredis_1.default(process.env.REDIS_URL || 'redis://127.0.0.1:6379', {
            maxRetriesPerRequest: 1,
            retryStrategy: () => null // Stop retrying after first failure
        });
        // Wait for connection or error
        await new Promise((resolve, reject) => {
            exports.redis.on('ready', resolve);
            exports.redis.on('error', reject);
        });
        console.log('Connected to local Redis successfully');
    }
    catch (err) {
        console.warn('⚠️ Local Redis connection failed. Provisioning in-memory Redis...');
        const redisServer = new redis_memory_server_1.RedisMemoryServer();
        const host = await redisServer.getHost();
        const port = await redisServer.getPort();
        exports.redis = new ioredis_1.default({ host, port });
        console.log(`✅ Dynamically connected to in-memory Redis at redis://${host}:${port}`);
    }
    // Clear old data on restart
    await exports.redis.del('online_users');
    await exports.redis.del('text_queue');
    await exports.redis.del('video_queue');
};
initializeRedis();
const getOnlineCount = async () => {
    return await exports.redis.scard('online_users');
};
exports.getOnlineCount = getOnlineCount;
const initializeSocket = (io) => {
    // Middleware for socket authentication
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token)
            return next(new Error('Authentication required'));
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'secret');
            // Fetch user from DB
            const user = await User_1.default.findById(decoded.userId);
            if (!user || user.isBanned)
                return next(new Error('User banned or not found'));
            socket.data.userId = decoded.userId;
            socket.data.email = user.email;
            next();
        }
        catch (err) {
            next(new Error('Invalid token'));
        }
    });
    io.on('connection', async (socket) => {
        console.log(`User connected: ${socket.data.email}`);
        // Add to online users
        await exports.redis.sadd('online_users', socket.data.userId);
        const count = await (0, exports.getOnlineCount)();
        io.emit('online_count', count);
        // Queue for matchmaking
        socket.on('join_queue', async (config) => {
            const queueKey = config.type === 'text' ? 'text_queue' : 'video_queue';
            // Try to find a match
            const matchedId = await exports.redis.rpop(queueKey);
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
                }
                else {
                    // Partner disconnected, add current user back to queue
                    await exports.redis.lpush(queueKey, socket.id);
                }
            }
            else {
                // No match found, push self to queue
                await exports.redis.lpush(queueKey, socket.id);
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
            }
            else {
                // Remove from queue if they were in it
                await exports.redis.lrem('text_queue', 0, socket.id);
                await exports.redis.lrem('video_queue', 0, socket.id);
            }
        };
        socket.on('skip', async () => {
            await handleLeave();
        });
        socket.on('disconnect', async () => {
            await handleLeave();
            console.log(`User disconnected: ${socket.data.email}`);
            await exports.redis.srem('online_users', socket.data.userId);
            const newCount = await (0, exports.getOnlineCount)();
            io.emit('online_count', newCount);
        });
    });
};
exports.initializeSocket = initializeSocket;
