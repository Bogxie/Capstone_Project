import { eq, desc, and, ne } from "drizzle-orm";
import { db } from "../config/db.js";
import { users } from "../models/schema.js";
import { hashPassword } from "../utils/auth.js";

export const getAllUsers = async (req, res) => {
    try {
        const allUsers = await db
            .select({
                id: users.user_id,
                username: users.username,
                email: users.email,
                role: users.user_role,
                status: users.is_active,
                profile: users.profile_picture_url,
                joinedDate: users.created_at,
            })
            .from(users)
            .orderBy(desc(users.created_at));

        const formattedUsers = allUsers.map(user => ({
            ...user,
            status: user.status ? "Active" : "Inactive",
            joinedDate: user.joinedDate ? new Date(user.joinedDate).toISOString().split('T')[0] : 'N/A',
        }));

        res.status(200).json(formattedUsers);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const [user] = await db
            .select({
                id: users.user_id,
                username: users.username,
                email: users.email,
                role: users.user_role,
                status: users.is_active,
                profile: users.profile_picture_url,
                joinedDate: users.created_at,
            })
            .from(users)
            .where(eq(users.user_id, parseInt(id)));

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.status(200).json({
            ...user,
            status: user.status ? "Active" : "Inactive",
        });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { username, email, password, role, status } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username, email, and password are required'
            });
        }

        const existingEmail = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

        if (existingEmail.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Email already exists'
            });
        }

        const existingUsername = await db
            .select()
            .from(users)
            .where(eq(users.username, username));

        if (existingUsername.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Username already exists'
            });
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({
                username,
                email,
                password_hash: hashedPassword,
                user_role: role || 'User',
                is_active: status === 'Active' ? true : false,
            })
            .returning();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: {
                id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.user_role,
                status: newUser.is_active ? 'Active' : 'Inactive',
                joinedDate: new Date(newUser.created_at).toISOString().split('T')[0],
            }
        });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to create user'
        });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, role, status } = req.body;
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.user_id, parseInt(id)));

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        if (email) {
            const emailTaken = await db
                .select()
                .from(users)
                .where(and(
                    eq(users.email, email),
                    ne(users.user_id, parseInt(id))
                ));

            if (emailTaken.length > 0) {
                return res.status(409).json({
                    success: false,
                    error: 'Email already taken'
                });
            }
        }
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (role) updateData.user_role = role;
        if (status !== undefined) updateData.is_active = status === 'Active';

        const [updatedUser] = await db
            .update(users)
            .set({
                ...updateData,
                updated_at: new Date(),
            })
            .where(eq(users.user_id, parseInt(id)))
            .returning();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: {
                id: updatedUser.user_id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.user_role,
                status: updatedUser.is_active ? 'Active' : 'Inactive',
            }
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to update user'
        });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.user_id, parseInt(id)));

        if (existingUser.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await db
            .delete(users)
            .where(eq(users.user_id, parseInt(id)));

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
};  