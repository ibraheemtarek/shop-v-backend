import { body, param, query } from 'express-validator';

// Registration validation
export const registerValidation = [
  body('firstName')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    body('agreeTerms')
    .notEmpty().withMessage('Terms agreement is required')
    .custom((value) => {
      // Check if the value is either boolean true or string "true"
      if (value === true || value === "true") {
        return true;
      }
      throw new Error('You must agree to the terms and conditions');
    }),
];

// Login validation
export const loginValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];

// Profile update validation
export const updateProfileValidation = [
  body('firstName')
    .optional()
    .isString().withMessage('First name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .optional()
    .isString().withMessage('Last name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  body('address')
    .optional()
    .isObject().withMessage('Address must be an object'),
  
  body('address.street')
    .optional()
    .isString().withMessage('Street must be a string'),
  
  body('address.city')
    .optional()
    .isString().withMessage('City must be a string'),
  
  body('address.state')
    .optional()
    .isString().withMessage('State must be a string'),
  
  body('address.zipCode')
    .optional()
    .isString().withMessage('Zip code must be a string'),
  
  body('address.country')
    .optional()
    .isString().withMessage('Country must be a string'),
  
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string'),
];

// Wishlist validation
export const wishlistAddValidation = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID format'),
];

export const wishlistRemoveValidation = [
  param('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID format'),
];

// Forgot password validation
export const forgotPasswordValidation = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
];

// Reset password validation
export const resetPasswordValidation = [
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter')
    .matches(/\d/).withMessage('Password must contain at least one number'),
  
  body('confirmPassword')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
  
  query('token')
    .notEmpty().withMessage('Reset token is required')
];
