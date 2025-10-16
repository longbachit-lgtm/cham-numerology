import { Pool } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection pool
export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'cham_db',
  user: process.env.DB_USER || 'cham_user',
  password: process.env.DB_PASSWORD || 'cham_pass',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Redis client
export const redis = createClient({
  url: process.env.REDIS_URL,
});

redis.on('error', (err) => console.error('Redis Client Error', err));

export async function connectRedis() {
  if (!redis.isOpen) {
    await redis.connect();
  }
}

export async function disconnectRedis() {
  if (redis.isOpen) {
    await redis.disconnect();
  }
}

// Test database connection
export async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('âœ… Database connected:', result.rows[0].now);
    client.release();
    return true;
  } catch (err) {
    console.error('âŒ Database connection error:', err);
    return false;
  }
}

// Query helper with error handling
export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error', { text, error });
    throw error;
  }
}

export default pool;
