import { db } from "../config/db.js";
import { blackoutDates } from "../models/schema.js";

export const getBlackoutDates = async (req, res) => {
    console.log('🎯 getBlackoutDates CONTROLLER hit!'); 
    try {
        const dates = await db.select().from(blackoutDates);
        console.log('📦 Found dates:', dates.map(d => d.date)); // ✅ Add log
        res.status(200).json({
            success: true,
            data: dates.map(d => d.date)
        });
    } catch (err) {
        console.error("Error fetching blackout dates:", err);
        res.status(500).json({ success: false, error: "Failed to fetch blackout dates" });
    }
};

export const updateBlackoutDates = async (req, res) => {
    try {
        const { dates } = req.body;
        console.log('📝 Updating blackout dates:', dates); 

        if (!Array.isArray(dates)) {
            return res.status(400).json({ success: false, error: "dates must be an array" });
        }

        // ✅ Delete and insert new dates
        await db.transaction(async (tx) => {
            await tx.delete(blackoutDates);
            if (dates.length > 0) {
                await tx.insert(blackoutDates).values(
                    dates.map(date => ({ date }))
                );
            }
        });

        // ✅ Get updated dates from database
        const updated = await db.select().from(blackoutDates);
        const dateList = updated.map(d => d.date);
        console.log('✅ Saved dates:', dateList);

        // ✅ Emit socket event with updated dates
        const io = req.app.get('io');
        if (io) {
            console.log('📤 Emitting blackout-dates-changed:', dateList);
            io.emit('blackout-dates-changed', { dates: dateList });
        }

        res.status(200).json({ success: true, data: dateList });

    } catch (err) {
        console.error("Error updating blackout dates:", err);
        res.status(500).json({ success: false, error: "Failed to update blackout dates" });
    }
};