import jwt, { SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';

export interface TokenPayload {
  id: string;
  type: string;
  iat?: number;
  exp?: number;
}

/**
 * Generate access token (short-lived)
 * @param id User ID
 * @returns JWT access token
 */
export const generateAccessToken = (id: string | Types.ObjectId): string => {
  const payload: TokenPayload = { id: id.toString(), type: 'access' };
  const secret = process.env.JWT_ACCESS_SECRET;
  
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable must be defined');
  }
  
  // Use environment variable for expiration time with fallback to 15 minutes
  const options: SignOptions = { expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m' as any };
  
  return jwt.sign(payload, secret, options);
};

/**
 * Generate refresh token (long-lived)
 * @param id User ID
 * @returns JWT refresh token
 */
export const generateRefreshToken = (id: string | Types.ObjectId): string => {
  const payload: TokenPayload = { id: id.toString(), type: 'refresh' };
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable must be defined');
  }
  
  // Use environment variable for expiration time with fallback to 7 days
  const options: SignOptions = { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' as any };
  
  return jwt.sign(payload, secret, options);
};

/**
 * Verify access token
 * @param token JWT access token
 * @returns Decoded token payload
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable must be defined');
  }
  
  return jwt.verify(token, secret) as TokenPayload;
};

/**
 * Verify refresh token
 * @param token JWT refresh token
 * @returns Decoded token payload
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_REFRESH_SECRET;
  
  if (!secret) {
    throw new Error('JWT_REFRESH_SECRET environment variable must be defined');
  }
  
  return jwt.verify(token, secret) as TokenPayload;
};
