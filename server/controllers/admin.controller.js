import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { envoyerEmail } from '../utils/mailer.js';

// ✅ Approve an application and add an employee
export async function approveApplication(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send('ID de la candidature manquant');
    }

    const applicationResult = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);

    if (applicationResult.rows.length === 0) {
      return res.status(404).send('Candidature non trouvée');
    }

    const application = applicationResult.rows[0];

    // Check if the employee already exists
    const check = await pool.query('SELECT * FROM employes WHERE email = $1', [application.email]);
    if (check.rows.length > 0) {
      return res.status(409).send('Employé déjà enregistré');
    }

    // Add the employee
    const plainPassword = '123456';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    await pool.query(
      'INSERT INTO employes (nom, email, mot_de_passe) VALUES ($1, $2, $3)',
      [application.nom, application.email, hashedPassword]
    );

    // Update the application status
    await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2',
      ['approuvée', id]
    );

    // Send approval email
    const sujet = '🎉 Félicitations ! Vous êtes embauché(e)';
    const contenu = `
      <p>Bonjour <strong>${application.nom}</strong>,</p>
      <p>Nous avons le plaisir de vous informer que votre candidature a été <strong>approuvée</strong>.</p>
      <p>🎉 Bienvenue dans l'équipe de <strong>L'Oasis Spa</strong> !</p>
      <p>Voici votre mot de passe temporaire : <strong>${plainPassword}</strong></p>
      <p>Vous pouvez le modifier à tout moment depuis votre profil.</p>
      <br>
      <p>Bien cordialement,<br>L'équipe L'Oasis Spa</p>
    `;
    await envoyerEmail(application.email, sujet, contenu);

    res.redirect('/admin/recruitment');
  } catch (err) {
    console.error('❌ Erreur approval:', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Reject an application (delete it)
export async function rejectApplication(req, res) {
  const { id } = req.params;
  try {
    // Retrieve candidate info before deletion
    const result = await pool.query('SELECT * FROM applications WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Candidature introuvable');
    }

    const application = result.rows[0];

    // Delete the application
    await pool.query('DELETE FROM applications WHERE id = $1', [id]);

    // Send rejection email
    const sujet = '🤝 Merci pour votre candidature';
    const contenu = `
      <p>Bonjour <strong>${application.nom}</strong>,</p>
      <p>Nous avons examiné votre candidature avec attention.</p>
      <p>Malheureusement, nous ne pouvons pas donner une suite favorable à votre demande pour le moment.</p>
      <p>Nous vous remercions pour l’intérêt porté à L’Oasis Spa, et nous vous souhaitons bonne continuation dans vos recherches.</p>
      <br>
      <p>Bien cordialement,<br>L'équipe L'Oasis Spa</p>
    `;
    await envoyerEmail(application.email, sujet, contenu);

    res.redirect('/admin/recruitment');
  } catch (err) {
    console.error('Erreur suppression candidature:', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Dashboard statistics
export async function getDashboardStats(req, res) {
  try {
    const [
      totalCommandesRes,
      commandesEnAttenteRes,
      commandesAccepteesRes,
      rdvsEnAttenteRes,
      revenusRDVRes
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM commandes'),
      pool.query(`SELECT COUNT(*) FROM commandes WHERE status = 'en attente'`),
      pool.query(`SELECT COUNT(*) FROM commandes WHERE status = 'acceptée'`),
      pool.query(`SELECT COUNT(*) FROM rdvs WHERE statut = 'en attente'`),
      pool.query(`SELECT SUM(prix) FROM rdvs WHERE statut = 'validé'`)
    ]);

    const revenusCommandesRes = await pool.query(`SELECT SUM(total) FROM commandes`);
    const revenusCommandes = parseFloat(revenusCommandesRes.rows[0].sum || 0);
    const revenusRDV = parseFloat(revenusRDVRes.rows[0].sum || 0);
    const totalRevenus = revenusCommandes + revenusRDV;

    res.render('admin/dashboard', {
      totalCommandes: totalCommandesRes.rows[0].count,
      commandesEnAttente: commandesEnAttenteRes.rows[0].count,
      commandesAcceptees: commandesAccepteesRes.rows[0].count,
      rdvsEnAttente: rdvsEnAttenteRes.rows[0].count,
      revenusCommandes,
      revenusRDV,
      totalRevenus
    });
  } catch (err) {
    console.error('❌ Erreur getDashboardStats:', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ List all applications
export async function listApplications(req, res) {
  try {
    const result = await pool.query('SELECT * FROM applications ORDER BY id DESC');
    res.render('admin/recruitment', { applications: result.rows });
  } catch (err) {
    console.error('Erreur chargement candidatures:', err.message);
    res.status(500).send('Erreur serveur');
  }
}