import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

const JWT_SECRET = 'mySuperSecretKey123!@#'; // Store this in .env for security

// ✅ Login a user (client or employee)
export async function loginUser(req, res) {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Check if the user is a client
    const clientResult = await pool.query('SELECT * FROM clients WHERE email = $1', [email]);

    if (clientResult.rows.length > 0) {
      const client = clientResult.rows[0];
      const isMatch = await bcrypt.compare(mot_de_passe, client.mot_de_passe);

      if (!isMatch) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({ id: client.id, role: 'client' }, JWT_SECRET, { expiresIn: '1d' });

      return res.status(200).json({
        message: 'Connexion client réussie',
        token,
        role: 'client',
        client: {
          nom: client.nom,
          tel: client.tel,
          email: client.email
        }
      });
    }

    // Check if the user is an employee
    const employeResult = await pool.query('SELECT * FROM employes WHERE email = $1', [email]);

    if (employeResult.rows.length > 0) {
      const employe = employeResult.rows[0];
      const isMatch = await bcrypt.compare(mot_de_passe, employe.mot_de_passe);

      if (!isMatch) {
        return res.status(401).json({ error: 'Mot de passe incorrect' });
      }

      const token = jwt.sign({ id: employe.id, role: 'employe' }, JWT_SECRET, { expiresIn: '1d' });

      return res.status(200).json({
        message: 'Connexion employé réussie',
        token,
        role: 'employe',
        employe: {
          nom: employe.nom,
          email: employe.email
        }
      });
    }

    // If no user is found
    return res.status(404).json({ error: 'Utilisateur non trouvé' });
  } catch (err) {
    console.error('❌ Erreur login:', err.message);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}