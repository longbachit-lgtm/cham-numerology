import pool from '../db/connection';
import { calculateCurrentPeriod } from './numerology.service';
import { buildEnergyCard } from './content.service';
import { addDays, addWeeks, addMonths, addYears, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

/**
 * Get or create daily feed for a user
 */
export async function getDailyFeed(
  userId: string,
  date: Date,
  dob: Date,
  lang: string = 'vi',
  userContext: any = {}
): Promise<any> {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  // Check if feed is cached
  const cached = await pool.query(
    `SELECT personal_day, energy_card FROM daily_feed 
     WHERE user_id = $1 AND date = $2`,
    [userId, dateStr]
  );
  
  if (cached.rows.length > 0) {
    return {
      date: dateStr,
      personalDay: cached.rows[0].personal_day,
      energyCard: cached.rows[0].energy_card,
    };
  }
  
  // Calculate personal day
  const { personalDay } = calculateCurrentPeriod(dob, date);
  
  // Build energy card
  const energyCard = await buildEnergyCard(personalDay, 'day', lang, userContext);
  
  // Cache the feed
  await pool.query(
    `INSERT INTO daily_feed (user_id, date, personal_day, energy_card)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, date) 
     DO UPDATE SET energy_card = $4`,
    [userId, dateStr, personalDay, JSON.stringify(energyCard)]
  );
  
  return {
    date: dateStr,
    personalDay,
    energyCard,
  };
}

/**
 * Get today's feed
 */
export async function getTodayFeed(
  userId: string,
  dob: Date,
  timezone: string = 'Asia/Bangkok',
  lang: string = 'vi',
  userContext: any = {}
): Promise<any> {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  
  return getDailyFeed(userId, zonedDate, dob, lang, userContext);
}

/**
 * Get tomorrow's feed
 */
export async function getTomorrowFeed(
  userId: string,
  dob: Date,
  timezone: string = 'Asia/Bangkok',
  lang: string = 'vi',
  userContext: any = {}
): Promise<any> {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  const tomorrow = addDays(zonedDate, 1);
  
  return getDailyFeed(userId, tomorrow, dob, lang, userContext);
}

/**
 * Get period overview (week, month, year)
 */
export async function getPeriodFeed(
  userId: string,
  dob: Date,
  scope: 'week' | 'month' | 'year',
  timezone: string = 'Asia/Bangkok',
  lang: string = 'vi',
  userContext: any = {}
): Promise<any> {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  
  let targetDate: Date;
  let personalNumber: string;
  
  const currentYear = zonedDate.getFullYear();
  const currentMonth = zonedDate.getMonth() + 1;
  
  const { personalYear, personalMonth } = calculateCurrentPeriod(dob, zonedDate);
  
  switch (scope) {
    case 'week':
      // Use personal month for week overview
      targetDate = addWeeks(zonedDate, 1);
      personalNumber = personalMonth;
      break;
    case 'month':
      targetDate = addMonths(zonedDate, 1);
      personalNumber = personalMonth;
      break;
    case 'year':
      targetDate = addYears(zonedDate, 1);
      personalNumber = personalYear;
      break;
  }
  
  // Build energy card for the period
  const energyCard = await buildEnergyCard(personalNumber, scope, lang, userContext);
  
  return {
    scope,
    period: format(zonedDate, 'yyyy-MM-dd'),
    personalNumber,
    energyCard,
  };
}

/**
 * Precompute feeds for upcoming days
 */
export async function precomputeFeeds(
  userId: string,
  dob: Date,
  timezone: string = 'Asia/Bangkok',
  lang: string = 'vi',
  daysAhead: number = 2
): Promise<void> {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  
  for (let i = 0; i <= daysAhead; i++) {
    const targetDate = addDays(zonedDate, i);
    await getDailyFeed(userId, targetDate, dob, lang, {});
  }
}
