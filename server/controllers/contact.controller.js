import { pool } from '../config/db.js';
import nodemailer from 'nodemailer';

// ✅ Send a message
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

// ✅ Get all contacts
export async function getAllContacts(req, res) {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.render('admin/contacts', { messages: result.rows });
  } catch (error) {
    console.error('❌ Erreur récupération messages :', error.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Send a reply to a contact
export async function sendReply(req, res) {
  const { email, subject, reply } = req.body;

  if (!email || !subject || !reply) {
    return res.status(400).json({ error: 'Champs requis manquants' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'fyoorr@gmail.com', // ✅ Your Gmail address
        pass: 'brtxurtytzbsabpx' // ✅ App password
      }
    });

    await transporter.sendMail({
      from: "L'Oasis Spa <fyoorr@gmail.com>",
      to: email,
      subject,
      html: `<p>${reply}</p>`
    });

    // Delete the contact after sending the reply
    await pool.query('DELETE FROM contacts WHERE email = $1', [email]);

    res.status(200).json({ message: '✅ Réponse envoyée avec succès' });
  } catch (err) {
    console.error('❌ Erreur envoi email :', err.message);
    res.status(500).json({ error: "Erreur serveur lors de l'envoi" });
  }
}