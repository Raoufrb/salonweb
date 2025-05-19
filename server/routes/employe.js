import express from 'express';
import { auth } from '../middlewares/auth.js';
import { pool } from '../config/db.js';
import { envoyerEmail } from '../utils/mailer.js';

const router = express.Router();

// ✅ Employee Profile and RDVs
router.get('/profile', auth, async (req, res) => {
  if (req.user.role !== 'employe') {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  const employeId = req.user.id;

  try {
    // 📌 Employee Info
    const employeQuery = `SELECT nom, email FROM employes WHERE id = $1`;
    const employeResult = await pool.query(employeQuery, [employeId]);

    if (employeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employé introuvable' });
    }

    // 📋 Retrieve all RDVs (filter if necessary)
    const rdvsQuery = `
      SELECT * FROM rdvs
      WHERE statut = 'en attente' OR employe_id = $1
      ORDER BY date, heure
    `;
    const rdvsResult = await pool.query(rdvsQuery, [employeId]);

    res.status(200).json({
      employe: employeResult.rows[0],
      rdvs: rdvsResult.rows,
    });
  } catch (err) {
    console.error('❌ Erreur profil employé:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


// ✅ Update RDV Status
router.put('/rdvs/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  const validStatus = ['validé', 'refusé'];

  if (!validStatus.includes(statut)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  try {
    await pool.query('UPDATE rdvs SET statut = $1 WHERE id = $2', [statut, id]);
    res.status(200).json({ message: 'Statut mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur mise à jour RDV:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



// ✅ Update Employee Name
router.put('/update-name', auth, async (req, res) => {
  const { nom } = req.body;

  if (!nom) {
    return res.status(400).json({ error: 'Nom requis' });
  }

  try {
    await pool.query('UPDATE employes SET nom = $1 WHERE id = $2', [nom, req.user.id]);
    res.status(200).json({ message: 'Nom mis à jour' });
  } catch (err) {
    console.error('Erreur mise à jour nom employé:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
