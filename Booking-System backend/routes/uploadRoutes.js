// routes/uploadRoutes.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads/feedback');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP are allowed.'), false);
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } 
});


router.post('/upload/multiple', upload.array('images', 5), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No files uploaded'
            });
        }

        const baseUrl = process.env.BASE_URL || `http://localhost:3001`;
        const urls = req.files.map(file => {
            return `${baseUrl}/uploads/feedback/${file.filename}`;
        });

        console.log('📤 Uploaded images:', urls);

        res.status(200).json({
            success: true,
            urls: urls
        });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({
            success: false,
            error: 'Failed to upload images'
        });
    }
});