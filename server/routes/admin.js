import express from 'express';
import multer from 'multer';
import path from 'path';
import methodOverride from 'method-override';

import { authAdmin } from '../middlewares/authAdmin.js';

import { 
  registerAdmin, 
  loginAdmin 
} from '../controllers/adminAuth.controller.js';

import {
  showCommandes,
  passerCommande,
  validerCommande,
  refuserCommande
} from '../controllers/commande.controller.js';

import {
  approveApplication,
  listApplications,
  rejectApplication
} from '../controllers/admin.controller.js';

import {
  listServices,
  addService,
  updateService,
  deleteService
} from '../controllers/adminServices.controller.js';

import { 
  listRdvs, 
  validerRdv, 
  refuserRdv 
} from '../controllers/rdvs.controller.js';

import {
  listEmployes,
  createEmploye,
  deleteEmploye
} from '../controllers/employe.controller.js';

import {
  getAllContacts,
  sendReply
} from '../controllers/contact.controller.js';

import {
  addProduct,
  updateProduct,
  deleteProduct
} from '../models/product.model.js';

const router = express.Router();
router.use(methodOverride('_method'));

// ----------------- MULTER CONFIGURATION -----------------
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/products'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const uploadProduct = multer({ storage: productStorage });

const serviceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/services'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const uploadService = multer({ storage: serviceStorage });

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

// ----------------- PRODUIT CRUD -----------------
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
router.get('/commandes', showCommandes);
router.post('/commandes', passerCommande);
router.put('/commandes/:id/valider', validerCommande);
router.put('/commandes/:id/refuser', refuserCommande);

// ----------------- CONTACTS -----------------
router.get('/contacts', getAllContacts);
router.post('/contacts/reply', sendReply);

// ----------------- CANDIDATURES -----------------
router.get('/recruitment', listApplications);
router.post('/recruitment/:id/approve', approveApplication);
router.post('/recruitment/:id/reject', rejectApplication);

// ----------------- SERVICES -----------------
router.get('/services', async (req, res) => {
  try {
    const services = await listServices();
    res.render('admin/service', { services });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

router.post('/services', uploadService.single('image'), addService);
router.put('/services/:id', uploadService.single('image'), updateService);
router.delete('/services/:id', deleteService);

// ----------------- RDVS -----------------
router.get('/rdvs', listRdvs);
router.post('/rdvs/:id/valider', validerRdv);
router.post('/rdvs/:id/refuser', refuserRdv);

// ----------------- EMPLOYES -----------------
router.get('/employes', listEmployes);
router.post('/employes', createEmploye);
router.delete('/employes/:id', deleteEmploye);

export default router;