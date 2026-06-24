import express from "express";
import { getServicesConfig } from "../controllers/bookingsController.js";

export const router = express.Router()

router.get('/services', getServicesConfig );


