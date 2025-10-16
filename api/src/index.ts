import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { testConnection, connectRedis } from './db/connection';
import { correlationId, requestLogger, errorHandler } from './middleware/logging.middleware';

// Routes
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import feedRoutes from './routes/feed.routes';
import todosRoutes from './routes/todos.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(correlationId);
app.use(requestLogger);

// Rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per window
  message: 'Too many requests from this IP, please try again later',
});

const feedLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: 'Too many requests, please slow down',
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/feed', feedLimiter, feedRoutes);
app.use('/api/todos', todosRoutes);

// Error handler
app.use(errorHandler);

// Start server
async function start() {
  try {
    console.log('ðŸš€ Starting CHáº M API Server...');
    
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('Database connection failed');
    }
    
    // Connect to Redis
    await connectRedis();
    console.log('âœ… Redis connected');
    
    app.listen(PORT, () => {
      console.log(`âœ… Server running on port ${PORT}`);
      console.log(`ðŸ“ Health check: http://localhost:${PORT}/health`);
      console.log(`ðŸ“ API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('âŒ Failed to start server:', error);
    process.exit(1);
  }
}

start();
