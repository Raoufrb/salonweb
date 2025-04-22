import express from 'express';
import methodOverride from 'method-override';
import adminRoutes from './routes/admin.js';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = 3000;

// 🔧 Middleware pour traiter les données des formulaires
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 🔁 Pour prendre en charge les requêtes DELETE/PUT depuis les formulaires HTML
app.use(methodOverride('_method'));

// 📁 Définition du moteur de vues EJS (pour l’admin dashboard)
app.set('views', './server/views'); // ✅ C'est ici qu'il va chercher les .ejs
app.set('view engine', 'ejs');      // ✅ Déclare EJS comme moteur de vues

// 📦 Routes API
app.use('/api/admin', adminRoutes);  // ✅ Routes Admin
app.use('/api', apiRoutes);          // ✅ Routes publiques (produits, commandes, etc.)

// ✅ Route de test simple (optionnel)
app.get('/api/test', (req, res) => {
  res.json({ message: 'API en ligne ✅' });
});



// 🚀 Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
