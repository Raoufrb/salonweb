import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findAdminByUsername, createAdmin } from '../models/adminUser.model.js';

const SECRET_KEY = 'secret123';

export async function registerAdmin(req, res) {
  const { username, password } = req.body;
  try {
    const userExists = await findAdminByUsername(username);
    if (userExists) return res.status(400).json({ error: 'Utilisateur existe déjà' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await createAdmin(username, hashedPassword);
    res.status(201).json({ message: 'Admin créé' });
  } catch (err) {
    console.error('❌ Erreur PostgreSQL détaillée :', err);
    res.status(500).json({ error: 'Erreur serveur ❌' });
  }
}

export async function loginAdmin(req, res) {
  const { username, password } = req.body;
  try {
    const user = await findAdminByUsername(username);
    if (!user) return res.status(401).json({ error: 'Identifiants invalides' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Mot de passe incorrect' });

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '2h'
    });

    res.json({ token });
  } catch (err) {
    console.error('❌ Erreur PostgreSQL détaillée :', err);
    res.status(500).json({ error: 'Erreur serveur ❌' });
  }
}
