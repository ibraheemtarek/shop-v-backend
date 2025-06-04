import { Request, Response, NextFunction, RequestHandler } from 'express';
import csrf from 'csurf';

/**
 * CSRF protection middleware that combines token validation with error handling
 * This approach handles CSRF errors directly in the middleware chain
 */
export const csrfProtect: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  // Create CSRF middleware with secure cookie settings
  const csrfMiddleware = csrf({
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      httpOnly: true,                              // Prevent JavaScript access to the cookie
      sameSite: 'strict'                           // Prevent cross-site cookie sending
    }
  });
  
  // Apply the CSRF middleware and catch any errors
  csrfMiddleware(req, res, (err) => {
    if (err) {
      if (err.code === 'EBADCSRFTOKEN') {
        // Return 403 Forbidden if CSRF validation fails
        return res.status(403).json({
          message: 'Invalid or missing CSRF token',
          error: 'csrf_error'
        });
      }
      // For other errors, pass to next error handler
      return next(err);
    }
    next();
  });
};

/**
 * Endpoint to generate and return a new CSRF token
 * Frontend applications should call this endpoint before submitting forms
 */
export const generateCsrfToken: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  // Create CSRF middleware just for token generation
  const csrfMiddleware = csrf({
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    }
  });
  
  // Apply the middleware to get access to csrfToken() function
  csrfMiddleware(req, res, (err) => {
    if (err) return next(err);
    // Send the token to the client
    res.json({ csrfToken: req.csrfToken() });
  });
};


