import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Add correlation ID to requests for tracing
 */
export function correlationId(req: Request, res: Response, next: NextFunction) {
  const correlationId = req.headers['x-correlation-id'] as string || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('X-Correlation-ID', correlationId);
  next();
}

/**
 * Request logger
 */
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const correlationId = req.headers['x-correlation-id'];
    
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      correlationId,
      timestamp: new Date().toISOString(),
    });
  });
  
  next();
}

/**
 * Error handler
 */
export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', {
    error: err.message,
    stack: err.stack,
    correlationId: req.headers['x-correlation-id'],
  });
  
  const status = err.status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({
    error: message,
    correlationId: req.headers['x-correlation-id'],
  });
}
