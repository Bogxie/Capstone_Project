import { pgTable, serial, text, integer, jsonb, timestamp } from "drizzle-orm/pg-core";

export const services = pgTable("services", {
    id: serial("id").primaryKey(),
    brand: text("brand").notNull(),
    label: text("label").notNull(),
    options: jsonb("options"),
    packages: jsonb("packages"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const municipalities = pgTable("municipalities", {
    municipality_id: serial("municipality_id").primaryKey(),
    municipality: text("municipality").notNull(),
    fee: integer("fee").notNull(),
});