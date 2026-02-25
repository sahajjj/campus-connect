"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const socket_1 = require("./socket");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST'],
    },
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
}));
app.use(express_1.default.json());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);
app.use('/api/auth', auth_1.default);
// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});
// Setup Socket
(0, socket_1.initializeSocket)(io);
const PORT = process.env.PORT || 5000;
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/omecllg');
        console.log('Connected to local MongoDB successfully');
    }
    catch (err) {
        console.warn('⚠️ Local MongoDB connection failed (is MongoDB installed/running?). Automatically provisioning a temporary in-memory database...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose_1.default.connect(uri);
            console.log(`✅ Dynamically connected to fully-functional in-memory MongoDB at ${uri}. Data will reset when the server restarts.`);
        }
        catch (memErr) {
            console.error('❌ Failed to start the memory server database:', memErr.message);
            process.exit(1);
        }
    }
    server.listen(PORT, () => {
        console.log(`🚀 Server running perfectly on port ${PORT}`);
    });
};
connectDB();
