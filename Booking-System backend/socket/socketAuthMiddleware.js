import { verifyToken } from "../utils/auth.js";
import { db } from "../config/db.js";
import { users } from "../models/schema.js";
import { eq } from "drizzle-orm";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            socket.user = null;
            return next();
        }
 
        const decoded = verifyToken(token);
        if (!decoded) {
            socket.user = null;
            return next();
        }
 
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.user_id, decoded.user_id));
 
        socket.user = (user && user.is_active)
            ? {
                user_id: user.user_id,
                username: user.username,
                user_role: user.user_role
            }
            : null;
 
        next();
    } catch (err) {
        console.error('Socket auth error:', err);
        socket.user = null;
        next();
    }
};
 

