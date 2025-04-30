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



// 🚀 Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
