import { Request, Response } from 'express';
import Category from '../models/Category';

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({});
    res.status(200).json(categories);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' }); return;
    }
    
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = new Category(req.body);
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' }); return;
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' }); return;
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Category removed' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Upload category image
export const uploadCategoryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' }); return;
    }
    
    // The image path is set by the handleCategoryImageUpload middleware
    if (!req.body.image) {
      res.status(400).json({ message: 'No image uploaded' }); return;
    }
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { image: req.body.image },
      { new: true }
    );
    
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete category image
export const deleteCategoryImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    
    if (!category) {
      res.status(404).json({ message: 'Category not found' }); return;
    }
    
    if (!category.image) {
      res.status(400).json({ message: 'Category has no image to delete' }); return;
    }
    
    // Import deleteImage function from imageUpload utility
    const { deleteImage } = require('../utils/imageUpload');
    await deleteImage(category.image);
    
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { $unset: { image: 1 } },
      { new: true }
    );
    
    res.status(200).json(updatedCategory);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
