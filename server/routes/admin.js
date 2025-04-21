import express from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminAuth.controller.js';
import { listProducts, getOneProduct, createProduct, editProduct, removeProduct} from '../controllers/product.controller.js';
import { authAdmin } from '../middlewares/authAdmin.js';

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

// Routes produits

router.get('/products', listProducts);             // ✅ Tous les produits
router.get('/products/:id', getOneProduct);        // 🔍 Détail d’un produit
router.post('/admin/products', createProduct);     // ➕ Ajouter produit (admin)
router.put('/admin/products/:id', editProduct);    // ✏️ Modifier produit (admin)
router.delete('/admin/products/:id', removeProduct); // 🗑️ Supprimer produit (admin) // ❌ Supprimer un produit

 export default router;