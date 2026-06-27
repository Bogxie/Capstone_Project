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