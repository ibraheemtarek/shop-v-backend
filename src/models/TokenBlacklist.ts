import mongoose, { Schema, Document } from 'mongoose';

export interface ITokenBlacklist extends Document {
  token: string;
  createdAt: Date;
}

const tokenBlacklistSchema = new Schema({
  token: { 
    type: String, 
    required: true, 
    unique: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: '24h' // Automatically remove entries after 24 hours using MongoDB TTL index
  }
});

export default mongoose.model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema);
