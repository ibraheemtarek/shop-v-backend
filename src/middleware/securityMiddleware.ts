import { Request, Response, NextFunction } from 'express';

/**
 * Security middleware to add important security headers
 * This helps protect against various web vulnerabilities
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict-Transport-Security
  // Force browsers to use HTTPS for a specified period
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Content-Security-Policy
  // Restrict which resources can be loaded
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self'; object-src 'none'; img-src 'self' data:; style-src 'self' 'unsafe-inline';"
  );
  
  // Remove the X-Powered-By header to avoid exposing technology information
  res.removeHeader('X-Powered-By');
  
  next();
};
