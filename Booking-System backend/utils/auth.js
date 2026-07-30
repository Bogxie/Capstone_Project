    import argon2 from 'argon2';
    import jwt from 'jsonwebtoken';
    import dotenv from 'dotenv';

    dotenv.config();

    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

    export const hashPassword = async (password) => {
        return await argon2.hash(password);
    }

    export const verifyPassword = async (hash, password) => {
        try {
            return await argon2.verify(hash, password);
        } catch {
            return false;
        }
    }

    export const generateToken = (user) => {
        return jwt.sign({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            user_role: user.user_role
        },
            JWT_SECRET, { expiresIn: '1h'}
        );
    };

    export const verifyToken = (token) => {
        try {
            return jwt.verify(token, JWT_SECRET)
        } catch {
            return null;
        }
    }