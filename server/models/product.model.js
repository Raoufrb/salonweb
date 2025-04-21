// product.model.js
import { pool } from '../config/db.js';

export async function getAllProducts() {
  const result = await pool.query('SELECT * FROM products ORDER BY id DESC');
  return result.rows;
}

export async function getProductById(id) {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
}

export async function addProduct({ name, price, description, image }) {
  await pool.query(
    'INSERT INTO products (name, price, description, image) VALUES ($1, $2, $3, $4)',
    [name, price, description, image]
  );
}

export async function deleteProduct(id) {
  await pool.query('DELETE FROM products WHERE id = $1', [id]);
}

export async function updateProduct(id, { name, price, description, image }) {
  await pool.query(
    'UPDATE products SET name = $1, price = $2, description = $3, image = $4 WHERE id = $5',
    [name, price, description, image, id]
  );
}

