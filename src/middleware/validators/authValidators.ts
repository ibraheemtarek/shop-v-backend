import { body } from 'express-validator';

/**
 * Validation rules for token refresh
 * No body validation needed as it uses cookies, but we'll validate if a token is provided in the body as fallback
 */
export const refreshTokenValidation = [
  body('refreshToken')
    .optional()
    .isString().withMessage('Refresh token must be a string'),
];

/**
 * Validation rules for logout
 * No specific validation needed as it uses cookies, but we'll validate if a token is provided in the body as fallback
 */
export const logoutValidation = [
  body('refreshToken')
    .optional()
    .isString().withMessage('Refresh token must be a string'),
];
