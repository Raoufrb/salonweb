import {
  getAllProducts,
  getProductById,
  addProduct,
  deleteProduct,
  updateProduct,
} from '../models/product.model.js';

// ✅ List all products (JSON response)
export async function listProducts(req, res) {
  try {
    const produits = await getAllProducts();
    res.status(200).json(produits);
  } catch (error) {
    console.error('❌ Erreur listProducts :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ✅ Render all products (HTML page)
export const getAllProductsPage = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id DESC');
    const produits = result.rows;
    res.render('admin/produits.ejs', { produits });
  } catch (error) {
    console.error('Erreur affichage produits :', error);
    res.status(500).send('Erreur serveur');
  }
};

// ✅ Get one product (JSON response)
export async function getOneProduct(req, res) {
  try {
    const id = parseInt(req.params.id);
    const produit = await getProductById(id);
    if (!produit) {
      return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.status(200).json(produit);
  } catch (error) {
    console.error('❌ Erreur getOneProduct :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// ✅ Render edit product page (HTML page)
export async function getEditProductPage(req, res) {
  try {
    const id = parseInt(req.params.id);
    const produit = await getProductById(id);
    res.render('admin/edit.ejs', { produit });
  } catch (error) {
    console.error('Erreur getEditProductPage :', error);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Create a new product
export async function createProduct(req, res) {
  try {
    const { name, price, description, image } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Champs requis manquants' });
    }
    await addProduct({ name, price, description, image });
    res.status(201).json({ message: 'Produit ajouté' });
  } catch (error) {
    console.error('❌ Erreur createProduct :', error);
    res.status(500).json({ error: 'Erreur ajout produit' });
  }
}

// ✅ Update an existing product
export async function editProduct(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { name, price, description, image } = req.body;
    await updateProduct(id, { name, price, description, image });
    res.status(200).json({ message: 'Produit mis à jour' });
  } catch (error) {
    console.error('❌ Erreur updateProduct :', error);
    res.status(500).json({ error: 'Erreur mise à jour produit' });
  }
}

// ✅ Delete a product
export async function removeProduct(req, res) {
  try {
    const id = parseInt(req.params.id);
    await deleteProduct(id);
    res.status(200).json({ message: 'Produit supprimé' });
  } catch (error) {
    console.error('❌ Erreur deleteProduct :', error);
    res.status(500).json({ error: 'Erreur suppression produit' });
  }
}