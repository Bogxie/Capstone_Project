import { db } from "../config/db.js";
import { services } from "../models/schema.js";

export const getServicesConfig = async (req, res) => {
    try {
        const rows = await db.select().from(services);

        const config = {};
        rows.forEach(row => {
            config[row.brand] = {
                label: row.label,
                options: row.options,
                packages: row.packages,
            };
        });

        res.status(200).json(config);
    } catch (err) {
        console.error("Error fetching services config:", err);
        res.status(500).json({ error: "Failed to fetch services config" });
    }
};
