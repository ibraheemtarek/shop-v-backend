import { Request, Response } from 'express';
import { deleteImage } from '../utils/imageUpload';
import Product from '../models/Product';
import Category from '../models/Category';
import mongoose from 'mongoose';
import path from 'path';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      category, 
      search, 
      minPrice, 
      maxPrice, 
      isNewProduct, 
      isOnSale, 
      sort = 'createdAt',
      limit = 20, 
      page = 1 
    } = req.query;
    
    // Build filter object
    const filter: any = {};
    
    if (category) {
      // Check if category is an ObjectId or a name
      if (mongoose.Types.ObjectId.isValid(category as string)) {
        filter.category = category;
      } else {
        // Try to find category by name
        try {
          const categoryObj = await Category.findOne({ 
            $or: [
              { name: { $regex: new RegExp(`^${category}$`, 'i') } },
              { slug: { $regex: new RegExp(`^${category}$`, 'i') } }
            ]
          });
          
          if (categoryObj) {
            filter.category = categoryObj._id;
          } else {
            // If category not found by name, use empty filter that won't match any products
            filter.category = new mongoose.Types.ObjectId('000000000000000000000000');
          }
        } catch (err) {
          console.error('Error finding category:', err);
          filter.category = new mongoose.Types.ObjectId('000000000000000000000000');
        }
      }
    }
    
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (isNewProduct === 'true') {
      filter.isNewProduct = true;
    }
    
    if (isOnSale === 'true') {
      filter.isOnSale = true;
    }
    
    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Execute query with population of category
    const products = await Product.find(filter)
      .populate('category', 'name slug')
      .sort({ [sort as string]: sort === 'price' ? 1 : -1 })
      .limit(Number(limit))
      .skip(skip);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    res.status(200).json({
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug image');
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' }); return;
    }
    
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productData = { ...req.body };
    
    // Handle category - if it's a string name, find the corresponding category ID
    if (productData.category && !mongoose.Types.ObjectId.isValid(productData.category)) {
      const categoryName = productData.category;
      const category = await Category.findOne({ 
        $or: [
          { name: { $regex: new RegExp(`^${categoryName}$`, 'i') } },
          { slug: { $regex: new RegExp(`^${categoryName}$`, 'i') } }
        ]
      });
      
      if (!category) {
        res.status(400).json({ message: `Category '${categoryName}' not found` }); 
        return;
      }
      
      productData.category = category._id;
      productData.categoryName = category.name;
    }
    
    const product = new Product(productData);
    const savedProduct = await product.save();
    
    // Populate category before returning
    const populatedProduct = await Product.findById(savedProduct._id)
      .populate('category', 'name slug image');
    
    res.status(201).json(populatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' }); return;
    }
    
    const updateData = { ...req.body };
    
    // Handle category - if it's a string name, find the corresponding category ID
    if (updateData.category && !mongoose.Types.ObjectId.isValid(updateData.category)) {
      const categoryName = updateData.category;
      const category = await Category.findOne({ 
        $or: [
          { name: { $regex: new RegExp(`^${categoryName}$`, 'i') } },
          { slug: { $regex: new RegExp(`^${categoryName}$`, 'i') } }
        ]
      });
      
      if (!category) {
        res.status(400).json({ message: `Category '${categoryName}' not found` }); 
        return;
      }
      
      updateData.category = category._id;
      updateData.categoryName = category.name;
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('category', 'name slug image');
    
    res.status(200).json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' }); return;
    }
    
    if (product.image) {
      try {
        await deleteImage(product.image);
      } catch (imageError) {
        console.error('Error deleting main image:', imageError);
      }
    }
    
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      try {
        for (const imageUrl of product.images) {
          await deleteImage(imageUrl);
        }
      } catch (imagesError) {
        console.error('Error deleting additional images:', imagesError);
      }
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Product removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const featuredProducts = await Product.find({ isNewProduct: true })
      .sort({ createdAt: -1 })
      .limit(8);
    
    res.status(200).json(featuredProducts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBestsellerProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const bestsellerProducts = await Product.find({})
      .sort({ rating: -1, reviewCount: -1 })
      .limit(8);
    
    res.status(200).json(bestsellerProducts);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getSaleProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isOnSale: true }).limit(8);
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProductImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (req.file && product.image) {
      await deleteImage(product.image);
      product.image = `/uploads/products/${path.basename(req.file.path)}`;
      await product.save();
    }

    res.status(200).json({
      message: 'Product image uploaded successfully',
      product
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadProductImages = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (req.files && Array.isArray(req.files)) {
      if (!product.images) {
        product.images = [];
      }

      const newImagePaths = req.files.map(file => `/uploads/products/${path.basename(file.path)}`);
      product.images = [...product.images, ...newImagePaths];
      await product.save();
    }

    res.status(200).json({
      message: 'Product images uploaded successfully',
      product
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProductImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId, imageIndex } = req.params;
    const product = await Product.findById(productId);
    
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    if (imageIndex === 'main') {
      if (product.image) {
        await deleteImage(product.image);
        product.image = '';
        await product.save();
      }
    } else {
      const index = parseInt(imageIndex, 10);
      if (product.images && product.images.length > index) {
        const imageToDelete = product.images[index];
        await deleteImage(imageToDelete);
        
        product.images.splice(index, 1);
        await product.save();
      } else {
        res.status(404).json({ message: 'Image not found' });
        return;
      }
    }

    res.status(200).json({
      message: 'Product image deleted successfully',
      product
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
