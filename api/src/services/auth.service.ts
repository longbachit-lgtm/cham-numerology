import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/connection';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}

export interface Profile {
  userId: string;
  fullName: string;
  dob: Date;
  gender?: string;
  jobField?: string;
  jobRole?: string;
  tz: string;
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate JWT token
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET as string, { expiresIn: '7d' } as any);
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, JWT_SECRET as string) as { userId: string };
}

/**
 * Create new user
 */
export async function createUser(email: string, password?: string): Promise<User> {
  const id = uuidv4();
  const passwordHash = password ? await hashPassword(password) : null;
  
  const result = await pool.query(
    `INSERT INTO users (id, email, password_hash) 
     VALUES ($1, $2, $3) 
     RETURNING id, email, created_at`,
    [id, email, passwordHash]
  );
  
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    createdAt: result.rows[0].created_at,
  };
}

/**
 * Find user by email
 */
export async function findUserByEmail(email: string): Promise<(User & { passwordHash?: string }) | null> {
  const result = await pool.query(
    `SELECT id, email, password_hash, created_at FROM users WHERE email = $1`,
    [email]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    passwordHash: result.rows[0].password_hash,
    createdAt: result.rows[0].created_at,
  };
}

/**
 * Find user by ID
 */
export async function findUserById(id: string): Promise<User | null> {
  const result = await pool.query(
    `SELECT id, email, created_at FROM users WHERE id = $1`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return {
    id: result.rows[0].id,
    email: result.rows[0].email,
    createdAt: result.rows[0].created_at,
  };
}

/**
 * Create or update user profile
 */
export async function upsertProfile(profile: Profile): Promise<void> {
  await pool.query(
    `INSERT INTO profiles (user_id, full_name, dob, gender, job_field, job_role, tz)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id)
     DO UPDATE SET 
       full_name = $2,
       dob = $3,
       gender = $4,
       job_field = $5,
       job_role = $6,
       tz = $7,
       updated_at = now()`,
    [profile.userId, profile.fullName, profile.dob, profile.gender, profile.jobField, profile.jobRole, profile.tz]
  );
}

/**
 * Get user profile
 */
export async function getProfile(userId: string): Promise<Profile | null> {
  const result = await pool.query(
    `SELECT user_id, full_name, dob, gender, job_field, job_role, tz
     FROM profiles WHERE user_id = $1`,
    [userId]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    userId: row.user_id,
    fullName: row.full_name,
    dob: new Date(row.dob),
    gender: row.gender,
    jobField: row.job_field,
    jobRole: row.job_role,
    tz: row.tz,
  };
}

/**
 * Sign up new user
 */
export async function signup(email: string, password?: string): Promise<{ user: User; token: string }> {
  // Check if user already exists
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('User already exists');
  }
  
  const user = await createUser(email, password);
  const token = generateToken(user.id);
  
  return { user, token };
}

/**
 * Login user
 */
export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const user = await findUserByEmail(email);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  if (user.passwordHash) {
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      throw new Error('Invalid credentials');
    }
  }
  
  const token = generateToken(user.id);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
    },
    token,
  };
}
