import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

interface AppError extends Error {
  statusCode?: number;
  errors?: any[];
}

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler: ErrorRequestHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  // If status code is 200 but there's an error, set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  // Handle rate limit errors (usually 429 Too Many Requests)
  if (err.message.includes('Too many requests') || statusCode === 429) {
    res.status(429).json({
      message: err.message || 'Too many requests, please try again later',
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    return;
  }
  
  // Handle validation errors
  if (err.errors) {
    res.status(400).json({
      message: 'Validation Error',
      errors: err.errors,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
    return;
  }
  
  // Set status code
  res.status(statusCode);
  
  // Send error response
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};
