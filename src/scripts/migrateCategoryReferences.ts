import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product';
import Category from '../models/Category';

dotenv.config();

// Database connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log('Connected to MongoDB for migration');
    migrateProducts();
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

async function migrateProducts() {
  try {
    // Get all categories and index them by name for quick lookup
    const categories = await Category.find({});
    const categoryMap = new Map();
    
    categories.forEach(category => {
      categoryMap.set(category.name.toLowerCase(), category._id);
    });
    
    // Get all products
    const products = await Product.find({});
    console.log(`Found ${products.length} products to migrate`);
    
    let updated = 0;
    let skipped = 0;
    let errors = 0;
    
    // Update each product
    for (const product of products) {
      try {
        // Skip if already has an ObjectId reference
        if (mongoose.Types.ObjectId.isValid(product.category as unknown as string)) {
          skipped++;
          continue;
        }
        
        const categoryName = product.category as unknown as string;
        const categoryId = categoryMap.get(categoryName.toLowerCase());
        
        if (!categoryId) {
          console.error(`Category not found for product: ${product.name}, category: ${categoryName}`);
          errors++;
          continue;
        }
        
        // Update the product
        product.categoryName = categoryName;
        product.category = categoryId;
        await product.save();
        updated++;
        
      } catch (err) {
        console.error(`Error updating product ${product._id}:`, err);
        errors++;
      }
    }
    
    console.log(`Migration completed:`);
    console.log(`- Updated: ${updated} products`);
    console.log(`- Skipped: ${skipped} products`);
    console.log(`- Errors: ${errors} products`);
    
    // Disconnect from the database
    mongoose.disconnect();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Migration error:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}
