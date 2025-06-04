import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import { apiLimiter, authLimiter, registerLimiter, passwordResetLimiter } from './middleware/rateLimitMiddleware';
import { notFound, errorHandler } from './middleware/errorMiddleware';
import { securityHeaders } from './middleware/securityMiddleware';
import { csrfProtect, generateCsrfToken } from './middleware/csrfMiddleware';

import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import userRoutes from './routes/userRoutes';
import orderRoutes from './routes/orderRoutes';
import cartRoutes from './routes/cartRoutes';
import authRoutes from './routes/authRoutes';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : true,
  credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(securityHeaders);

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/refresh', authLimiter);
app.use('/api/users/register', registerLimiter);
app.use('/api/users/forgot-password', passwordResetLimiter);

app.use('/api', apiLimiter);

app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

app.get('/api/csrf-token', generateCsrfToken);

app.use('/api/users', csrfProtect, userRoutes);
app.use('/api/orders', csrfProtect, orderRoutes);
app.use('/api/cart', csrfProtect, cartRoutes);
app.use('/api/auth', authRoutes); 

// app.get('/api/health', (req: Request, res: Response) => {
//   res.status(200).json({ status: 'ok', message: 'Server is running' });
// });

app.use(notFound);
app.use(errorHandler);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shopverse';
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

export default app;
