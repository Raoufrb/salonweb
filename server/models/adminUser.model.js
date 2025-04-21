import { pool } from '../config/db.js';

export async function findAdminByUsername(username) {
  const result = await pool.query(
    'SELECT * FROM admin_users WHERE username = $1',
    [username]
  );
  return result.rows[0];
}

export async function createAdmin(username, hashedPassword) {
  await pool.query(
    'INSERT INTO admin_users (username, password) VALUES ($1, $2)',
    [username, hashedPassword]
  );
}
