// ✅ Connexion PostgreSQL
import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'beauty_salon_db',
  password: '123456',
  port: 5433
});
