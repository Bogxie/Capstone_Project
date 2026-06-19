import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import http from 'http'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
app.use(cors())

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
        methods: ["GET", "POST"],
    }
})

const onlineUsers = new Map();

const broadcastUserList = () => {
    io.to("admin-room").emit("user-list", Array.from(onlineUsers.keys()));
};

io.on("connection", (socket) => {
    console.log(`May nag-connect! Socket ID: ${socket.id}`);

    socket.on("register", ({ username, role }) => {
        if (role === "Admin") {
            socket.join("admin-room");
            broadcastUserList();
        } else {
            socket.join(username);
            onlineUsers.set(username, socket.id);
            broadcastUserList();
        }
    });

    // User -> Admin
    socket.on("user-message", ({ from, message }) => {
        io.to("admin-room").emit("receive-message", { from, message, sender: "user" });
    });

    // Admin -> specific User
    socket.on("admin-message", ({ to, message }) => {
        io.to(to).emit("receive-message", { from: "admin", message, sender: "admin" });
    });

    socket.on("disconnect", () => {
        console.log(`May nag-disconnect! Socket ID: ${socket.id}`);
        for (const [username, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(username);
                broadcastUserList();
                break;
            }
        }
    });
});

server.listen(process.env.PORT, () => {
    console.log("Testing chat app huhuhu")
    console.log(process.env.PORT)
})