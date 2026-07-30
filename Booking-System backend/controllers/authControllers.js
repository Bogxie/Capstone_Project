import { db } from "../config/db.js";
import { users } from "../models/schema.js";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters" });
        }

        if (username.length < 3 || username.length > 50) {
            return res.status(400).json({ error: "Username must be 3-50 characters" });
        }

        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ error: "Username can only contain letters, numbers, and underscore" });
        }

        const existing = await db.select().from(users).where(eq(users.email, email));
        if (existing.length > 0) {
            return res.status(409).json({ error: "Email already registered" });
        }

        const existingUsername = await db.select().from(users).where(eq(users.username, username));
        if (existingUsername.length > 0) {
            return res.status(409).json({ error: "Username already taken" });
        }
        const hashed = await hashPassword(password);

        const [newUser] = await db.insert(users).values({
            username,
            email,
            password_hash: hashed
        }).returning();

        const token = generateToken(newUser);
        const { password_hash, ...userWithoutPassword } = newUser;

        res.status(201).json({
            success: true,
            message: "Registration successful",
            user: userWithoutPassword,
            token
        });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: "Registration failed" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required" });
        }

        const [user] = await db.select().from(users).where(eq(users.email, email));
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const isValid = await verifyPassword(user.password_hash, password);
        if (!isValid) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = generateToken(user);
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword,
            token
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: "Login failed" });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const [user] = await db.select().from(users).where(eq(users.user_id, req.user.user_id));
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { password_hash, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } catch (err) {
        console.error('Get user error:', err);
        res.status(500).json({ error: "Failed to get user" });
    }
};