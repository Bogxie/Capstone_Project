import express from "express";
import { getServicesConfig } from "../controllers/servicesControllers.js";
import { getMunicipalities } from "../controllers/municipalitiesControllers.js";

export const router = express.Router()

router.get('/services', getServicesConfig );
router.get('/municipalities', getMunicipalities);


