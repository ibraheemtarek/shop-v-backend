import { Request, Response, NextFunction } from 'express';

/**
 * Security middleware to add important security headers
 * This helps protect against various web vulnerabilities
 */
export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // Prevent browsers from incorrectly detecting non-scripts as scripts
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Allow framing only from same origin instead of denying completely
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  
  // Prevent XSS attacks
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Strict-Transport-Security
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Modified Content-Security-Policy to allow cross-origin requests
  const frontendUrl = process.env.FRONTEND_URL || 'https://shop-v-front-end.vercel.app';
  
  res.setHeader(
    'Content-Security-Policy',
    `default-src 'self' ${frontendUrl}; ` +
    `script-src 'self' ${frontendUrl}; ` +
    `connect-src 'self' ${frontendUrl}; ` +
    `img-src 'self' data: ${frontendUrl}; ` +
    `style-src 'self' 'unsafe-inline' ${frontendUrl}; ` +
    `frame-ancestors 'self' ${frontendUrl}; ` +
    `object-src 'none';`
  );
  
  // Remove the X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // For API routes, we can skip CSP completely as it's not needed for API endpoints
  if (req.path.startsWith('/api/')) {
    res.removeHeader('Content-Security-Policy');
  }
  
  next();
};
