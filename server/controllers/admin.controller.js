import { pool } from '../config/db.js';

export async function approveApplication(req, res) {
    try {
        const { applicationId } = req.body;

        // Validate required fields
        if (!applicationId) {
            return res.status(400).json({ error: 'Application ID requis' });
        }

        // Get the application details
        const applicationQuery = `
            SELECT * FROM applications WHERE id = $1
        `;
        const applicationResult = await pool.query(applicationQuery, [applicationId]);

        if (applicationResult.rows.length === 0) {
            return res.status(404).json({ error: 'Candidature non trouvée' });
        }

        const application = applicationResult.rows[0];

        // Insert the applicant into the employes table
        const insertEmployeeQuery = `
            INSERT INTO employes (nom, email, mot_de_passe)
            VALUES ($1, $2, $3)
            RETURNING id
        `;
        const employeeResult = await pool.query(insertEmployeeQuery, [application.nom, application.email, 'default_password']);

        // Delete the application from the applications table
        const deleteApplicationQuery = `
            DELETE FROM applications WHERE id = $1
        `;
        await pool.query(deleteApplicationQuery, [applicationId]);

        res.status(200).json({ message: 'Candidature approuvée et ajoutée aux employés', employeeId: employeeResult.rows[0].id });
    } catch (err) {
        console.error('Erreur lors de l\'approbation:', err.message);
        res.status(500).json({ error: 'Erreur serveur' });
    }
}