import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const productUploadDir = path.join(process.cwd(), 'uploads', 'products');
if (!fs.existsSync(productUploadDir)) {
  fs.mkdirSync(productUploadDir, { recursive: true });
}

const categoryUploadDir = path.join(process.cwd(), 'uploads', 'categories');
if (!fs.existsSync(categoryUploadDir)) {
  fs.mkdirSync(categoryUploadDir, { recursive: true });
}

// Create storage configuration with dynamic destination
const createStorage = (destinationDir: string) => multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, destinationDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// Storage configurations
const productStorage = createStorage(productUploadDir);
const categoryStorage = createStorage(categoryUploadDir);

const fileFilter = (req: Request, file: any, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|webp/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Images only! Please upload an image file (jpeg, jpg, png, webp)'));
};

// Product upload middleware
export const uploadSingle = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
}).single('image');

export const uploadMultiple = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
}).array('images', 5);

// Category upload middleware
export const uploadCategoryImage = multer({
  storage: categoryStorage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } 
}).single('image'); 

export const deleteImage = async (filePath: string): Promise<void> => {
  try {
    const filename = path.basename(filePath);
    let fullPath;
    
    if (filePath.includes('/products/')) {
      fullPath = path.join(productUploadDir, filename);
    } else if (filePath.includes('/categories/')) {
      fullPath = path.join(categoryUploadDir, filename);
    } else {
      console.error('Unknown image path type:', filePath);
      return;
    }
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

export const getPublicIdFromUrl = (url: string): string => {
  return path.basename(url);
};
