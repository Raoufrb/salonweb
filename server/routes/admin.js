import express from 'express';
import { registerAdmin , loginAdmin } from '../controllers/adminAuth.controller.js';
import { listProducts, getOneProduct, createProduct, editProduct, removeProduct} from '../controllers/product.controller.js';
import { authAdmin } from '../middlewares/authAdmin.js';
import { getAllProductsPage } from '../controllers/product.controller.js';
import multer from 'multer';
import path from 'path';
import { getEditProductPage } from '../controllers/product.controller.js';
import {showCommandes,validerCommande,refuserCommande} from '../controllers/commande.controller.js';

const router = express.Router();
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);


// Authentification admin

router.get('/dashboard', authAdmin, (req, res) => {
  res.json({ message: ' Bienvenue Admin ' });
});
 
// Authentification admin

router.get('/protected', authAdmin, (req, res) => {
    res.status(200).json({
      message: ' Bienvenue dans la zone protégée 🔒 ',
      admin: req.user,
    });
  });

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './server/public/uploads');
    },
    filename: function (req, file, cb) {
      const unique = Date.now() + path.extname(file.originalname);
      cb(null, unique);
    }
  });
  const upload = multer({ storage });

// Routes produits

router.get('/products', listProducts);             // ✅ Tous les produits
router.get('/products/:id', getOneProduct);        // 🔍 Détail d’un produit
router.post('/admin/products', createProduct);     // ➕ Ajouter produit (admin)
router.put('/admin/products/:id', editProduct);    // ✏️ Modifier produit (admin)
router.delete('/admin/products/:id', removeProduct); // 🗑️ Supprimer produit (admin) // ❌ Supprimer un produit
router.get('/products/edit/:id', getEditProductPage);   // ➕ Page édition produit
router.get('/commandes', authAdmin, showCommandes);            // Affichage & filtres
router.post('/commandes/:id/valider', authAdmin, validerCommande); 
router.post('/commandes/:id/refuser', authAdmin, refuserCommande);
router.get('/dashboard/products', authAdmin, getAllProductsPage);

 export default router;