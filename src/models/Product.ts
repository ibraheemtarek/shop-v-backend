import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IProduct extends Omit<Document, 'isNewProduct'> {
  _id: mongoose.Types.ObjectId;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: mongoose.Types.ObjectId;
  categoryName?: string;
  image: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  features?: string[];
  colors?: string[];
  sizes?: string[];
  inStock: boolean;
  isNewProduct?: boolean;
  isOnSale?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String, required: true },
    category: { 
      type: mongoose.Schema.Types.ObjectId, 
      required: true,
      ref: 'Category' 
    },
    categoryName: { type: String },
    image: { type: String, required: true },
    images: { type: [String] },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    features: { type: [String] },
    colors: { type: [String] },
    sizes: { type: [String] },
    inStock: { type: Boolean, default: true },
    isNewProduct: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>('Product', ProductSchema);
