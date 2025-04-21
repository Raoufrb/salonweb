// Toutes les routes API REST (format JSON) :
// POST /api/rdv
// POST /api/recrutement
// POST /api/commande
// POST /api/login
// GET /api/produits
// GET /api/rdv/employe
import express from 'express';
const router = express.Router();
import {
    listProducts, getOneProduct,createProduct,editProduct,removeProduct } 
    from '../controllers/product.controller.js';

router.get('/products', listProducts);             // ✅ Tous les produits
router.get('/products/:id', getOneProduct);        // 🔍 Détail d’un produit
router.post('/admin/products', createProduct);     // ➕ Ajouter produit (admin)
router.put('/admin/products/:id', editProduct);    // ✏️ Modifier produit (admin)
router.delete('/admin/products/:id', removeProduct); // 🗑️ Supprimer produit (admin)


export default router;
  