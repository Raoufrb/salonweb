import express from 'express';
import methodOverride from 'method-override';
import path from 'path';
import { fileURLToPath } from 'url';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';
import clientRoutes from './routes/client.js';
import employeRoutes from './routes/employe.js';
import authRoutes from './routes/auth.js';
import { getAllProducts } from './models/product.model.js';
import { getCommandesFiltréesAvecNoms } from './models/commande.model.js';
import { pool } from './config/db.js';
import { updateCommandeStatus } from './models/commande.model.js';
import adminServicesRouter from './routes/admin.js';
import nodemailer from 'nodemailer';




// Support for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// 🔧 Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));



// 📁 View Engine Configuration
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 🛍️ Admin View: Produits
app.get('/admin/produits', async (req, res) => {
  try {
    const produits = await getAllProducts();
    res.render('admin/produits', { produits });
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// 🛍️ Admin View: Commandes
app.get('/admin/commandes', async (req, res) => {
  try {
    const commandes = await getCommandesFiltréesAvecNoms({ status: 'toutes', client: '', date: '' });
    res.render('admin/commandes', { commandes });
  } catch (err) {
    console.error('Erreur lors de la récupération des commandes:', err.message);
    res.status(500).send('Erreur serveur');
  }
});


// ✅ Fonction pour valider une commande
app.post('/admin/commandes/:id/valider', async (req, res) => {
  try {
    const id = req.params.id;

    // 1. Mettre à jour la commande comme "acceptée"
    await updateCommandeStatus(id, 'acceptée');

    // 2. Récupérer l'email du client
    const commandeRes = await pool.query(`
      SELECT c.email, c.nom, c.tel, cmd.total
      FROM commandes cmd
      JOIN clients c ON cmd.client_id = c.id
      WHERE cmd.id = $1
    `, [id]);

    if (commandeRes.rows.length > 0) {
      const { email, nom, total } = commandeRes.rows[0];

      // 3. Configurer le transporteur
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'fyoorr@gmail.com',
          pass: 'brtx urty tzbs abpx' // mot de passe d’application
        }
      });

      // 4. Contenu de l'e-mail
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

      // 5. Envoi de l'e-mail
      await transporter.sendMail(mailOptions);
    }

    res.redirect('/admin/commandes');
  } catch (err) {
    console.error('Erreur lors de la validation de la commande:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// 🛍️ Refuser une commande
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
      revenusRDVRes
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM commandes'),
      pool.query('SELECT COUNT(*) FROM commandes WHERE status = $1', ['en attente']),
      pool.query('SELECT COUNT(*) FROM commandes WHERE status = $1', ['acceptée']),
      pool.query('SELECT COUNT(*) FROM rdvs WHERE statut = $1', ['en attente']),
      pool.query('SELECT SUM(total) FROM commandes WHERE status = $1', ['acceptée']),
      pool.query('SELECT SUM(prix) FROM rdvs WHERE statut = $1', ['validé'])
    ]);

    const totalCommandes = totalCommandesRes.rows[0].count;
    const commandesEnAttente = commandesEnAttenteRes.rows[0].count;
    const commandesAcceptees = commandesAccepteesRes.rows[0].count;
    const rdvsEnAttente = rdvsEnAttenteRes.rows[0].count;
    const revenusCommandes = parseFloat(revenusCommandesRes.rows[0].sum || 0);
    const revenusRDV = parseFloat(revenusRDVRes.rows[0].sum || 0);
    const totalRevenus = revenusCommandes + revenusRDV;

    res.render('admin/dashboard', {
      totalCommandes,
      commandesEnAttente,
      commandesAcceptees,
      rdvsEnAttente,
      revenusCommandes,
      revenusRDV,
      totalRevenus
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des données du tableau de bord:', err.message);
    res.status(500).send('Erreur serveur');
  }
})

// 📦 API Routes
app.use('/admin', adminRoutes);// Pour les vues admin EJS
app.use('/api/admin', adminRoutes);// Pour l'API (si tu veux des endpoints JSON
app.use('/api/client', clientRoutes);
app.use('/api/employe', employeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes); // General/public routes

// 🧪 Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API en ligne ✅' });
});

// 🌐 Static Files
app.use(express.static(path.join(__dirname, '../client')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



import serviceRoutes from './routes/api.js';
app.use(serviceRoutes);


app.use('/admin/services', adminServicesRouter);




// Use the API routes
app.use('/api', apiRoutes);

app.use('/api/employe', employeRoutes);

// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});



