import { pool } from '../config/db.js';

export async function getCommandesFiltréesAvecNoms({ status, client, date }) {
  let query = `
  SELECT c.id, cl.nom AS client_nom, c.produits, c.total, c.status, c.date
  FROM commandes c
  JOIN clients cl ON c.client_id = cl.id
  WHERE 1=1
`;
  const values = [];

  if (status !== 'toutes') {
    query += ' AND c.status = $1';
    values.push(status);
  }

  if (client) {
    query += ` AND cl.nom ILIKE $${values.length + 1}`;
    values.push(`%${client}%`);
  }

  if (date) {
    query += ` AND DATE(c.date) = $${values.length + 1}`;
    values.push(date);
  }

  query += ' ORDER BY c.date DESC';

  console.log('Executing query:', query, 'with values:', values); // Debugging log
  try {
    const result = await pool.query(query, values);
    return result.rows;
  } catch (err) {
    console.error('❌ Erreur SQL :', err); // Log SQL errors
    throw err;
  }
}

export async function updateCommandeStatus(id, status) {
  const query = 'UPDATE commandes SET status = $1 WHERE id = $2';
  try {
    await pool.query(query, [status, id]);
    console.log(`Commande ID ${id} updated to status: ${status}`); // Debugging log
  } catch (err) {
    console.error('Erreur SQL dans updateCommandeStatus:', err.message);
    throw err;
  }
}