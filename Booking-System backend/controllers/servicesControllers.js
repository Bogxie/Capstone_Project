// controllers/servicesControllers.js
import { db } from "../config/db.js";
import { services } from "../models/schema.js";
import { eq, asc } from "drizzle-orm";

const getThemeColor = (brand) => {
    const themes = {
        "Golden Hour": "header-golden",
        "Snoop Dough": "header-snoop",
        "Rental Projector": "header-projector"
    };
    return themes[brand] || "header-default";
};

const SERVICE_ORDER = ["Golden Hour", "Snoop Dough", "Rental Projector"];

export const getServicesConfig = async (req, res) => {
    try {
        const rows = await db
            .select()
            .from(services)
            .orderBy(asc(services.brand));

        const config = {};
        rows.forEach(row => {
            let options = row.options;
            let packages = row.packages;

            if (typeof options === 'string') {
                try {
                    options = JSON.parse(options);
                } catch (e) {
                    options = [];
                }
            }

            if (typeof packages === 'string') {
                try {
                    packages = JSON.parse(packages);
                } catch (e) {
                    packages = [];
                }
            }

            const formattedPackages = packages.map(pkg => ({
                ...pkg,
                price: typeof pkg.price === 'number' 
                    ? `₱${pkg.price.toLocaleString()}` 
                    : pkg.price
            }));

            config[row.brand] = {
                label: row.label || row.brand,
                options: options || [],
                packages: formattedPackages || [],
                theme: {
                    color: getThemeColor(row.brand)
                }
            };
        });

        const orderedConfig = {};
        SERVICE_ORDER.forEach(brand => {
            if (config[brand]) {
                orderedConfig[brand] = config[brand];
            }
        });

        res.status(200).json(orderedConfig);
    } catch (err) {
        console.error("Error fetching services config:", err);
        res.status(500).json({ error: "Failed to fetch services config" });
    }
};

export const updateServices = async (req, res) => {
    try {
        const updates = req.body;

        if (!updates || typeof updates !== 'object') {
            return res.status(400).json({ error: "Invalid data format" });
        }

        await db.transaction(async (tx) => {
            for (const [brand, data] of Object.entries(updates)) {
                let packages = data.packages || [];
                const formattedPackages = packages.map(pkg => {
                    let price = pkg.price;
                    if (typeof price === 'string') {
                        price = parseFloat(price.replace(/[₱,]/g, ''));
                    }
                    return {
                        ...pkg,
                        price: isNaN(price) ? 0 : price
                    };
                });

                await tx
                    .update(services)
                    .set({
                        label: data.label || brand,
                        options: data.options || [],
                        packages: formattedPackages,
                        updated_at: new Date()
                    })
                    .where(eq(services.brand, brand));
            }
        });

        const updatedRows = await db
            .select()
            .from(services)
            .orderBy(asc(services.brand));

        const config = {};
        updatedRows.forEach(row => {
            let options = row.options;
            let packages = row.packages;

            if (typeof options === 'string') {
                try {
                    options = JSON.parse(options);
                } catch (e) {
                    options = [];
                }
            }

            if (typeof packages === 'string') {
                try {
                    packages = JSON.parse(packages);
                } catch (e) {
                    packages = [];
                }
            }

            const formattedPackages = packages.map(pkg => ({
                ...pkg,
                price: typeof pkg.price === 'number' 
                    ? `₱${pkg.price.toLocaleString()}` 
                    : pkg.price
            }));

            config[row.brand] = {
                label: row.label,
                options: options || [],
                packages: formattedPackages || [],
                theme: {
                    color: getThemeColor(row.brand)
                }
            };
        });

        const orderedConfig = {};
        SERVICE_ORDER.forEach(brand => {
            if (config[brand]) {
                orderedConfig[brand] = config[brand];
            }
        });

        res.status(200).json(orderedConfig);

    } catch (err) {
        console.error("Error updating services:", err);
        res.status(500).json({
            error: "Failed to update services",
            details: err.message
        });
    }
};

// ✅ GET disabled services
export const getDisabledServices = async (req, res) => {
    try {
        const rows = await db
            .select({ brand: services.brand })
            .from(services)
            .where(eq(services.is_disabled, true));

        const disabledBrands = rows.map(row => row.brand);
        res.json({ disabledServices: disabledBrands });
    } catch (err) {
        console.error("Error fetching disabled services:", err);
        res.status(500).json({ error: "Failed to fetch disabled services" });
    }
};

// ✅ UPDATE disabled services
export const updateDisabledServices = async (req, res) => {
    try {
        const { disabledServices } = req.body;

        if (!Array.isArray(disabledServices)) {
            return res.status(400).json({ error: "disabledServices must be an array" });
        }

        const ALL_SERVICES = ["Golden Hour", "Snoop Dough", "Rental Projector"];

        await db.transaction(async (tx) => {
            for (const brand of ALL_SERVICES) {
                const isDisabled = disabledServices.includes(brand);
                await tx
                    .update(services)
                    .set({
                        is_disabled: isDisabled,
                        updated_at: new Date()
                    })
                    .where(eq(services.brand, brand));
            }
        });

        // Get updated list
        const rows = await db
            .select({ brand: services.brand })
            .from(services)
            .where(eq(services.is_disabled, true));

        const updatedDisabled = rows.map(row => row.brand);

        res.json({
            success: true,
            disabledServices: updatedDisabled
        });
    } catch (err) {
        console.error("Error updating disabled services:", err);
        res.status(500).json({ error: "Failed to update disabled services" });
    }
};