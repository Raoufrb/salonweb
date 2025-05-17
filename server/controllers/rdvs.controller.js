import { pool } from '../config/db.js';
import { envoyerEmail } from '../utils/mailer.js';

export async function creerRdv(req, res) {
    try {
      const { nom, tel, service, date, heure, prix } = req.body;
  
      await pool.query(
        `INSERT INTO rdvs(nom, tel, service, date, heure, prix)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [nom, tel, service, date, heure, prix]
      );
  
      res.status(201).json({ message: 'RDV enregistré ✅' });
    } catch (err) {
      console.error('Erreur création RDV:', err.message);
      res.status(500).send('Erreur serveur');
    }
  }

// Liste tous les RDVs
export async function listRdvs(req, res) {
  try {
    const result = await pool.query('SELECT * FROM rdvs ORDER BY date, heure');
    res.render('admin/rdv', { rdvs: result.rows });
  } catch (err) {
    console.error('❌ Erreur récupération RDVs:', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Valider un RDV
export async function validerRdv(req, res) {
  try {
    const { id } = req.params;

    // 1. Récupérer les infos du RDV
    const rdvRes = await pool.query('SELECT * FROM rdvs WHERE id = $1', [id]);
    const rdv = rdvRes.rows[0];

    if (!rdv) return res.status(404).send('RDV introuvable');

    // 2. Récupérer email depuis clients via le nom
    const clientRes = await pool.query('SELECT email FROM clients WHERE nom = $1 LIMIT 1', [rdv.nom]);
    const email = clientRes.rows[0]?.email;

    // 3. Mettre à jour le statut
    await pool.query('UPDATE rdvs SET statut = $1 WHERE id = $2', ['validé', id]);

    // 4. Envoyer email (si email trouvé)
    if (email) {
      await envoyerEmail(email, '✅ Confirmation de RDV',
        `<p>Bonjour ${rdv.nom},</p><p>Votre rendez-vous pour <strong>${rdv.service}</strong> le <strong>${rdv.date}</strong> à <strong>${rdv.heure}</strong> a été <span style="color:green;"><strong>validé</strong></span>.</p>`);
    }

    res.redirect('/admin/rdvs');
  } catch (err) {
    console.error('❌ Erreur validation RDV:', err.message);
    res.status(500).send('Erreur serveur');
  }
}


// ❌ Refuser un RDV

export async function refuserRdv(req, res) {
  try {
    const { id } = req.params;

    const rdvRes = await pool.query('SELECT * FROM rdvs WHERE id = $1', [id]);
    const rdv = rdvRes.rows[0];
    if (!rdv) return res.status(404).send('RDV introuvable');

    const clientRes = await pool.query('SELECT email FROM clients WHERE nom = $1 LIMIT 1', [rdv.nom]);
    const email = clientRes.rows[0]?.email;

    await pool.query('UPDATE rdvs SET statut = $1 WHERE id = $2', ['refusé', id]);

    if (email) {
      await envoyerEmail(email, '❌ RDV Refusé',
        `<p>Bonjour ${rdv.nom},</p><p>Votre rendez-vous pour <strong>${rdv.service}</strong> le <strong>${rdv.date}</strong> à <strong>${rdv.heure}</strong> a été <span style="color:red;"><strong>refusé</strong></span>.</p>`);
    }

    res.redirect('/admin/rdvs');
  } catch (err) {
    console.error('❌ Erreur refus RDV:', err.message);
    res.status(500).send('Erreur serveur');
  }
}