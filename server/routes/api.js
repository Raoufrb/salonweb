import express from 'express';
const router = express.Router();

import { 
  listProducts, 
  getOneProduct,
  createProduct, 
  editProduct, 
  removeProduct 
} from '../controllers/product.controller.js';

import { envoyerMessage } from '../controllers/contact.controller.js';
import { passerCommande } from '../controllers/commande.controller.js';
import { signupUser } from '../controllers/signup.Controller.js';
import { loginUser } from '../controllers/login.Controller.js';
import { handleRecruitment, upload } from '../controllers/recruitment.Controller.js';
import { getAllProducts } from '../models/product.model.js';

// ----------------- PRODUCTS -----------------
router.get('/products', listProducts);                   // ✅ Tous les produits
router.get('/products/:id', getOneProduct);              // 🔍 Détail d’un produit

// ----------------- ADMIN PRODUCTS -----------------
router.post('/admin/products', createProduct);           // ➕ Ajouter produit (admin)
router.put('/admin/products/:id', editProduct);          // ✏️ Modifier produit (admin)
router.delete('/admin/products/:id', removeProduct);     // 🗑️ Supprimer produit (admin)

// ----------------- AUTH -----------------
router.post('/signup', signupUser);                      // 📝 Inscription
router.post('/login', loginUser);                        // 🔐 Connexion

// ----------------- CONTACT -----------------
router.post('/contact', envoyerMessage);                 // ✉️ Envoyer message

// ----------------- COMMANDES -----------------
router.post('/commandes', passerCommande);               // 🛒 Passer commande

// ----------------- RECRUITMENT -----------------
router.post('/recruitment', upload.single('cv'), handleRecruitment); // 📄 Recrutement

// ----------------- API (JSON endpoints) -----------------
router.get('/api/products', async (req, res) => {
  try {
    const products = await getAllProducts();             // 🔄 Fetch all products
    res.json(products);
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


  

export default router;
