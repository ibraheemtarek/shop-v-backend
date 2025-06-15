import { Request, Response } from 'express';
import User from '../models/User';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/tokenUtils';

/**
 * Login user and generate access and refresh tokens
 * @route POST /api/auth/login
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const existingRefreshToken = req.cookies.refreshToken;
    
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      const accessToken = generateAccessToken(user._id);
      let refreshToken = existingRefreshToken;
      
      if (existingRefreshToken) {
        try {
          const decoded = verifyRefreshToken(existingRefreshToken);
          
          const tokenExists = user.refreshToken?.includes(existingRefreshToken);
          
          if (!tokenExists || decoded.id !== user._id.toString()) {
            refreshToken = generateRefreshToken(user._id);
          }
        } catch (error) {
          refreshToken = generateRefreshToken(user._id);
        }
      } else {
        refreshToken = generateRefreshToken(user._id);
      }
      
      if (!existingRefreshToken || !user.refreshToken?.includes(refreshToken)) {
        user.refreshToken = user.refreshToken ? 
          [...user.refreshToken, refreshToken] : 
          [refreshToken];
        await user.save();
      }
      
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        token: accessToken
      });
    } else {
      res.status(401).json({ 
        message: 'Invalid email or password',
        error: 'auth_failed'
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message,
      error: 'server_error'
    });
  }
};

/**
 * Refresh access token using refresh token
 * @route POST /api/auth/refresh
 */
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    if (!refreshToken) {
      res.status(401).json({ 
        message: 'Refresh token required',
        error: 'no_token'
      });
      return;
    }
    
    try {
      const user = await User.findOne({ refreshToken: { $in: [refreshToken] } });
      
      if (!user) {
        res.status(401).json({ 
          message: 'Invalid refresh token',
          error: 'invalid_token'
        });
        return;
      }
      
      const accessToken = generateAccessToken(user._id);
      
      res.status(200).json({ token: accessToken });
    } catch (error) {
      res.status(401).json({ 
        message: 'Invalid refresh token',
        error: 'invalid_token'
      });
    }
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message,
      error: 'server_error'
    });
  }
};

/**
 * Logout user and invalidate tokens
 * @route POST /api/auth/logout
 */
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies.refreshToken;
    
    let accessToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      accessToken = req.headers.authorization.split(' ')[1];
    }
    
    if (!refreshToken && !accessToken) {
      res.status(204).end();
      return;
    }
    
    if (refreshToken) {
      const user = await User.findOne({ refreshToken: { $in: [refreshToken] } });
      
      if (user && user.refreshToken) {
        user.refreshToken = user.refreshToken.filter(token => token !== refreshToken);
        await user.save();
      }
      
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
    
    if (accessToken) {
      const TokenBlacklist = (await import('../models/TokenBlacklist')).default;
      
      await new TokenBlacklist({
        token: accessToken,
        createdAt: new Date()
      }).save();
    }
    
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message,
      error: 'server_error'
    });
  }
};
