import { pool } from '../config/db.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure the uploads/cvs directory exists
        const uploadDir = 'uploads/cvs';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir); // Save CVs in the "uploads/cvs" directory
    },
    filename: (req, file, cb) => {
        // Sanitize the file name to remove special characters
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        cb(null, `${Date.now()}-${sanitizedFileName}`);
    },
});
export const upload = multer({ storage });

export async function handleRecruitment(req, res) {
    try {
        const { fullName, email, phone, position, experience, message } = req.body;
        const cvPath = req.file ? req.file.path : null;

        // Validate required fields
        if (!fullName || !email || !phone || !position || !experience || !message || !cvPath) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Insert the application into the applications table
        const insertQuery = `
            INSERT INTO applications (nom, email, tel, poste, experience, message, cv)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `;
        const result = await pool.query(insertQuery, [fullName, email, phone, position, experience, message, cvPath]);

        res.status(201).json({ message: 'Candidature envoyée avec succès', applicationId: result.rows[0].id });
    } catch (err) {
        console.error('Erreur lors de l\'envoi de la candidature:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}