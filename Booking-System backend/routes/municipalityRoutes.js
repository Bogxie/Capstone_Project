import express from 'express';
import { getMunicipalities, updateMunicipalities } from "../controllers/municipalitiesControllers.js";

export const router = express.Router()

router.get('/municipalities', getMunicipalities);
router.put('/municipalities', updateMunicipalities);