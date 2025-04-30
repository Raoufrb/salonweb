import express from 'express';
import { auth } from '../middlewares/auth.js';
import { pool } from '../config/db.js';

const router = express.Router();

// Employee Profile
router.get('/profile', auth, async (req, res) => {
    if (req.user.role !== 'employe') {
        return res.status(403).json({ error: 'Accès interdit' });
    }

    const employeId = req.user.id;

    try {
        // Fetch employee information
        const employeQuery = `SELECT nom, email FROM employes WHERE id = $1`;
        const employeResult = await pool.query(employeQuery, [employeId]);

        // Fetch employee appointments
        const rdvsQuery = `SELECT * FROM rdvs WHERE employe_id = $1`;
        const rdvsResult = await pool.query(rdvsQuery, [employeId]);

        res.status(200).json({
            employe: employeResult.rows[0],
            rdvs: rdvsResult.rows,
        });
    } catch (err) {
        console.error('Erreur lors de la récupération du profil employé:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

export default router;