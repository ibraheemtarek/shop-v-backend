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

const router = express.Router();

// Public routes
router.post('/register', csrfProtect, validate(registerValidation), asyncHandler(registerUser));
// Password reset routes
router.post('/forgot-password', csrfProtect, validate(forgotPasswordValidation), asyncHandler(forgotPassword));
router.post('/reset-password', csrfProtect, validate(resetPasswordValidation), asyncHandler(resetPassword));

// Protected routes
router.get('/profile', protect, asyncHandler(getUserProfile));
router.put('/profile', protect, csrfProtect, validate(updateProfileValidation), asyncHandler(updateUserProfile));
router.post('/wishlist', protect, csrfProtect, validate(wishlistAddValidation), asyncHandler(addToWishlist));
router.delete('/wishlist/:productId', protect, csrfProtect, validate(wishlistRemoveValidation), asyncHandler(removeFromWishlist));
router.get('/wishlist', protect, asyncHandler(getWishlist));

export default router;
