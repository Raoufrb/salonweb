import express from 'express';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';
import clientRoutes from './routes/client.js';
import employeRoutes from './routes/employe.js';
import authRoutes from './routes/auth.js';
import adminServicesRouter from './routes/admin.js';
import moment from 'moment';
import { pool } from './config/db.js';
import { getAllProducts } from './models/product.model.js';
import { getCommandesFiltréesAvecNoms, updateCommandeStatus } from './models/commande.model.js';


// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// ----------------- MIDDLEWARE -----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ----------------- VIEW ENGINE CONFIGURATION -----------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ----------------- STATIC FILES -----------------
app.use(express.static(path.join(__dirname, '../client')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ----------------- ADMIN VIEWS -----------------
app.get('/admin/produits', async (req, res) => {
  try {
    const produits = await getAllProducts();
    res.render('admin/produits', { produits });
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err.message);
    res.status(500).send('Erreur serveur');
  }
});



app.post('/admin/commandes/:id/valider', async (req, res) => {
  try {
    const id = req.params.id;

    // Update the order status to "acceptée"
    await updateCommandeStatus(id, 'acceptée');

    // Retrieve client email
    const commandeRes = await pool.query(`
      SELECT c.email, c.nom, c.tel, cmd.total
      FROM commandes cmd
      JOIN clients c ON cmd.client_id = c.id
      WHERE cmd.id = $1
    `, [id]);

    if (commandeRes.rows.length > 0) {
      const { email, nom, total } = commandeRes.rows[0];

      // Configure the email transporter
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fyoorr@gmail.com',
          pass: 'brtxurtytzbsabpx' // App password
        }
      });

      // Email content
      const mailOptions = {
        from: "L'Oasis Spa <fyoorr@gmail.com>",
        to: email,
        subject: 'Votre commande a été acceptée ! 🎉',
        html: `
          <h2>Bonjour ${nom},</h2>
          <p>Votre commande d’un montant de <strong>${total} DA</strong> a été <strong>acceptée</strong> avec succès.</p>
          <p>📦 Elle sera traitée dans les prochains jours. Nous vous remercions de votre confiance.</p>
          <br>
          <p>— L’équipe de L’Oasis Spa</p>
        `
      };

      // Send the email
      await transporter.sendMail(mailOptions);
    }

    res.redirect('/admin/commandes');
  } catch (err) {
    console.error('Erreur lors de la validation de la commande:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/admin/commandes/:id/refuser', async (req, res) => {
  try {
    const id = req.params.id;
    await updateCommandeStatus(id, 'refusée');
    res.redirect('/admin/commandes');
  } catch (err) {
    console.error('Erreur lors du refus de la commande:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

app.get('/admin/dashboard', async (req, res) => {
  try {
    const [
      totalCommandesRes,
      commandesEnAttenteRes,
      commandesAccepteesRes,
      rdvsEnAttenteRes,
      revenusCommandesRes,
      revenusRDVRes,
      produitTopRes,
      jourTopRes,
      heureTopRes,
      serviceTopRes
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM commandes'),
      pool.query('SELECT COUNT(*) FROM commandes WHERE status = $1', ['en attente']),
      pool.query('SELECT COUNT(*) FROM commandes WHERE status = $1', ['acceptée']),
      pool.query('SELECT COUNT(*) FROM rdvs WHERE statut = $1', ['en attente']),
      pool.query('SELECT SUM(total) FROM commandes WHERE status = $1', ['acceptée']),
      pool.query('SELECT SUM(prix) FROM rdvs WHERE statut = $1', ['validé']),

      // 📈 Produit le + vendu (from array of names)
      pool.query(`
        SELECT unnest(produits) AS produit, COUNT(*) AS count
        FROM commandes
        GROUP BY produit
        ORDER BY count DESC
        LIMIT 1
      `),

      // 📅 Jour le plus fréquenté
      pool.query(`
        SELECT jour, COUNT(*) as total FROM (
          SELECT TO_CHAR(created_at, 'Day') AS jour FROM commandes
          UNION ALL
          SELECT TO_CHAR(TO_DATE(date, 'YYYY-MM-DD'), 'Day') AS jour FROM rdvs
        ) as jours
        GROUP BY jour
        ORDER BY total DESC
        LIMIT 1
      `),

      // 🕒 Heure de pointe
      pool.query(`
        SELECT heure, COUNT(*) as total FROM (
          SELECT TO_CHAR(created_at, 'HH24') AS heure FROM commandes
          UNION ALL
          SELECT heure FROM rdvs
        ) as heures
        GROUP BY heure
        ORDER BY total DESC
        LIMIT 1
      `),

      // 🧴 Service le + demandé
      pool.query(`
        SELECT service, COUNT(*) as total
        FROM rdvs
        GROUP BY service
        ORDER BY total DESC
        LIMIT 1
      `)
    ]);

    const totalCommandes = totalCommandesRes.rows[0].count;
    const commandesEnAttente = commandesEnAttenteRes.rows[0].count;
    const commandesAcceptees = commandesAccepteesRes.rows[0].count;
    const rdvsEnAttente = rdvsEnAttenteRes.rows[0].count;
    const revenusCommandes = parseFloat(revenusCommandesRes.rows[0].sum || 0);
    const revenusRDV = parseFloat(revenusRDVRes.rows[0].sum || 0);
    const totalRevenus = revenusCommandes + revenusRDV;

    // New metrics
    const produitTop = produitTopRes.rows[0]?.produit || 'Aucun';
    const jourTop = jourTopRes.rows[0]?.jour?.trim() || 'Inconnu';
    const heureTop = heureTopRes.rows[0]?.heure || 'Inconnue';
    const serviceTop = serviceTopRes.rows[0]?.service || 'Aucun';

    res.render('admin/dashboard', {
      totalCommandes,
      commandesEnAttente,
      commandesAcceptees,
      rdvsEnAttente,
      revenusCommandes,
      revenusRDV,
      totalRevenus,

      produitTop,
      jourTop,
      heureTop,
      serviceTop
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des données du tableau de bord:', err.message);
    res.status(500).send('Erreur serveur');
  }
});




app.get('/admin/rdvs', async (req, res) => {
  const result = await pool.query('SELECT * FROM rdvs');
  const allRdvs = result.rows;

  const today = moment().format('YYYY-MM-DD');// Ensure this line exists
  const currentMonth = moment().format('YYYY-MM');

  const totalRdvs = allRdvs.length;
  const acceptedRdvs = allRdvs.filter(r => r.statut === 'validé').length;
  const todayRdvs = allRdvs.filter(r => r.date === today).length;
  const monthlyRevenue = allRdvs
    .filter(r => r.statut === 'validé' && r.date.startsWith(currentMonth))
    .reduce((sum, r) => sum + parseFloat(r.prix), 0);

    res.render('admin/rdv', {
      rdvs: allRdvs,
      totalRdvs,
      acceptedRdvs,
      todayRdvs,
      monthlyRevenue
    });
});


app.get('/admin/commandes', async (req, res) => {
  try {
    const commandes = await getCommandesFiltréesAvecNoms({ status: 'toutes', client: '', date: '' });

    const currentMonth = moment().format('YYYY-MM');
    const commandesAccepteesMois = commandes.filter(c =>
      c.status === 'acceptée' &&
      moment(c.date).format('YYYY-MM') === currentMonth
    ).length;

    const commandesEnAttente = commandes.filter(c => c.status === 'en attente').length;

    const revenusCommandesMois = commandes
      .filter(c =>
        c.status === 'acceptée' &&
        moment(c.date).format('YYYY-MM') === currentMonth
      )
      .reduce((sum, c) => sum + parseFloat(c.total), 0);

    res.render('admin/commandes', {
      commandes,
      totalCommandes: commandes.length,
      commandesEnAttente,
      commandesAccepteesMois,
      revenusCommandesMois
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des commandes:', err.message);
    res.status(500).send('Erreur serveur');
  }
});


// ----------------- ROUTES -----------------
app.use('/admin', adminRoutes); // Admin views
app.use('/api/admin', adminRoutes); // Admin API
app.use('/api/client', clientRoutes);
app.use('/api/employe', employeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes); // General/public routes

app.use('/admin/services', adminServicesRouter);

// ----------------- TEST ROUTE -----------------
app.get('/api/test', (req, res) => {
  res.json({ message: 'API en ligne ✅' });
});

// ----------------- START SERVER -----------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});