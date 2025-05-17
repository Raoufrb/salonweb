import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';

// 📋 Liste des employés
export async function listEmployes(req, res) {
  try {
    const result = await pool.query('SELECT id, nom, email FROM employes ORDER BY id DESC');
    res.render('admin/employe', { employes: result.rows });
  } catch (err) {
    console.error('❌ Erreur chargement employés:', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ➕ Ajouter un employé
export async function createEmploye(req, res) {
  const { nom, email, mot_de_passe } = req.body;

  if (!nom || !email || !mot_de_passe) {
    return res.status(400).send("❌ Tous les champs sont requis.");
  }

  try {
    // Vérifie si l'email existe déjà
    const existing = await pool.query('SELECT * FROM employes WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).send("❌ Cet email est déjà utilisé.");
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    await pool.query(
      'INSERT INTO employes (nom, email, mot_de_passe) VALUES ($1, $2, $3)',
      [nom, email, hashedPassword]
    );

    res.redirect('/admin/employes');
  } catch (err) {
    console.error('❌ Erreur ajout employé:', err.message);
    res.status(500).send("Erreur lors de l'ajout de l'employé.");
  }
}

// ❌ Supprimer un employé
export async function deleteEmploye(req, res) {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM employes WHERE id = $1', [id]);
    res.redirect('/admin/employes');
  } catch (err) {
    console.error('❌ Erreur suppression employé:', err.message);
    res.status(500).send("Erreur lors de la suppression.");
  }
}