import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middleware/auth.middleware';
import { getProfile } from '../services/auth.service';
import { getTodayFeed, getTomorrowFeed, getPeriodFeed } from '../services/feed.service';
import { z } from 'zod';
import { log } from 'console';

const router = Router();

/**
 * GET /feed/today
 */
router.get('/today', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'vi';

    const profile = await getProfile(req.userId!);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const userContext = {
      name: profile.fullName.split(' ')[0],
      jobField: profile.jobField,
      jobRole: profile.jobRole,
    };

    const feed = await getTodayFeed(req.userId!, profile.dob, profile.tz, lang, userContext);

    res.json(feed);
  } catch (error) {
    console.error('Get today feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /feed/next (tomorrow)
 */
router.get('/next', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const lang = (req.query.lang as string) || 'vi';

    const profile = await getProfile(req.userId!);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const userContext = {
      name: profile.fullName.split(' ')[0],
      jobField: profile.jobField,
      jobRole: profile.jobRole,
    };

    const feed = await getTomorrowFeed(req.userId!, profile.dob, profile.tz, lang, userContext);

    res.json(feed);
  } catch (error) {
    console.error('Get tomorrow feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /feed/period
 */
router.get('/period', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const scope = (req.query.scope as 'week' | 'month' | 'year') || 'week';
    const lang = (req.query.lang as string) || 'vi';

    if (!['week', 'month', 'year'].includes(scope)) {
      return res.status(400).json({ error: 'Invalid scope. Must be week, month, or year' });
    }

    const profile = await getProfile(req.userId!);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    const userContext = {
      name: profile.fullName.split('')[0],
      jobField: profile.jobField,
      jobRole: profile.jobRole,
    };

    const feed = await getPeriodFeed(req.userId!, profile.dob, scope, profile.tz, lang, userContext);

    console.log({ feed })

    res.json(feed);
  } catch (error) {
    console.error('Get period feed error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
