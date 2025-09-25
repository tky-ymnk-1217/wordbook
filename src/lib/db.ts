// src/lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || 'db',
  user: process.env.DATABASE_USER || 'admin',
  password: process.env.DATABASE_PASSWORD || 'adminpassword',
  database: process.env.DATABASE_NAME || 'wordbook',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
