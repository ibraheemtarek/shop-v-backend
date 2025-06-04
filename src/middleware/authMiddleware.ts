import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import TokenBlacklist from '../models/TokenBlacklist';
import { verifyAccessToken } from '../utils/tokenUtils';

// Interface for requests with user data
export interface AuthRequest extends Request {
  user?: IUser;
}

// Define a type for Express middleware functions
export type ExpressMiddleware = (
  req: Request | AuthRequest,
  res: Response,
  next: NextFunction
) => Promise<any> | void;

// Protect routes - verify token and set req.user
export const protect: ExpressMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Check if token is blacklisted
      const isBlacklisted = await TokenBlacklist.findOne({ token });
      if (isBlacklisted) {
        return res.status(401).json({ 
          message: 'Token has been revoked',
          error: 'token_revoked'
        });
      }

      // Verify token
      const decoded = verifyAccessToken(token);
      
      // Check token type
      if (decoded.type !== 'access') {
        return res.status(401).json({ 
          message: 'Invalid token type',
          error: 'auth_error'
        });
      }

      // Get user from token
      const user = await User.findById(decoded.id).select('-password -refreshToken');
      
      if (!user) {
        return res.status(401).json({ 
          message: 'User not found',
          error: 'auth_error'
        });
      }
      
      req.user = user;
      return next();
    } catch (error: any) {
      console.error('Auth error:', error.message);
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          message: 'Token expired',
          error: 'token_expired' 
        });
      }
      
      return res.status(401).json({ 
        message: 'Not authorized, token failed',
        error: 'auth_error'
      });
    }
  }

  if (!token) {
    return res.status(401).json({ 
      message: 'Not authorized, no token',
      error: 'no_token'
    });
  }
};

// Admin middleware
export const admin: ExpressMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Not authorized as an admin',
      error: 'permission_denied'
    });
  }
};
