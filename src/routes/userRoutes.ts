import express from 'express';
import {
  registerUser,
  getUserProfile,
  updateUserProfile,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  forgotPassword,
  resetPassword
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';
import { csrfProtect } from '../middleware/csrfMiddleware';
import { asyncHandler } from '../utils/routeUtils';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
  wishlistAddValidation,
  wishlistRemoveValidation,
  forgotPasswordValidation,
  resetPasswordValidation
} from '../middleware/validators/userValidators';
import { validate } from '../middleware/validators/validatorUtils';
import { registerLimiter } from '../middleware/rateLimitMiddleware';
import { passwordResetLimiter } from '../middleware/rateLimitMiddleware';

const router = express.Router();

// Public routes
router.post('/register', registerLimiter, validate(registerValidation), asyncHandler(registerUser));
// Password reset routes
router.post('/forgot-password', passwordResetLimiter, validate(forgotPasswordValidation), asyncHandler(forgotPassword));
router.post('/reset-password', validate(resetPasswordValidation), asyncHandler(resetPassword));

// Protected routes
router.get('/profile', protect, asyncHandler(getUserProfile));
router.put('/profile', protect, validate(updateProfileValidation), asyncHandler(updateUserProfile));
router.post('/wishlist', protect, validate(wishlistAddValidation), asyncHandler(addToWishlist));
router.delete('/wishlist/:productId', protect, validate(wishlistRemoveValidation), asyncHandler(removeFromWishlist));
router.get('/wishlist', protect, asyncHandler(getWishlist));

export default router;
