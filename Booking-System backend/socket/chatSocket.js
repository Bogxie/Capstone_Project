import { onlineUsers, getOnlineUsers } from "./sharedState.js";

export const initChatSocket = (io) => {
    console.log('✅ Chat socket initialized!');

    const broadcastUserList = () => {
        io.to("admin-room").emit("user-list", getOnlineUsers());
    };

    io.on("connection", (socket) => {
        console.log(`🔌 May nag-connect! Socket ID: ${socket.id}`);
        socket.on("test-connection", () => {
            socket.emit("test-response", { message: "Connection is working!" });
        });

        socket.on("register", ({ username, role }) => {
            console.log(`🔐 Register event received!`, { username, role }); 
            
            if (role === "Admin") {
                socket.join("admin-room");
                broadcastUserList();
                console.log(`👑 Admin ${username} joined admin room`); 
            } else {
                socket.join(username);
                onlineUsers.set(username, socket.id);
                broadcastUserList();
                console.log(`👤 User ${username} is online`); 
            }
        });

        // User -> Admin
        socket.on("user-message", ({ from, message }) => {
            console.log(`💬 User ${from}: ${message}`); // <- Add this
            io.to("admin-room").emit("receive-message", { from, message, sender: "user" });
        });

        // Admin -> specific User
        socket.on("admin-message", ({ to, message }) => {
            console.log(`👑 Admin -> ${to}: ${message}`); // <- Add this
            io.to(to).emit("receive-message", { from: "admin", message, sender: "admin" });
        });

        socket.on("disconnect", () => {
            console.log(`❌ May nag-disconnect! Socket ID: ${socket.id}`);
            for (const [username, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(username);
                    broadcastUserList();
                    break;
                }
            }
        });
    });
};