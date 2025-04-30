import express from 'express';
import multer from 'multer';
import path from 'path';
import methodOverride from 'method-override';

import { 
  registerAdmin, 
  loginAdmin 
} from '../controllers/adminAuth.controller.js';

import { 
  showCommandes, 
  validerCommande, 
  refuserCommande, 
  passerCommande 
} from '../controllers/commande.controller.js';

import { 
  approveApplication 
} from '../controllers/admin.Controller.js';

import { 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../models/product.model.js';

import { authAdmin } from '../middlewares/authAdmin.js';

const router = express.Router();
router.use(methodOverride('_method'));

// ----------------- AUTHENTIFICATION ADMIN -----------------

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.get('/dashboard', authAdmin, (req, res) => {
  res.json({ message: 'Bienvenue Admin' });
});

router.get('/protected', authAdmin, (req, res) => {
  res.status(200).json({
    message: 'Bienvenue dans la zone protégée 🔒',
    admin: req.user,
  });
});

// ----------------- MULTER CONFIGURATION -----------------

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/products'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const uploadProduct = multer({ storage: productStorage });

// ----------------- ADMIN PRODUIT CRUD -----------------

router.post('/products', uploadProduct.single('image'), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price || !image) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }

    await addProduct({ name, price, description, image });
    res.redirect('/admin/produits');
  } catch (err) {
    console.error('Erreur lors de l\'ajout du produit:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

router.put('/products/:id', uploadProduct.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;
    const image = req.file ? req.file.filename : null;

    await updateProduct(id, { name, price, description, image });
    res.redirect('/admin/produits');
  } catch (err) {
    console.error('Erreur lors de la mise à jour du produit:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteProduct(id);
    res.redirect('/admin/produits');
  } catch (err) {
    console.error('Erreur lors de la suppression du produit:', err.message);
    res.status(500).send('Erreur serveur');
  }
});

// ----------------- GESTION COMMANDES -----------------

router.get('/commandes', authAdmin, showCommandes);
router.post('/commandes/:id/valider', authAdmin, validerCommande);
router.post('/commandes/:id/refuser', authAdmin, refuserCommande);

// ✅ Commande client directe
router.post('/commandes', passerCommande);

// ----------------- APPROBATION CANDIDATURE -----------------

router.post('/approve-application', approveApplication);

export default router;
