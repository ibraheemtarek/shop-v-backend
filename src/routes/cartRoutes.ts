import express from 'express';
import { csrfProtect } from '../middleware/csrfMiddleware';
import {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController';
import { protect } from '../middleware/authMiddleware';
import {
  addToCartValidation,
  updateCartItemValidation,
  removeFromCartValidation,
} from '../middleware/validators/cartValidators';
import { validate } from '../middleware/validators/validatorUtils';

const router = express.Router();

// All routes are protected
router.get('/', protect, getUserCart);
router.post('/add', protect, validate(addToCartValidation), addToCart);
router.put('/:productId', protect, validate(updateCartItemValidation), updateCartItem);
router.delete('/:productId', protect, validate(removeFromCartValidation), removeFromCart);
router.delete('/', protect, clearCart);

export default router;
