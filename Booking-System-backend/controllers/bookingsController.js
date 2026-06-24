import { pool } from "../config/db.js";

export const getServicesConfig = async (req, res) => {
    try {
        const { rows } = await pool.query(`
            SELECT 
                s.id,
                s.brand,
                s.label,
                s.options,
                s.packages,
                s.created_at,
                s.updated_at
            FROM services s
        `);

        const config = {};
        rows.forEach(row => {
            config[row.brand] = {
                label: row.label,
                options: row.options,
                packages: row.packages,
                theme: { color: "#e5e7eb" }  // ← Default theme lang
            };
        });

        res.status(200).json(config);
    } catch (err) {
        console.error("Error fetching services config:", err);
        res.status(500).json({ error: "Failed to fetch services config" });
    }
};