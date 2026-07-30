import { eq } from "drizzle-orm";
import { db } from "../config/db.js";
import { municipalities } from "../models/schema.js";

export const getMunicipalities = async (req, res) => {
    try {
        const rows = await db.select().from(municipalities);
        res.status(200).json(rows);
    } catch (err) {
        console.error("Error fetching municipalities:", err);
        res.status(500).json({ error: "Failed to fetch municipalities" });
    }
}

export const updateMunicipalities = async (req, res) => {
    try {
        const updateFees = req.body;

        if (!Array.isArray(updateFees) || updateFees.length === 0) {
            return res.status(400).json({
                error: "Invalid data format. Expected array of municipality updates"
            });
        }

        for (const item of updateFees) {
            if (!item.municipality_id || typeof item.fee !== 'number') {
                return res.status(400).json({
                    error: "Each item must have municipality_id and fee (number)"
                });
            }
        }

        await db.transaction(async (tx) => {
            for (const item of updateFees) {
                await tx
                    .update(municipalities)
                    .set({
                        fee: item.fee,
                        updatedAt: new Date()
                    })
                    .where(eq(municipalities.municipality_id, item.municipality_id));
            }
        });

        const updated = await db.select().from(municipalities);
        res.status(200).json(updated);

    } catch (err) {
        console.error("Error updating municipalities: ", err);
        res.status(500).json({ error: "Failed to update municipalities" });
    }
}