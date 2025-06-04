import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { users } from './data/users';
import { products } from './data/products';
import { categories } from './data/categories';
import User from './models/User';
import Product from './models/Product';
import Category from './models/Category';
import Order from './models/Order';
import Cart from './models/Cart';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Import data
const importData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    console.log('Data cleared...');

    // Import users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;

    console.log('Users imported...');

    // Import categories
    const createdCategories = await Category.insertMany(categories);
    console.log('Categories imported...');
    
    // Create a map of category names to their ObjectIds
    const categoryMap = new Map();
    createdCategories.forEach(category => {
      categoryMap.set(category.name, category._id);
    });

    // Add admin user reference to products and map category string to ObjectId
    const sampleProducts = products.map(product => {
      const categoryName = product.category as string;
      const categoryId = categoryMap.get(categoryName);
      
      if (!categoryId) {
        console.warn(`Category not found for: ${categoryName}`);
        // Default to first category if not found
        return { 
          ...product, 
          user: adminUser,
          category: createdCategories[0]._id,
          categoryName: categoryName
        };
      }
      
      return { 
        ...product, 
        user: adminUser,
        category: categoryId,
        categoryName: categoryName
      };
    });

    // Import products
    await Product.insertMany(sampleProducts);
    console.log('Products imported...');

    console.log('Data import completed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Destroy data
const destroyData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

// Check command line argument to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
