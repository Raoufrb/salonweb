
import {pool} from '../config/db.js';

// 🔍 Liste filtrée des commandes avec nom du client

export async function getCommandesFiltréesAvecNoms({ status, client, date }) {
    let query = `
      SELECT c.id, c.produits, c.total, c.date, c.status,
             u.nom AS client_nom
      FROM commandes c
      JOIN clients u ON u.id = c.client_id
      WHERE 1=1
    `;
    const values = [];
  
    if (status && status !== 'toutes') {
      query += ` AND c.status = $${values.length + 1}`;
      values.push(status);
    }
  
    if (client) {
      query += ` AND LOWER(u.nom) LIKE LOWER($${values.length + 1})`;
      values.push(`%${client}%`);
    }
  
    if (date) {
      query += ` AND DATE(c.date) = $${values.length + 1}`;
      values.push(date);
    }
  
    query += ' ORDER BY c.date DESC';
  
    const result = await pool.query(query, values);
    return result.rows;
  }

// ✅ Mise à jour du statut

export async function updateCommandeStatus(id, newStatus) {
  await pool.query('UPDATE commandes SET status = $1 WHERE id = $2', [newStatus, id]);
}
