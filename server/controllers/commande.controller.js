import { pool } from '../config/db.js';
import {
  getCommandesFiltréesAvecNoms,
  updateCommandeStatus
} from '../models/commande.model.js';

export async function passerCommande(req, res) {
  try {
    console.log('Request body:', req.body); // Log the incoming request body

    const { nom, tel, adresse, produits, total } = req.body;

    // Vérification des champs requis
    if (!nom || !tel || !adresse || !Array.isArray(produits) || produits.length === 0 || !total) {
      console.log('Missing required fields');
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    console.log('Inserting client...');
    const insertClientQuery = `
    INSERT INTO clients(nom, tel, adresse)
    VALUES($1, $2, $3)
    RETURNING id
  `;
    const clientRes = await pool.query(insertClientQuery, [nom, tel, adresse]);
    console.log('Client inserted:', clientRes.rows[0]);

    const clientId = clientRes.rows[0].id;

    console.log('Inserting commande...');
    const insertCommandeQuery = `
      INSERT INTO commandes(client_id, produits, total, adresse)
      VALUES($1, $2, $3, $4)
    `;
    await pool.query(insertCommandeQuery, [clientId, produits, total, adresse]);
    console.log('Commande inserted successfully');

    res.status(201).json({ message: 'Commande reçue ✅' });
  } catch (err) {
    console.error('❌ Erreur passerCommande :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}


export async function showCommandes(req, res) {
  const { status = 'toutes', client = '', date = '' } = req.query;
  try {
    const commandes = await getCommandesFiltréesAvecNoms({ status, client, date });
    res.render('admin/commandes.ejs', {
      commandes,
      filters: { status, client, date }
    });
  } catch (err) {
    console.error('❌ Erreur showCommandes :', err);
    res.status(500).send('Erreur serveur');
  }
}

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

export async function refuserCommande(req, res) {
  try {
    await updateCommandeStatus(req.params.id, 'refusée');
    res.json({ message: 'Commande refusée ❌' });
  } catch (err) {
    console.error('❌ Erreur refuserCommande :', err);
    res.status(500).json({ error: 'Erreur refus commande' });
  }
}
