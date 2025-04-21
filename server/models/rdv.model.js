export async function addProduct(nom, prix, description, image) {
    try {
      const result = await db.query(
    'INSERT INTO product (nom, prix, description, image) VALUES ($1, $2, $3, $4)'
     [nom, prix, description, image]
      );
      return result;
    } catch (err) {
      console.error("❌ Erreur ajout produit :", err);
      throw err;
    }
  }
  