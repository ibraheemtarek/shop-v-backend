import express from 'express';
import { csrfProtect } from '../middleware/csrfMiddleware';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  deleteCategoryImage
} from '../controllers/categoryController';
import { protect, admin } from '../middleware/authMiddleware';
import {
  createCategoryValidation,
  updateCategoryValidation,
  categoryIdValidation,
  categorySlugValidation
} from '../middleware/validators/categoryValidators';
import { validate } from '../middleware/validators/validatorUtils';
import { handleCategoryImageUpload, handleCategoryImageReplacement } from '../middleware/uploadMiddleware';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:slug', validate(categorySlugValidation), getCategoryBySlug);

// Protected routes (admin only)
router.post('/', protect, admin, validate(createCategoryValidation), createCategory);
router.put('/:id', protect, admin, validate([...categoryIdValidation, ...updateCategoryValidation]), updateCategory);
router.delete('/:id', protect, admin, validate(categoryIdValidation), deleteCategory);

// Separate routes for category image handling
router.post('/:id/image', 
  protect, 
  admin, 
  validate(categoryIdValidation),
  handleCategoryImageUpload,
  handleCategoryImageReplacement,
  uploadCategoryImage
);

router.delete('/:id/image', 
  protect, 
  admin, 
  validate(categoryIdValidation),
  deleteCategoryImage
);

export default router;
