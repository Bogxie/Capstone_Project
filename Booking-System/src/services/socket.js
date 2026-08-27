import io from 'socket.io-client';

export const socket = io.connect("http://localhost:3001", {
    auth: {
        token: localStorage.getItem('token') || null
    }
});

socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
});

socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
});

export const refreshSocketAuth = (token) => {
    socket.auth = { token: token || null };
    socket.disconnect();
    socket.connect();
};