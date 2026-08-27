import { pgTable, serial, text, integer, varchar, jsonb, timestamp, boolean, decimal, date, index, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
    user_id: serial("user_id").primaryKey(),
    username: varchar("username", { length: 50 }).notNull().unique(),
    email: varchar("email", { length: 50 }).notNull().unique(),
    password_hash: text("password_hash").notNull(),
    user_role: varchar("user_role", { length: 20 }).default("User"),
    profile_picture_url: varchar("profile_picture_url"),
    is_active: boolean("is_active").default(true),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const services = pgTable("services", {
    id: serial("id").primaryKey(),
    brand: text("brand").notNull(),
    label: text("label").notNull(),
    options: jsonb("options"),
    packages: jsonb("packages"),
    is_disabled: boolean("is_disabled").default(false),
    created_At: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_At: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

export const municipalities = pgTable("municipalities", {
    municipality_id: serial("municipality_id").primaryKey(),
    municipality: text("municipality").notNull(),
    fee: integer("fee").notNull(),
});

export const bookings = pgTable("bookings", {
    booking_id: serial("booking_id").primaryKey(),
    full_name: varchar("full_name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    phone_num: varchar("phone_num", { length: 20 }).notNull(),
    service: varchar("service", { length: 100 }).notNull(),
    service_type: varchar("service_type", { length: 100 }).notNull(),
    package_name: varchar("package_name", { length: 100 }).notNull(),
    rental_fee: decimal("rental_fee", { precision: 10, scale: 2 }).notNull(),
    municipality: varchar("municipality", { length: 100 }).notNull(),
    delivery_fee: decimal("delivery_fee", { precision: 10, scale: 2 }).notNull(),
    venue: text("venue").notNull(),
    lat: decimal("lat", { precision: 10, scale: 8 }).notNull(),
    lng: decimal("lng", { precision: 11, scale: 8 }).notNull(),
    description: text("description"),
    status: varchar("status", { length: 50 }).default("Pending").notNull(),
    payment_method: varchar("payment_method", { length: 50 }).notNull(),
    downpayment: decimal("downpayment", { precision: 10, scale: 2 }).default("1000").notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    tax: decimal("tax", { precision: 10, scale: 2 }).notNull(),
    time_start: varchar("time_start", { length: 20 }).notNull(),
    time_end: varchar("time_end", { length: 20 }).notNull(),
    booking_date: date("booking_date").notNull(),
    month: varchar("month", { length: 20 }).notNull(),
    day: integer("day").notNull(),
    year: integer("year").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
    user_id: integer("user_id").references(() => users.user_id, { onDelete: "set null" }),
}, (table) => ({
    userIdx: index("idx_bookings_user_id").on(table.user_id),
    dateIdx: index("idx_bookings_booking_date").on(table.booking_date),
    statusIdx: index("idx_bookings_status").on(table.status),
    serviceIdx: index("idx_bookings_service").on(table.service),
    activeBookingUnique: uniqueIndex("idx_bookings_active_unique")
        .on(table.booking_date, table.service)
        .where(sql`${table.status} != 'Cancelled'`),
}));

export const feedbacks = pgTable("feedbacks", {
    feedback_id: serial("feedback_id").primaryKey(),
    booking_id: integer("booking_id").references(() => bookings.booking_id, { onDelete: "cascade" }),
    user_id: integer("user_id").references(() => users.user_id, { onDelete: "set null" }),
    rating: integer("rating").notNull(),
    comment: text("comment"),
    is_anonymous: boolean("is_anonymous").default(false),
    image_url: text("image_url").array(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
}, (table) => ({
    bookingIdx: index("idx_feedbacks_booking_id").on(table.booking_id),
    userIdx: index("idx_feedbacks_user_id").on(table.user_id),
    ratingIdx: index("idx_feedbacks_rating").on(table.rating),
    bookingUnique: uniqueIndex("idx_feedbacks_booking_unique").on(table.booking_id),
}));

export const blackoutDates = pgTable("blackout_dates", {
    blackout_id: serial("blackout_id").primaryKey(),
    date: date("date").notNull().unique(),
    created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});