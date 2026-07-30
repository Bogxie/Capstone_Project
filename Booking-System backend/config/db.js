import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import dotenv from 'dotenv';
import * as schema from '../models/schema.js'

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});


pool.on("connect", () => {
    console.log("Connected na sa database?");
});

pool.on("error", (err) => {
    console.log("Database error: ", err)
});

export const db = drizzle(pool, { schema });