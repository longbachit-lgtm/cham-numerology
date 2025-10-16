import { Router, Request, Response } from 'express';
import { signup, login } from '../services/auth.service';
import { z } from 'zod';

const router = Router();

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

/**
 * POST /auth/signup
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = signupSchema.parse(req.body);
    
    const result = await signup(email, password);
    
    res.status(200).json({
      user: {
        id: result.user.id,
        email: result.user.email,
      },
      token: result.token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: error.message });
    }
    
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /auth/login
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    const result = await login(email, password);
    
    res.status(200).json({
      user: {
        id: result.user.id,
        email: result.user.email,
      },
      token: result.token,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: error.message });
    }
    
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
