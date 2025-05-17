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
  passerCommande,
  validerCommande,
  refuserCommande
} from '../controllers/commande.controller.js';

import { 
  approveApplication,listApplications, rejectApplication  
} from '../controllers/admin.controller.js';

import { 
  addProduct, 
  updateProduct, 
  deleteProduct 
} from '../models/product.model.js';

import { authAdmin } from '../middlewares/authAdmin.js';


import {
  listServices,
  addService,
  updateService,
  deleteService
} from '../controllers/adminServices.controller.js';

import { listRdvs, validerRdv, refuserRdv } from '../controllers/rdvs.controller.js';

import {
  listEmployes,
  createEmploye,
  deleteEmploye
} from '../controllers/employe.controller.js';

import {
  getAllContacts,
  sendReply
} from '../controllers/contact.controller.js';

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


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/services'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });


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
// Routes for commandes
router.get('/commandes', showCommandes); // Show all commandes
router.post('/commandes', passerCommande); // Place a new commande
router.put('/commandes/:id/valider', validerCommande); // Validate a commande
router.put('/commandes/:id/refuser', refuserCommande); // Refuse a commande

// ✅ Commande client directe
router.post('/commandes', passerCommande);



// 📩 Contacts
router.get('/contacts', getAllContacts); // Show messages
router.post('/contacts/reply', sendReply); // Send reply & delete
// ----------------- APPROBATION CANDIDATURE -----------------

router.post('/approve-application', approveApplication);
router.get('/recruitment', listApplications);


router.post('/recruitment/:id/approve', approveApplication);
router.post('/recruitment/:id/reject', rejectApplication);

// Define the route handler for GET requests to '/'
//router.get('/', (req, res) => {
  //res.send('Admin Services Page');
//});



// ----------------- SERVICES ROUTES -----------------

// GET /admin/services
router.get('/', async (req, res) => {
  try {
    const services = await listServices();
    res.render('admin/service', { services });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erreur serveur');
  }
});

// POST /admin/services
router.post('/', upload.single('image'), addService);

// PUT /admin/services/:id
router.put('/:id', upload.single('image'), updateService);

// DELETE /admin/services/:id
router.delete('/:id', deleteService);



// ----------------- RDV ROUTES -----------------

// ----------------- RDV ADMIN ROUTES -----------------

// RDVs (Gestion Admin)
router.get('/rdvs', listRdvs);
router.post('/rdvs/:id/valider', validerRdv);
router.post('/rdvs/:id/refuser', refuserRdv);

router.get('/employes', listEmployes);
router.post('/employes', createEmploye);
router.delete('/employes/:id', deleteEmploye);

export default router;

