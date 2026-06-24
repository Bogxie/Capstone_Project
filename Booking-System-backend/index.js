import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'
import { router } from './routes/bookingRoutes.js'
import { initChatSocket } from './socket/chatSocket.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"],
    }
})

app.use('/api', router)

initChatSocket(io)

server.listen(process.env.PORT, () => {
    console.log("Testing chat app huhuhu")
    console.log(process.env.PORT)
})