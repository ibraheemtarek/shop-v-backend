import { body, param } from 'express-validator';

// Create order validation
export const createOrderValidation = [
  // Order items validation
  body('orderItems')
    .notEmpty().withMessage('Order items are required')
    .isArray().withMessage('Order items must be an array'),
  
  body('orderItems.*.product')
    .exists().withMessage('Product ID is required for each order item')
    .notEmpty().withMessage('Product ID cannot be empty')
    .isMongoId().withMessage('Invalid product ID format')
    .customSanitizer(value => value.toString()),
  
  body('orderItems.*.name')
    .notEmpty().withMessage('Product name is required for each order item')
    .isString().withMessage('Product name must be a string'),
  
  body('orderItems.*.quantity')
    .notEmpty().withMessage('Quantity is required for each order item')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  
  body('orderItems.*.image')
    .notEmpty().withMessage('Product image is required for each order item')
    .isString().withMessage('Product image must be a string URL'),
  
  body('orderItems.*.price')
    .notEmpty().withMessage('Price is required for each order item')
    .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  
  // Shipping address validation
  body('shippingAddress')
    .notEmpty().withMessage('Shipping address is required')
    .isObject().withMessage('Shipping address must be an object'),
  
  body('shippingAddress.firstName')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string'),
  
  body('shippingAddress.lastName')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string'),
  
  body('shippingAddress.address')
    .notEmpty().withMessage('Address is required')
    .isString().withMessage('Address must be a string'),
  
  body('shippingAddress.apartment')
    .optional()
    .isString().withMessage('Apartment must be a string'),
  
  body('shippingAddress.city')
    .notEmpty().withMessage('City is required')
    .isString().withMessage('City must be a string'),
  
  body('shippingAddress.state')
    .notEmpty().withMessage('State is required')
    .isString().withMessage('State must be a string'),
  
  body('shippingAddress.zipCode')
    .notEmpty().withMessage('Zip code is required')
    .isString().withMessage('Zip code must be a string'),
  
  body('shippingAddress.country')
    .notEmpty().withMessage('Country is required')
    .isString().withMessage('Country must be a string'),
  
  body('shippingAddress.phone')
    .notEmpty().withMessage('Phone number is required')
    .isString().withMessage('Phone number must be a string'),
  
  // Payment method validation
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required')
    .isString().withMessage('Payment method must be a string')
    .equals('cod').withMessage('Payment method must be cod'),
  
  // Price validation
  body('itemsPrice')
    .notEmpty().withMessage('Items price is required')
    .isFloat({ min: 0 }).withMessage('Items price must be a positive number'),
  
  body('taxPrice')
    .notEmpty().withMessage('Tax price is required')
    .isFloat({ min: 0 }).withMessage('Tax price must be a positive number'),
  
  body('shippingPrice')
    .notEmpty().withMessage('Shipping price is required')
    .isFloat({ min: 0 }).withMessage('Shipping price must be a positive number'),
  
  body('totalPrice')
    .notEmpty().withMessage('Total price is required')
    .isFloat({ min: 0 }).withMessage('Total price must be a positive number')
    .custom((value, { req }) => {
      if (req.body.itemsPrice && req.body.taxPrice && req.body.shippingPrice) {
        const calculatedTotal = 
          parseFloat(req.body.itemsPrice) + 
          parseFloat(req.body.taxPrice) + 
          parseFloat(req.body.shippingPrice);
        
        // Allow a small difference for floating point calculations
        if (Math.abs(parseFloat(value) - calculatedTotal) > 0.01) {
          throw new Error('Total price does not match the sum of items, tax, and shipping prices');
        }
      }
      return true;
    }),
];

// Order ID validation
export const orderIdValidation = [
  param('id')
    .notEmpty().withMessage('Order ID is required')
    .isMongoId().withMessage('Invalid order ID format'),
];

// Update order to paid validation
export const updateOrderToPaidValidation = [
  param('id')
    .notEmpty().withMessage('Order ID is required')
    .isMongoId().withMessage('Invalid order ID format'),
  
  body('id')
    .notEmpty().withMessage('Payment ID is required')
    .isString().withMessage('Payment ID must be a string'),
    
  body('status')
    .notEmpty().withMessage('Payment status is required')
    .isString().withMessage('Payment status must be a string'),
    
  body('update_time')
    .notEmpty().withMessage('Update time is required')
    .isString().withMessage('Update time must be a string'),
    
  body('email_address')
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Invalid email format'),
];

// Update order status validation
export const updateOrderStatusValidation = [
  param('id')
    .notEmpty().withMessage('Order ID is required')
    .isMongoId().withMessage('Invalid order ID format'),
  
  body('status')
    .notEmpty().withMessage('Order status is required')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
    .withMessage('Invalid order status. Must be one of: pending, processing, shipped, delivered, cancelled, refunded'),
];

// Process refund validation
export const processRefundValidation = [
  param('id')
    .notEmpty().withMessage('Order ID is required')
    .isMongoId().withMessage('Invalid order ID format'),
  
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Refund amount must be greater than 0'),
  
  body('reason')
    .optional()
    .isString().withMessage('Refund reason must be a string'),
  
  body('refundAll')
    .optional()
    .isBoolean().withMessage('refundAll must be a boolean'),
];
