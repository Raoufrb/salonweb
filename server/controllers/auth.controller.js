const JWT_SECRET = 'mySuperSecretKey123!@#'; // Replace with a strong secret key

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';

export async function login(req, res) {
    try {
        const { email, mot_de_passe } = req.body;

        // Validate input
        if (!email || !mot_de_passe) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }

        // Check if the user is a client
        const clientQuery = `SELECT * FROM clients WHERE email = $1`;
        const clientResult = await pool.query(clientQuery, [email]);

        if (clientResult.rows.length > 0) {
            const client = clientResult.rows[0];

            // Compare passwords
            const isMatch = await bcrypt.compare(mot_de_passe, client.mot_de_passe);
            if (!isMatch) {
                return res.status(401).json({ error: 'Mot de passe incorrect' });
            }

            // Generate JWT
            const token = jwt.sign({ id: client.id, role: 'client' }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Connexion réussie', token, role: 'client' });
        }

        // Check if the user is an employee
        const employeeQuery = `SELECT * FROM employes WHERE email = $1`;
        const employeeResult = await pool.query(employeeQuery, [email]);

        if (employeeResult.rows.length > 0) {
            const employe = employeeResult.rows[0];

            // Compare passwords
            const isMatch = await bcrypt.compare(mot_de_passe, employe.mot_de_passe);
            if (!isMatch) {
                return res.status(401).json({ error: 'Mot de passe incorrect' });
            }

            // Generate JWT
            const token = jwt.sign({ id: employe.id, role: 'employe' }, JWT_SECRET, { expiresIn: '1h' });

            return res.status(200).json({ message: 'Connexion réussie', token, role: 'employe' });
        }

        // If no user is found
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    } catch (err) {
        console.error('Erreur lors de la connexion:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}