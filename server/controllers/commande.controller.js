import { pool } from '../config/db.js';
import {
  getCommandesFiltréesAvecNoms,
  updateCommandeStatus
} from '../models/commande.model.js';

// Place a new order
export async function passerCommande(req, res) {
  try {
    const { nom, tel, adresse, produits, total } = req.body;

    if (!nom || !tel || !adresse || !Array.isArray(produits) || produits.length === 0 || !total) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    const clientRes = await pool.query(
      'INSERT INTO clients(nom, tel, adresse) VALUES($1, $2, $3) RETURNING id',
      [nom, tel, adresse]
    );
    const clientId = clientRes.rows[0].id;

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

// Show all orders with filters
export async function showCommandes(req, res) {
  console.log('showCommandes called'); // Debugging log
  try {
    const commandes = await getCommandesFiltréesAvecNoms({ status: 'toutes', client: '', date: '' });
    console.log('Fetched commandes:', commandes); // Debugging log
    res.render('admin/commandes', { commandes });
  } catch (err) {
    console.error('❌ Erreur showCommandes :', err); // Log the error
    res.status(500).send('Erreur serveur');
  }
}
// Validate an order
export async function validerCommande(req, res) {
  try {
    const id = req.params.id;
    await updateCommandeStatus(id, 'acceptée');
    res.status(200).json({ message: 'Commande acceptée ✅' });
  } catch (err) {
    console.error('❌ Erreur validerCommande :', err);
    res.status(500).json({ error: 'Erreur validation' });
  }
}

// Refuse an order
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