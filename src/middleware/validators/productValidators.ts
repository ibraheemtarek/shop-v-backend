import { body, query, param } from 'express-validator';

// Product creation validation
export const createProductValidation = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isString().withMessage('Product name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('category')
    .notEmpty().withMessage('Category is required')
    .custom(value => {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(value);
      const isString = typeof value === 'string';
      if (!(isValidObjectId || isString)) {
        throw new Error('Category must be a valid category ID or name');
      }
      return true;
    }),
  
  body('image')
    .notEmpty().withMessage('Image is required')
    .isString().withMessage('Image must be a string URL'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array of strings'),
  
  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string URL'),
  
  body('features')
    .optional()
    .isArray().withMessage('Features must be an array of strings'),
  
  body('features.*')
    .optional()
    .isString().withMessage('Each feature must be a string'),
  
  body('colors')
    .optional()
    .isArray().withMessage('Colors must be an array of strings'),
  
  body('colors.*')
    .optional()
    .isString().withMessage('Each color must be a string'),
  
  body('sizes')
    .optional()
    .isArray().withMessage('Sizes must be an array of strings'),
  
  body('sizes.*')
    .optional()
    .isString().withMessage('Each size must be a string'),
  
  body('inStock')
    .optional()
    .isBoolean().withMessage('inStock must be a boolean'),
  
  body('isNewProduct')
    .optional()
    .isBoolean().withMessage('isNewProduct must be a boolean'),
  
  body('isOnSale')
    .optional()
    .isBoolean().withMessage('isOnSale must be a boolean'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Original price must be a positive number')
];

// Product update validation
export const updateProductValidation = [
  body('name')
    .optional()
    .isString().withMessage('Product name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Product name must be between 2 and 100 characters'),
  
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  body('description')
    .optional()
    .isString().withMessage('Description must be a string')
    .isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  
  body('category')
    .optional()
    .custom(value => {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(value);
      const isString = typeof value === 'string';
      if (!(isValidObjectId || isString)) {
        throw new Error('Category must be a valid category ID or name');
      }
      return true;
    }),
  
  body('image')
    .optional()
    .isString().withMessage('Image must be a string URL'),
  
  body('images')
    .optional()
    .isArray().withMessage('Images must be an array of strings'),
  
  body('images.*')
    .optional()
    .isString().withMessage('Each image must be a string URL'),
  
  body('features')
    .optional()
    .isArray().withMessage('Features must be an array of strings'),
  
  body('features.*')
    .optional()
    .isString().withMessage('Each feature must be a string'),
  
  body('colors')
    .optional()
    .isArray().withMessage('Colors must be an array of strings'),
  
  body('colors.*')
    .optional()
    .isString().withMessage('Each color must be a string'),
  
  body('sizes')
    .optional()
    .isArray().withMessage('Sizes must be an array of strings'),
  
  body('sizes.*')
    .optional()
    .isString().withMessage('Each size must be a string'),
  
  body('inStock')
    .optional()
    .isBoolean().withMessage('inStock must be a boolean'),
  
  body('isNewProduct')
    .optional()
    .isBoolean().withMessage('isNewProduct must be a boolean'),
  
  body('isOnSale')
    .optional()
    .isBoolean().withMessage('isOnSale must be a boolean'),
  
  body('originalPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Original price must be a positive number')
];

// Product query validation
export const getProductsValidation = [
  query('category')
    .optional()
    .custom(value => {
      const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(value);
      const isString = typeof value === 'string';
      if (!(isValidObjectId || isString)) {
        throw new Error('Category must be a valid category ID or name');
      }
      return true;
    }),
  
  query('search')
    .optional()
    .isString().withMessage('Search term must be a string'),
  
  query('minPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Minimum price must be a positive number'),
  
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Maximum price must be a positive number')
    .custom((value, { req }) => {
      if (req.query && req.query.minPrice && Number(value) <= Number(req.query.minPrice)) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    }),
  
  query('isNewProduct')
    .optional()
    .isBoolean().withMessage('isNewProduct must be a boolean string (true/false)')
    .toBoolean(),
  
  query('isOnSale')
    .optional()
    .isBoolean().withMessage('isOnSale must be a boolean string (true/false)')
    .toBoolean(),
  
  query('sort')
    .optional()
    .isString().withMessage('Sort must be a string')
    .isIn(['price', 'createdAt', 'rating']).withMessage('Sort must be one of: price, createdAt, rating'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be a number between 1 and 100')
    .toInt(),
  
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive number')
    .toInt()
];

// Product ID validation
export const productIdValidation = [
  param('id')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID format')
];
