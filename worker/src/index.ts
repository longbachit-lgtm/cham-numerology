import { Worker, Queue } from 'bullmq';
import { createClient } from 'redis';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://cham_user:cham_pass@localhost:5432/cham_db';

// Redis connection
const connection = {
  host: new URL(REDIS_URL).hostname,
  port: parseInt(new URL(REDIS_URL).port) || 6379,
};

// PostgreSQL connection
const pool = new Pool({
  connectionString: DATABASE_URL,
});

// Queues
export const reminderQueue = new Queue('reminders', { connection });

// Reminder Worker
const reminderWorker = new Worker(
  'reminders',
  async (job) => {
    console.log(`Processing reminder job ${job.id}:`, job.data);
    
    const { reminderId, todoId, userId } = job.data;
    
    try {
      // Get reminder and todo details
      const reminderResult = await pool.query(
        `SELECT r.*, t.text as todo_text
         FROM reminders r
         JOIN todos t ON r.todo_id = t.id
         WHERE r.id = $1 AND r.status = 'scheduled'`,
        [reminderId]
      );
      
      if (reminderResult.rows.length === 0) {
        console.log('Reminder not found or already sent');
        return;
      }
      
      const reminder = reminderResult.rows[0];
      
      // Send notification (placeholder - implement actual push notification)
      console.log(`ðŸ“¬ Sending reminder to user ${userId}:`);
      console.log(`   Todo: ${reminder.todo_text}`);
      console.log(`   Channel: ${reminder.channel}`);
      
      // TODO: Implement actual push notification service
      // For now, just log it
      
      // Update reminder status
      await pool.query(
        `UPDATE reminders SET status = 'sent' WHERE id = $1`,
        [reminderId]
      );
      
      console.log(`âœ… Reminder ${reminderId} sent successfully`);
    } catch (error) {
      console.error(`âŒ Error processing reminder ${reminderId}:`, error);
      throw error;
    }
  },
  { connection }
);

// Feed precompute worker
const feedQueue = new Queue('feed-precompute', { connection });

const feedWorker = new Worker(
  'feed-precompute',
  async (job) => {
    console.log(`Processing feed precompute job ${job.id}:`, job.data);
    
    const { userId } = job.data;
    
    try {
      // Get user profile
      const profileResult = await pool.query(
        `SELECT full_name, dob, tz FROM profiles WHERE user_id = $1`,
        [userId]
      );
      
      if (profileResult.rows.length === 0) {
        console.log('Profile not found');
        return;
      }
      
      // TODO: Precompute feeds for next 2 days
      console.log(`âœ… Precomputed feeds for user ${userId}`);
    } catch (error) {
      console.error(`âŒ Error precomputing feeds for ${userId}:`, error);
      throw error;
    }
  },
  { connection }
);

// Worker event handlers
reminderWorker.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

reminderWorker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed:`, err);
});

feedWorker.on('completed', (job) => {
  console.log(`Feed job ${job.id} completed`);
});

feedWorker.on('failed', (job, err) => {
  console.error(`Feed job ${job?.id} failed:`, err);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, closing workers...');
  await reminderWorker.close();
  await feedWorker.close();
  await pool.end();
  process.exit(0);
});

console.log('ðŸš€ CHáº M Worker started');
console.log('ðŸ“¬ Reminder worker ready');
console.log('ðŸ“Š Feed precompute worker ready');
