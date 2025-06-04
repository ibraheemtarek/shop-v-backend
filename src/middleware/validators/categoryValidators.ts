import { body, param } from 'express-validator';

// Category creation validation
export const createCategoryValidation = [
  body('name')
    .notEmpty().withMessage('Category name is required')
    .isString().withMessage('Category name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  
  body('slug')
    .notEmpty().withMessage('Slug is required')
    .isString().withMessage('Slug must be a string')
    .isSlug().withMessage('Slug must be a valid slug format')
    .isLength({ min: 2, max: 50 }).withMessage('Slug must be between 2 and 50 characters'),
  
  body('image')
    .notEmpty().withMessage('Image is required')
    .isString().withMessage('Image must be a string URL'),
];

// Category update validation
export const updateCategoryValidation = [
  body('name')
    .optional()
    .isString().withMessage('Category name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  
  body('slug')
    .optional()
    .isString().withMessage('Slug must be a string')
    .isSlug().withMessage('Slug must be a valid slug format')
    .isLength({ min: 2, max: 50 }).withMessage('Slug must be between 2 and 50 characters'),
  
  body('image')
    .optional()
    .isString().withMessage('Image must be a string URL'),
];

// Category ID validation
export const categoryIdValidation = [
  param('id')
    .notEmpty().withMessage('Category ID is required')
    .isMongoId().withMessage('Invalid category ID format'),
];

// Category slug validation
export const categorySlugValidation = [
  param('slug')
    .notEmpty().withMessage('Category slug is required')
    .isString().withMessage('Slug must be a string'),
];
