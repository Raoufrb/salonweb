import { pool } from '../config/db.js';
import path from 'path';
import fs from 'fs';

// ✅ List all services
export async function listServices() {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id DESC');
    return result.rows; // Return the list of services
  } catch (err) {
    console.error('❌ Error fetching services:', err.message);
    throw err;
  }
}

// ✅ Add a new service
export async function addService(req, res) {
  try {
    const { name, description, price, category, gender } = req.body;
    const image = req.file ? req.file.filename : null;

    await pool.query(
      `INSERT INTO services(name, description, price, category, gender, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, description, price, category, gender, image]
    );

    res.redirect('/admin/services');
  } catch (err) {
    console.error('❌ Erreur addService:', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Update an existing service
export async function updateService(req, res) {
  try {
    const id = req.params.id;
    const { name, description, price, category, gender } = req.body;

    await pool.query(
      `UPDATE services
       SET name = $1, description = $2, price = $3, category = $4, gender = $5
       WHERE id = $6`,
      [name, description, price, category, gender, id]
    );

    res.redirect('/admin/services');
  } catch (err) {
    console.error('❌ Erreur updateService:', err.message);
    res.status(500).send('Erreur serveur');
  }
}

// ✅ Delete a service
export async function deleteService(req, res) {
  try {
    const id = req.params.id;

    // Delete image if it exists
    const result = await pool.query('SELECT image_url FROM services WHERE id = $1', [id]);
    const image = result.rows[0]?.image_url;

    if (image) {
      const imagePath = path.join(process.cwd(), 'uploads/services', image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await pool.query('DELETE FROM services WHERE id = $1', [id]);

    res.redirect('/admin/services');
  } catch (err) {
    console.error('❌ Erreur deleteService:', err.message);
    res.status(500).send('Erreur serveur');
  }
}