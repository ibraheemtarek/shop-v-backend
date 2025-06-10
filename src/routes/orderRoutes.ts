import express from 'express';
import { csrfProtect } from '../middleware/csrfMiddleware';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  getOrders,
  processRefund
} from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';
import {
  createOrderValidation,
  orderIdValidation,
  updateOrderToPaidValidation,
  updateOrderStatusValidation,
  processRefundValidation
} from '../middleware/validators/orderValidators';
import { validate } from '../middleware/validators/validatorUtils';

const router = express.Router();

// Protected routes
router.post('/', protect, csrfProtect, validate(createOrderValidation), createOrder);
router.get('/myorders', protect, getUserOrders);
router.get('/:id', protect, validate(orderIdValidation), getOrderById);
router.put('/:id/pay', protect, csrfProtect, validate(updateOrderToPaidValidation), updateOrderToPaid);

// Admin routes
router.get('/', protect, admin, getOrders);
router.put('/:id/deliver', protect, admin, csrfProtect, validate(orderIdValidation), updateOrderToDelivered);
router.put('/:id/status', protect, admin, csrfProtect, validate(updateOrderStatusValidation), updateOrderStatus);
router.put('/:id/refund', protect, admin, csrfProtect, validate(processRefundValidation), processRefund);

export default router;
