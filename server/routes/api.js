import express from 'express';
const router = express.Router();

import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { auth } from '../middlewares/auth.js';

import { 
  listProducts, 
  getOneProduct,
  createProduct, 
  editProduct, 
  removeProduct 
} from '../controllers/product.controller.js';

import { envoyerMessage } from '../controllers/contact.controller.js';

import { signupUser } from '../controllers/signup.Controller.js';
import { loginUser } from '../controllers/login.Controller.js';
import { handleRecruitment, upload } from '../controllers/recruitment.Controller.js';
import { getAllProducts } from '../models/product.model.js';

import { listServices } from '../controllers/adminServices.controller.js';

import {
  passerCommande,
} from '../controllers/commande.controller.js';


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
router.post('/commandes', auth, passerCommande);              // 🛒 Passer commande

// ----------------- RECRUITMENT -----------------
router.post('/recruitment', upload.single('cv'), handleRecruitment); // 📄 Recrutement

// ----------------- API (JSON endpoints) -----------------
router.get('/api/products', async (req, res) => {
  try {
    const products = await pool.query('SELECT * FROM products');
    res.json(products.rows); // Ensure the response is an array of products
  } catch (err) {
    console.error('Erreur lors de la récupération des produits:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ✅ POST /api/rdvs - Créer un nouveau RDV
router.post('/rdvs', async (req, res) => {
  const { nom, tel, service, date, heure, statut = 'en attente', prix } = req.body;

  if (!nom || !tel || !service || !date || !heure || !prix) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  try {
    await pool.query(
      `INSERT INTO rdvs (nom, tel, service, date, heure, statut, prix)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [nom, tel, service, date, heure, statut, prix]
    );

    res.status(201).json({ message: 'Rendez-vous enregistré avec succès.' });
  } catch (err) {
    console.error('Erreur lors de l\'insertion du RDV :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});


router.get('/services', async (req, res) => {
  try {
    const services = await listServices();
    res.json(services);
  } catch (err) {
    console.error('Erreur API services:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});




router.put('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const { id, role } = req.user;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  try {
    const table = role === 'client' ? 'clients' : 'employes';
    const result = await pool.query(`SELECT mot_de_passe FROM ${table} WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable' });
    }

    const match = await bcrypt.compare(oldPassword, result.rows[0].mot_de_passe);
    if (!match) {
      return res.status(401).json({ error: 'Ancien mot de passe incorrect' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query(`UPDATE ${table} SET mot_de_passe = $1 WHERE id = $2`, [hashed, id]);

    res.status(200).json({ message: 'Mot de passe mis à jour avec succès' });
  } catch (err) {
    console.error('Erreur changement mot de passe:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour clients
router.put('/client/change-name', auth, async (req, res) => {
  const { nom } = req.body;
  const id = req.user.id;

  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  try {
    await pool.query('UPDATE clients SET nom = $1 WHERE id = $2', [nom, id]);
    res.status(200).json({ message: 'Nom mis à jour' });
  } catch (err) {
    console.error('Erreur mise à jour nom client:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Route pour employés
router.put('/employe/change-name', auth, async (req, res) => {
  const { nom } = req.body;
  const id = req.user.id;

  if (!nom) return res.status(400).json({ error: 'Nom requis' });

  try {
    await pool.query('UPDATE employes SET nom = $1 WHERE id = $2', [nom, id]);
    res.status(200).json({ message: 'Nom mis à jour' });
  } catch (err) {
    console.error('Erreur mise à jour nom employé:', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});



export default router;