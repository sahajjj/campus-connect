import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth';
import { initializeSocket } from './socket';

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
    },
});

app.use(helmet());
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
}));
app.use(express.json());

// Extend express request
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// Setup Socket
initializeSocket(io);

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/omecllg');
        console.log('Connected to local MongoDB successfully');
    } catch (err: any) {
        console.warn('⚠️ Local MongoDB connection failed (is MongoDB installed/running?). Automatically provisioning a temporary in-memory database...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log(`✅ Dynamically connected to fully-functional in-memory MongoDB at ${uri}. Data will reset when the server restarts.`);
        } catch (memErr: any) {
            console.error('❌ Failed to start the memory server database:', memErr.message);
            process.exit(1);
        }
    }

    server.listen(PORT, () => {
        console.log(`🚀 Server running perfectly on port ${PORT}`);
    });
};

connectDB();

