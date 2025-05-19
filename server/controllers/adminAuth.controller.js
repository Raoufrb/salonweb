import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findAdminByUsername, createAdmin } from '../models/adminUser.model.js';

const SECRET_KEY = '123456';

// ✅ Register a new admin
export async function registerAdmin(req, res) {
  const { username, password } = req.body;

  try {
    // Check if the admin already exists
    const userExists = await findAdminByUsername(username);
    if (userExists) {
      return res.status(400).json({ error: 'Utilisateur existe déjà' });
    }

    // Hash the password and create the admin
    const hashedPassword = await bcrypt.hash(password, 10);
    await createAdmin(username, hashedPassword);

    res.status(201).json({ message: 'Admin créé' });
  } catch (err) {
    console.error('❌ Erreur PostgreSQL détaillée :', err);
    res.status(500).json({ error: 'Erreur serveur ❌' });
  }
}

// ✅ Login an admin
export async function loginAdmin(req, res) {
  const { username, password } = req.body;

  try {
    // Find the admin by username
    const user = await findAdminByUsername(username);
    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.json({ token });
  } catch (err) {
    console.error('❌ Erreur PostgreSQL détaillée :', err);
    res.status(500).json({ error: 'Erreur serveur ❌' });
  }
}