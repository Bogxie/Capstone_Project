import { db } from "../config/db.js";
import { feedbacks, bookings, users } from "../models/schema.js";
import { eq, desc, sql } from "drizzle-orm";

export const createFeedback = async (req, res) => {
    try {
        const { bookingId, userId, rating, comment, isAnonymous, imageUrls } = req.body;

        console.log('📥 Creating feedback:', { bookingId, userId, rating });

        if (!bookingId || !rating) {
            return res.status(400).json({
                success: false,
                error: "Booking ID and rating are required"
            });
        }

        const bookingExists = await db
            .select()
            .from(bookings)
            .where(eq(bookings.booking_id, parseInt(bookingId)));

        if (bookingExists.length === 0) {
            return res.status(404).json({
                success: false,
                error: `Booking with ID ${bookingId} not found`
            });
        }

        const existingFeedback = await db
            .select()
            .from(feedbacks)
            .where(eq(feedbacks.booking_id, parseInt(bookingId)));

        if (existingFeedback.length > 0) {
            return res.status(400).json({
                success: false,
                error: "Feedback already exists for this booking"
            });
        }

        const result = await db
            .insert(feedbacks)
            .values({
                booking_id: parseInt(bookingId),
                user_id: userId ? parseInt(userId) : null,
                rating: parseInt(rating),
                comment: comment || null,
                is_anonymous: isAnonymous || false,
                image_url: imageUrls || [],
            })
            .returning();

        const feedbackWithUser = await db
            .select()
            .from(feedbacks)
            .leftJoin(users, eq(feedbacks.user_id, users.user_id))
            .where(eq(feedbacks.feedback_id, result[0].feedback_id));

        const row = feedbackWithUser[0];
        const feedback = row.feedbacks;
        const user = row.users;
        const isAnonymousFlag = feedback.is_anonymous || false;

        const formatted = {
            feedback_id: feedback.feedback_id,
            booking_id: feedback.booking_id,
            user_id: feedback.user_id,
            rating: feedback.rating || 0,
            comment: feedback.comment || '',
            is_anonymous: isAnonymousFlag,
            isAnonymous: isAnonymousFlag,
            image_url: feedback.image_url || [],
            imageUrls: feedback.image_url || [],
            created_at: feedback.created_at,
            updated_at: feedback.updated_at,
            // ✅ KEEP ACTUAL USERNAME
            username: user?.username || 'User',
        };

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: formatted
        });
    } catch (err) {
        console.error("Error creating feedback:", err);
        res.status(500).json({
            success: false,
            error: "Failed to submit feedback: " + err.message
        });
    }
};

export const getFeedbackByBooking = async (req, res) => {
    try {
        const { bookingId } = req.params;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                error: "Booking ID is required"
            });
        }

        const result = await db
            .select()
            .from(feedbacks)
            .leftJoin(users, eq(feedbacks.user_id, users.user_id))
            .where(eq(feedbacks.booking_id, parseInt(bookingId)));

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                error: "No feedback found for this booking"
            });
        }

        const row = result[0];
        const feedback = row.feedbacks;
        const user = row.users;
        const isAnonymousFlag = feedback.is_anonymous || false;

        const formatted = {
            feedback_id: feedback.feedback_id,
            booking_id: feedback.booking_id,
            user_id: feedback.user_id,
            rating: feedback.rating || 0,
            comment: feedback.comment || '',
            is_anonymous: isAnonymousFlag,
            isAnonymous: isAnonymousFlag,
            image_url: feedback.image_url || [],
            imageUrls: feedback.image_url || [],
            created_at: feedback.created_at,
            updated_at: feedback.updated_at,
            // ✅ KEEP ACTUAL USERNAME
            username: user?.username || 'User',
        };

        res.status(200).json({
            success: true,
            data: formatted
        });
    } catch (err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch feedback"
        });
    }
};

export const getAllFeedbacks = async (req, res) => {
    try {
        const { limit = 20, page = 1, rating, sort = 'desc' } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let query = db
            .select()
            .from(feedbacks)
            .leftJoin(users, eq(feedbacks.user_id, users.user_id))
            .leftJoin(bookings, eq(feedbacks.booking_id, bookings.booking_id));

        if (rating) {
            query = query.where(eq(feedbacks.rating, parseInt(rating)));
        }

        if (sort === 'asc') {
            query = query.orderBy(feedbacks.created_at);
        } else {
            query = query.orderBy(desc(feedbacks.created_at));
        }

        query = query.limit(parseInt(limit)).offset(offset);

        const allFeedbacks = await query;

        const totalCount = await db
            .select({ count: sql`COUNT(*)` })
            .from(feedbacks);

        const formatted = allFeedbacks.map(row => {
            const feedback = row.feedbacks;
            const user = row.users;
            const booking = row.bookings;
            const isAnonymousFlag = feedback.is_anonymous || false;

            return {
                feedback_id: feedback.feedback_id,
                booking_id: feedback.booking_id,
                user_id: feedback.user_id,
                rating: feedback.rating || 0,
                comment: feedback.comment || '',
                is_anonymous: isAnonymousFlag,
                isAnonymous: isAnonymousFlag,
                image_url: feedback.image_url || [],
                imageUrls: feedback.image_url || [],
                created_at: feedback.created_at,
                updated_at: feedback.updated_at,
                // ✅ KEEP ACTUAL USERNAME
                username: user?.username || 'User',
                service: booking?.service || null,
            };
        });

        res.status(200).json({
            success: true,
            count: formatted.length,
            total: parseInt(totalCount[0].count),
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(parseInt(totalCount[0].count) / parseInt(limit)),
            data: formatted
        });
    } catch (err) {
        console.error("Error fetching all feedbacks:", err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch feedbacks: " + err.message
        });
    }
};

export const updateFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment, isAnonymous, imageUrls } = req.body;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Feedback ID is required"
            });
        }

        const existing = await db
            .select()
            .from(feedbacks)
            .where(eq(feedbacks.feedback_id, parseInt(id)));

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Feedback not found"
            });
        }

        const updateData = {};
        if (rating !== undefined) updateData.rating = parseInt(rating);
        if (comment !== undefined) updateData.comment = comment;
        if (isAnonymous !== undefined) updateData.is_anonymous = isAnonymous;
        if (imageUrls !== undefined) updateData.image_url = imageUrls;
        updateData.updated_at = new Date();

        const result = await db
            .update(feedbacks)
            .set(updateData)
            .where(eq(feedbacks.feedback_id, parseInt(id)))
            .returning();

        const updatedWithUser = await db
            .select()
            .from(feedbacks)
            .leftJoin(users, eq(feedbacks.user_id, users.user_id))
            .where(eq(feedbacks.feedback_id, result[0].feedback_id));

        const row = updatedWithUser[0];
        const feedback = row.feedbacks;
        const user = row.users;
        const isAnonymousFlag = feedback.is_anonymous || false;

        const formatted = {
            feedback_id: feedback.feedback_id,
            booking_id: feedback.booking_id,
            user_id: feedback.user_id,
            rating: feedback.rating || 0,
            comment: feedback.comment || '',
            is_anonymous: isAnonymousFlag,
            isAnonymous: isAnonymousFlag,
            image_url: feedback.image_url || [],
            imageUrls: feedback.image_url || [],
            created_at: feedback.created_at,
            updated_at: feedback.updated_at,
            // ✅ KEEP ACTUAL USERNAME
            username: user?.username || 'User',
        };

        res.status(200).json({
            success: true,
            message: "Feedback updated successfully",
            data: formatted
        });
    } catch (err) {
        console.error("Error updating feedback:", err);
        res.status(500).json({
            success: false,
            error: "Failed to update feedback"
        });
    }
};

export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Feedback ID is required"
            });
        }

        const existing = await db
            .select()
            .from(feedbacks)
            .where(eq(feedbacks.feedback_id, parseInt(id)));

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                error: "Feedback not found"
            });
        }

        const result = await db
            .delete(feedbacks)
            .where(eq(feedbacks.feedback_id, parseInt(id)))
            .returning({ feedback_id: feedbacks.feedback_id });

        res.status(200).json({
            success: true,
            message: "Feedback deleted successfully",
            data: { feedback_id: result[0].feedback_id }
        });
    } catch (err) {
        console.error("Error deleting feedback:", err);
        res.status(500).json({
            success: false,
            error: "Failed to delete feedback"
        });
    }
};

export const getFeedbackStats = async (req, res) => {
    try {
        const { serviceId } = req.params;

        let query = db
            .select({
                average_rating: sql`ROUND(AVG(${feedbacks.rating})::numeric, 1)`,
                total_reviews: sql`COUNT(${feedbacks.feedback_id})`,
                rating_5: sql`COUNT(CASE WHEN ${feedbacks.rating} = 5 THEN 1 END)`,
                rating_4: sql`COUNT(CASE WHEN ${feedbacks.rating} = 4 THEN 1 END)`,
                rating_3: sql`COUNT(CASE WHEN ${feedbacks.rating} = 3 THEN 1 END)`,
                rating_2: sql`COUNT(CASE WHEN ${feedbacks.rating} = 2 THEN 1 END)`,
                rating_1: sql`COUNT(CASE WHEN ${feedbacks.rating} = 1 THEN 1 END)`,
            })
            .from(feedbacks);

        if (serviceId) {
            query = query
                .innerJoin(bookings, eq(feedbacks.booking_id, bookings.booking_id))
                .where(eq(bookings.service, serviceId));
        }

        const result = await query;

        const stats = {
            average: parseFloat(result[0].average_rating) || 0,
            total: parseInt(result[0].total_reviews) || 0,
            distribution: {
                5: parseInt(result[0].rating_5) || 0,
                4: parseInt(result[0].rating_4) || 0,
                3: parseInt(result[0].rating_3) || 0,
                2: parseInt(result[0].rating_2) || 0,
                1: parseInt(result[0].rating_1) || 0,
            }
        };

        if (stats.total > 0) {
            stats.percentages = {
                5: Math.round((stats.distribution[5] / stats.total) * 100),
                4: Math.round((stats.distribution[4] / stats.total) * 100),
                3: Math.round((stats.distribution[3] / stats.total) * 100),
                2: Math.round((stats.distribution[2] / stats.total) * 100),
                1: Math.round((stats.distribution[1] / stats.total) * 100),
            };
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (err) {
        console.error("Error getting feedback stats:", err);
        res.status(500).json({
            success: false,
            error: "Failed to get feedback statistics"
        });
    }
};

export const getFeedbacksByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required"
            });
        }

        const result = await db
            .select()
            .from(feedbacks)
            .leftJoin(bookings, eq(feedbacks.booking_id, bookings.booking_id))
            .where(eq(feedbacks.user_id, parseInt(userId)))
            .orderBy(desc(feedbacks.created_at));

        const formatted = result.map(row => {
            const feedback = row.feedbacks;
            const booking = row.bookings;
            return {
                feedback_id: feedback.feedback_id,
                booking_id: feedback.booking_id,
                rating: feedback.rating || 0,
                comment: feedback.comment || '',
                is_anonymous: feedback.is_anonymous || false,
                image_url: feedback.image_url || [],
                imageUrls: feedback.image_url || [],
                created_at: feedback.created_at,
                updated_at: feedback.updated_at,
                service: booking?.service || null,
            };
        });

        res.status(200).json({
            success: true,
            count: formatted.length,
            data: formatted
        });
    } catch (err) {
        console.error("Error fetching user feedbacks:", err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch user feedbacks"
        });
    }
};