import { Request, Response, NextFunction } from 'express';
import { uploadSingle, uploadMultiple, uploadCategoryImage, getPublicIdFromUrl, deleteImage } from '../utils/imageUpload';
import Product from '../models/Product';
import Category from '../models/Category';
import path from 'path';

export const handleSingleUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadSingle(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (req.file) {
      req.body.image = `/uploads/products/${path.basename(req.file.path)}`;
    }
    
    next();
  });
};

export const handleMultipleUploads = (req: Request, res: Response, next: NextFunction) => {
  uploadMultiple(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (req.files && Array.isArray(req.files)) {
      req.body.images = req.files.map(file => `/uploads/products/${path.basename(file.path)}`);
    }
    
    next();
  });
};

export const handleCategoryImageUpload = (req: Request, res: Response, next: NextFunction) => {
  uploadCategoryImage(req, res, function(err) {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    
    if (req.file) {
      req.body.image = `/uploads/categories/${path.basename(req.file.path)}`;
    }
    
    next();
  });
};

export const handleCategoryImageReplacement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return next();
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return next();
    }

    // If a new image is being uploaded and there's an existing image, delete the old one
    if (req.file && category.image) {
      await deleteImage(category.image);
    }

    next();
  } catch (error) {
    next(error);
  }
};

export const handleImageReplacement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return next();
    }

    const product = await Product.findById(productId);
    if (!product) {
      return next();
    }
    if (req.file && product.image) {
      await deleteImage(product.image);
    }

    if (req.body.images && Array.isArray(req.body.images) && product.images && Array.isArray(product.images)) {
      const newImageUrls = new Set(req.body.images);
      for (const oldImageUrl of product.images) {
        if (!newImageUrls.has(oldImageUrl)) {
          await deleteImage(oldImageUrl);
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
