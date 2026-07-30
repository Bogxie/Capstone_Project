import express from 'express'
import { getServicesConfig, updateServices, getDisabledServices, updateDisabledServices } from "../controllers/servicesControllers.js";

export const router = express.Router()

router.get('/services', getServicesConfig );
router.put('/services', updateServices);
router.get('/services/disabled', getDisabledServices);
router.put('/services/disabled', updateDisabledServices);
