import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

// ✅ Signup a new user
export async function signupUser(req, res) {
  try {
    const { fullname, email, phone, password } = req.body;

    // Validate required fields
    if (!fullname || !email || !password) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    // Check if the email is already registered
    const emailCheckQuery = 'SELECT * FROM clients WHERE email = $1';
    const emailCheckResult = await pool.query(emailCheckQuery, [email]);
    if (emailCheckResult.rows.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const insertUserQuery = `
      INSERT INTO clients (nom, email, mot_de_passe, tel)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nom, email
    `;
    const result = await pool.query(insertUserQuery, [fullname, email, hashedPassword, phone]);

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: result.rows[0] });
  } catch (err) {
    console.error('❌ Erreur lors de l\'inscription:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}