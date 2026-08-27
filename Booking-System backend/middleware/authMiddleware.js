import { verifyToken } from "../utils/auth.js";
import { db } from "../config/db.js";
import { users } from "../models/schema.js";
import { eq } from "drizzle-orm";

export const authenticate = async (req, res, next) => {
    console.log('🔒 Authenticate middleware hit for:', req.method, req.originalUrl);
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: "Authentication required" });
        }
        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const [user] = await db.select().from(users).where(eq(users.user_id, decoded.user_id));
        if (!user || !user.is_active) {
            return res.status(401).json({ error: "User not found or inactive" });
        }

        req.user = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            user_role: user.user_role
        };

        next();
    } catch (err) {
        console.error('Auth error:', err);
        res.status(500).json({ error: "Authentication failed" });
    }
}