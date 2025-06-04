import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import { IUser } from '../models/User';

// Generate unique order number
const generateOrderNumber = () => {
  const timestamp = new Date().getTime().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD-${timestamp}-${random}`;
};

// Create new order
export const createOrder = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' }); return;
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' }); return;
    }

    // Validate payment method (only COD supported)
    if (paymentMethod !== 'cod') {
      res.status(400).json({ message: 'Only Cash on Delivery payment method is supported' }); return;
    }

    // Get user's cart
    const Cart = mongoose.model('Cart');
    const userCart = await Cart.findOne({ user: req.user._id });
    
    if (!userCart || userCart.items.length === 0) {
      res.status(400).json({ message: 'Your cart is empty' }); return;
    }

    // Verify each order item exists in the cart
    const cartItemMap = new Map();
    userCart.items.forEach((item: { product: { toString: () => any; }; quantity: any; price: any; name: any; image: any; }) => {
      cartItemMap.set(item.product.toString(), {
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        image: item.image
      });
    });

    // Get all products from database to verify their existence and prices
    const Product = mongoose.model('Product');
    const productIds = orderItems.map((item: { product: any; }) => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== productIds.length) {
      res.status(400).json({ message: 'One or more products do not exist' }); return;
    }

    // Create a map of product data for quick lookup
    const productMap = new Map();
    products.forEach(product => {
      productMap.set(product._id.toString(), {
        price: product.price,
        inStock: product.inStock,
        name: product.name,
        image: product.image
      });
    });

    // Validate each order item
    const validatedOrderItems = [];
    let calculatedItemsPrice = 0;

    for (const item of orderItems) {
      const productId = item.product.toString();
      
      // Check if product exists in cart
      if (!cartItemMap.has(productId)) {
        res.status(400).json({ 
          message: `Product ${item.name} is not in your cart` 
        }); 
        return;
      }

      // Check if product exists in database
      if (!productMap.has(productId)) {
        res.status(400).json({ 
          message: `Product ${item.name} does not exist` 
        }); 
        return;
      }

      const dbProduct = productMap.get(productId);
      const cartItem = cartItemMap.get(productId);

      // Check if product is in stock
      if (!dbProduct.inStock) {
        res.status(400).json({ 
          message: `Product ${item.name} is out of stock` 
        }); 
        return;
      }

      // Verify price matches database price
      if (item.price !== dbProduct.price) {
        res.status(400).json({ 
          message: `Price for ${item.name} does not match current price` 
        }); 
        return;
      }

      // Verify quantity doesn't exceed cart quantity
      if (item.quantity > cartItem.quantity) {
        res.status(400).json({ 
          message: `Quantity for ${item.name} exceeds what's in your cart` 
        }); 
        return;
      }

      // Add validated item to order items
      validatedOrderItems.push({
        product: item.product,
        name: dbProduct.name,
        quantity: item.quantity,
        image: dbProduct.image,
        price: dbProduct.price
      });

      // Calculate item total
      calculatedItemsPrice += dbProduct.price * item.quantity;
    }

    // Calculate prices on server side
    const calculatedTaxPrice = Number((calculatedItemsPrice * 0.15).toFixed(2));
    const calculatedShippingPrice = calculatedItemsPrice > 100 ? 0 : 10;
    const calculatedTotalPrice = (
      calculatedItemsPrice + 
      calculatedTaxPrice + 
      calculatedShippingPrice
    ).toFixed(2);

    // Verify total prices
    if (
      Math.abs(calculatedItemsPrice - itemsPrice) > 0.01 ||
      Math.abs(calculatedTaxPrice - taxPrice) > 0.01 ||
      Math.abs(calculatedShippingPrice - shippingPrice) > 0.01 ||
      Math.abs(parseFloat(calculatedTotalPrice) - totalPrice) > 0.01
    ) {
      res.status(400).json({ 
        message: 'Price calculation mismatch. Please try again.' 
      }); 
      return;
    }

    // Create and save the order with validated data
    const order = new Order({
      user: req.user._id,
      orderItems: validatedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice: calculatedItemsPrice,
      taxPrice: calculatedTaxPrice,
      shippingPrice: calculatedShippingPrice,
      totalPrice: parseFloat(calculatedTotalPrice),
      orderNumber: generateOrderNumber(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' }); return;
    }

    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

    if (!order) {
      res.status(404).json({ message: 'Order not found' }); return;
    }

    // Check if the user is the owner of the order or an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to view this order' }); return;
    }

    res.status(200).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get user orders
export const getUserOrders = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' }); return;
    }

    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to paid
export const updateOrderToPaid = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' }); return;
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'processing';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to delivered
export const updateOrderToDelivered = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' }); return;
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = 'delivered';

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' }); return;
    }

    order.status = status;

    // Update additional fields based on status
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    } else if (status === 'processing' && !order.isPaid) {
      order.isPaid = true;
      order.paidAt = new Date();
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders (admin)
export const getOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({}).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Process order refund (admin)
export const processRefund = async (req: Request & { user?: IUser }, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason, amount, refundAll } = req.body;
    
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      res.status(401).json({ message: 'Not authorized as admin' });
      return;
    }
    
    const order = await Order.findById(id);
    
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }
    
    if (!order.isPaid) {
      res.status(400).json({ message: 'Order has not been paid yet' });
      return;
    }
    
    if (order.isRefunded) {
      res.status(400).json({ message: 'Order has already been refunded' });
      return;
    }
    
    // Calculate refund amount
    const refundAmount = refundAll ? order.totalPrice : amount;
    
    // Process the refund for Cash on Delivery order
    
    // Update the order
    order.isRefunded = true;
    order.refundedAt = new Date();
    order.status = 'refunded';
    order.refundResult = {
      id: `refund-${Date.now()}`,
      status: 'succeeded',
      amount: refundAmount,
      reason: reason || 'requested_by_customer'
    };
    
    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
