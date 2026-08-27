import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import path from 'path'
import { fileURLToPath } from 'url'
import { Server } from 'socket.io'
import { router as authRouter } from './routes/authRoutes.js'
import { router as serviceRouter } from './routes/servicesRoutes.js'
import { router as municipalityRouter } from './routes/municipalityRoutes.js'
import { router as userRouter } from './routes/userRoutes.js'
import { router as bookingRouter } from './routes/bookingRoutes.js'
import { router as feedbackRouter } from './routes/feedbackRoutes.js'
import { router as uploadRouter } from './routes/uploadRoutes.js' 
import { router as blackoutRouter } from './routes/blackoutRoutes.js'
import { initChatSocket } from './socket/chatSocket.js'
import { initBookingSocket } from './socket/tempBooking.js'
import { socketAuthMiddleware } from './socket/socketAuthMiddleware.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

const routers = [authRouter, serviceRouter, municipalityRouter, userRouter, bookingRouter, feedbackRouter, uploadRouter, blackoutRouter]

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

routers.forEach(router => app.use('/api', router));

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"],
    }
})

app.set('io', io);

io.use(socketAuthMiddleware);
initChatSocket(io);
initBookingSocket(io);

io.on('connection', (socket) => {
    console.log('🟢 Client connected:', socket.id);

    socket.on('services-status-changed', (data) => {
        console.log('📢 Services status changed:', data.disabledServices);
        socket.broadcast.emit('services-status-changed', data);
    });

    socket.on('disconnect', () => {
        console.log('🔴 Client disconnected:', socket.id);
    });
});

server.listen(process.env.PORT, () => {
    console.log("✅ Server running on port:", process.env.PORT)
})