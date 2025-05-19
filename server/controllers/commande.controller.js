import { pool } from '../config/db.js';
import {
  getCommandesFiltréesAvecNoms,
  updateCommandeStatus
} from '../models/commande.model.js';

// ✅ Place a new order
export async function passerCommande(req, res) {
  try {
    const { nom, tel, adresse, produits, total } = req.body;

    if (!nom || !tel || !adresse || !Array.isArray(produits) || produits.length === 0 || !total) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    let clientId = null;

    // If the user is logged in
    if (req.user && req.user.role === 'client') {
      clientId = req.user.id;
    } else {
      // Create a new guest client
      const clientRes = await pool.query(
        'INSERT INTO clients(nom, tel, adresse) VALUES($1, $2, $3) RETURNING id',
        [nom, tel, adresse]
      );
      clientId = clientRes.rows[0].id;
    }

    // Save the order
    await pool.query(
      'INSERT INTO commandes(client_id, produits, total, adresse) VALUES($1, $2, $3, $4)',
      [clientId, produits, total, adresse]
    );

    res.status(201).json({ message: 'Commande reçue ✅' });
  } catch (err) {
    console.error('❌ Erreur passerCommande :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ✅ Display orders with filters
export async function showCommandes(req, res) {
  try {
    const commandes = await getCommandesFiltréesAvecNoms({
      status: 'toutes',
      client: '',
      date: ''
    });
    res.render('admin/commandes', { commandes });
  } catch (err) {
    console.error('❌ Erreur showCommandes :', err);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Validate an order
export async function validerCommande(req, res) {
  try {
    const id = req.params.id;

    // Update the status
    await pool.query('UPDATE commandes SET status = $1 WHERE id = $2', ['acceptée', id]);

    // Redirect to the orders page
    res.redirect('/admin/commandes');
  } catch (err) {
    console.error('❌ Erreur validation commande :', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Reject an order
export async function refuserCommande(req, res) {
  try {
    const id = req.params.id;
    await updateCommandeStatus(id, 'refusée');
    res.json({ message: 'Commande refusée ❌' });
  } catch (err) {
    console.error('❌ Erreur refuserCommande :', err);
    res.status(500).json({ error: 'Erreur refus commande' });
  }
}