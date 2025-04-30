import {pool} from '../config/db.js';

export async function envoyerMessage(req, res) {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Champs obligatoires manquants' });
  }

  try {
    await pool.query(
      'INSERT INTO contacts (name, email, phone, message) VALUES ($1, $2, $3, $4)',
      [name, email, phone, message]
    );
    res.status(201).json({ message: 'Message reçu avec succès ✅' });
  } catch (error) {
    console.error('❌ Erreur enregistrement message :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}
