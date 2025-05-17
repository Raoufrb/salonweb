import express from 'express';
import { auth } from '../middlewares/auth.js';
import { pool } from '../config/db.js';

const router = express.Router();

// ✅ Route : Profil du client
router.get('/profile', auth, async (req, res) => {
  if (req.user.role !== 'client') {
    return res.status(403).json({ error: 'Accès interdit' });
  }

  const clientId = req.user.id;

  try {
    // 🔍 Infos du client
    const clientQuery = 'SELECT nom, email, tel FROM clients WHERE id = $1';
    const clientResult = await pool.query(clientQuery, [clientId]);

    if (clientResult.rows.length === 0) {
      return res.status(404).json({ error: 'Client non trouvé' });
    }

    const client = clientResult.rows[0];

    // 📅 RDVs du client (par nom)
    const rdvsQuery = 'SELECT * FROM rdvs WHERE nom = $1';
    const rdvsResult = await pool.query(rdvsQuery, [client.nom]);

    // 🛒 Commandes du client (par id)
    const commandesQuery = 'SELECT * FROM commandes WHERE client_id = $1 ORDER BY created_at DESC';
    const commandesResult = await pool.query(commandesQuery, [clientId]);

    res.status(200).json({
      client,
      rdvs: rdvsResult.rows,
      commandes: commandesResult.rows,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération du profil client:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;