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

// 🛍️ Valider une commande
app.post('/admin/commandes/:id/valider', async (req, res) => {
  try {
    const id = req.params.id;
    await updateCommandeStatus(id, 'acceptée'); // Update the status to 'acceptée'
    res.redirect('/admin/commandes'); // Redirect back to the commandes page
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

// 🛍️ Admin Dashboard
app.get('/admin/dashboard', async (req, res) => {
  try {
    const totalCommandes = await pool.query('SELECT COUNT(*) FROM commandes');
    const totalRevenus = await pool.query('SELECT SUM(total) FROM commandes WHERE status = $1', ['acceptée']);
    const commandesEnAttente = await pool.query('SELECT COUNT(*) FROM commandes WHERE status = $1', ['en attente']);
    const commandesAcceptees = await pool.query('SELECT COUNT(*) FROM commandes WHERE status = $1', ['acceptée']);

    res.render('admin/dashboard', {
      totalCommandes: totalCommandes.rows[0].count,
      totalRevenus: totalRevenus.rows[0].sum || 0,
      commandesEnAttente: commandesEnAttente.rows[0].count,
      commandesAcceptees: commandesAcceptees.rows[0].count,
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des données du tableau de bord:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// 📦 API Routes
app.use('/api/admin', adminRoutes);
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


// 🛠️ Gestion des RDVs
app.get('/admin/rdvs', async (req, res) => {
  try {
    const rdvs = await pool.query('SELECT * FROM rdvs ORDER BY date, heure');
    res.render('admin/rdv', { rdvs: rdvs.rows });
  } catch (err) {
    console.error('Erreur lors de la récupération des RDVs:', err.message);
    res.status(500).send('Erreur serveur');
  }
});
// ✅ Valider un RDV
app.post('/admin/rdvs/:id/valider', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('UPDATE rdvs SET statut = $1 WHERE id = $2', ['validé', id]);
    res.redirect('/admin/rdvs');
  } catch (err) {
    console.error('Erreur lors de la validation du RDV:', err.message);
    res.status(500).send('Erreur serveur');
  }
});
// ❌ Refuser un RDV
app.post('/admin/rdvs/:id/refuser', async (req, res) => {
  try {
    const id = req.params.id;
    await pool.query('UPDATE rdvs SET statut = $1 WHERE id = $2', ['refusé', id]);
    res.redirect('/admin/rdvs');
  } catch (err) {
    console.error('Erreur lors du refus du RDV:', err.message);
    res.status(500).send('Erreur serveur');
  }
});




// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});



