import express from 'express';
import { csrfProtect } from '../middleware/csrfMiddleware';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getBestsellerProducts,
  getSaleProducts,
  uploadProductImage,
  uploadProductImages,
  deleteProductImage
} from '../controllers/productController';
import { protect, admin } from '../middleware/authMiddleware';
import { handleSingleUpload, handleMultipleUploads, handleImageReplacement } from '../middleware/uploadMiddleware';
import {
  getProductsValidation,
  productIdValidation,
  createProductValidation,
  updateProductValidation
} from '../middleware/validators/productValidators';
import { validate } from '../middleware/validators/validatorUtils';

const router = express.Router();

// Public routes
router.get('/', validate(getProductsValidation), getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellerProducts);
router.get('/sale', getSaleProducts);
router.get('/:id', validate(productIdValidation), getProductById);

// Protected routes (admin only)
router.post('/', 
  protect, 
  admin,
  validate(createProductValidation), 
  handleSingleUpload, 
  handleMultipleUploads, 
  createProduct
);

router.put('/:id', 
  protect, 
  admin,
  validate([...productIdValidation, ...updateProductValidation]), 
  handleSingleUpload, 
  handleMultipleUploads, 
  handleImageReplacement, 
  updateProduct
);

router.delete('/:id', protect, admin, validate(productIdValidation), deleteProduct);

// New routes for separate image handling
router.post('/:id/image', 
  protect, 
  admin, 
  validate(productIdValidation),
  handleSingleUpload,
  uploadProductImage
);

router.post('/:id/images', 
  protect, 
  admin, 
  validate(productIdValidation),
  handleMultipleUploads,
  uploadProductImages
);

router.delete('/:productId/image/:imageIndex', 
  protect, 
  admin,
  deleteProductImage
);

export default router;
