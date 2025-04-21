// Toutes les routes API REST (format JSON) :
// POST /api/rdv
// POST /api/recrutement
// POST /api/commande
// POST /api/login
// GET /api/produits
// GET /api/rdv/employe
import express from 'express';
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'API en ligne ✅' });
});

export default router;
  