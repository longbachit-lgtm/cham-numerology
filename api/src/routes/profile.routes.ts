import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.middleware';
import { getProfile, upsertProfile } from '../services/auth.service';
import { calculateCoreNumbers } from '../services/numerology.service';
import pool from '../db/connection';
import { z } from 'zod';

const router = Router();

const profileSchema = z.object({
  fullName: z.string().min(1),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.enum(['male', 'female', 'other']).optional(),
  jobField: z.string().optional(),
  jobRole: z.string().optional(),
  tz: z.string().default('Asia/Bangkok'),
});

/**
 * GET /profile
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getProfile(req.userId!);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.json({
      fullName: profile.fullName,
      dob: profile.dob,
      gender: profile.gender,
      jobField: profile.jobField,
      jobRole: profile.jobRole,
      tz: profile.tz,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /profile
 */
router.put('/', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const data = profileSchema.parse(req.body);
    
    await upsertProfile({
      userId: req.userId!,
      fullName: data.fullName,
      dob: new Date(data.dob),
      gender: data.gender,
      jobField: data.jobField,
      jobRole: data.jobRole,
      tz: data.tz,
    });
    
    res.json({ message: 'Profile updated successfully' });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid input', details: error.errors });
    }
    
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /profile/compute-numerology
 */
router.post('/compute-numerology', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const profile = await getProfile(req.userId!);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    const coreNumbers = calculateCoreNumbers(profile.fullName, profile.dob);
    
    // Save to database
    await pool.query(
      `INSERT INTO numerology_core 
       (user_id, life_path, destiny, soul, personality, birthday, maturity, attitude, chart_birth, chart_name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (user_id)
       DO UPDATE SET
         life_path = $2,
         destiny = $3,
         soul = $4,
         personality = $5,
         birthday = $6,
         maturity = $7,
         attitude = $8,
         chart_birth = $9,
         chart_name = $10,
         computed_at = now()`,
      [
        req.userId,
        coreNumbers.lifePath,
        coreNumbers.destiny,
        coreNumbers.soul,
        coreNumbers.personality,
        coreNumbers.birthday,
        coreNumbers.maturity,
        coreNumbers.attitude,
        JSON.stringify(coreNumbers.chartBirth),
        JSON.stringify(coreNumbers.chartName),
      ]
    );
    
    res.json(coreNumbers);
  } catch (error) {
    console.error('Compute numerology error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /profile/numerology
 */
router.get('/numerology', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const result = await pool.query(
      `SELECT life_path, destiny, soul, personality, birthday, maturity, attitude, 
              chart_birth, chart_name, computed_at
       FROM numerology_core
       WHERE user_id = $1`,
      [req.userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Numerology data not found' });
    }
    
    const row = result.rows[0];
    res.json({
      lifePath: row.life_path,
      destiny: row.destiny,
      soul: row.soul,
      personality: row.personality,
      birthday: row.birthday,
      maturity: row.maturity,
      attitude: row.attitude,
      chartBirth: row.chart_birth,
      chartName: row.chart_name,
      computedAt: row.computed_at,
    });
  } catch (error) {
    console.error('Get numerology error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
