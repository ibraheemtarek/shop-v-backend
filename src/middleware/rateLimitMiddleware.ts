import rateLimit from 'express-rate-limit';

// Basic rate limiter for general API routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  limit: 100, 
  standardHeaders: 'draft-7', 
  legacyHeaders: false, 
  message: { message: 'Too many requests, please try again later.' },
});

// More strict rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  limit: process.env.NODE_ENV === 'production' ? 10 : 100, // Higher limit for development
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
});

// Rate limiter for user registration
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  limit: 5, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many registration attempts, please try again later.' },
});

// Rate limiter for password reset requests
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, 
  limit: 3, 
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many password reset requests, please try again later.' },
});
