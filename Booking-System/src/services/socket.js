import io from 'socket.io-client';

export const socket = io.connect("http://localhost:3001");

socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
});

socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
});

socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
});
