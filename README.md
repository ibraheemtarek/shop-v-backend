# Shopverse Prime - Backend API

This is the backend API for the Shopverse Prime e-commerce platform. It provides RESTful endpoints for products, categories, users, orders, and cart functionality with Cash on Delivery (COD) as the payment method.

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication with Refresh Tokens
- Google OAuth Integration
- RESTful API
- Cash on Delivery (COD) payment method
- CSRF Protection

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- MongoDB (local or Atlas)

### Installation

1. Install dependencies:
```sh
npm install
```

2. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
# Server Configuration
PORT=5001
NODE_ENV=development

# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/shopverse

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Email Configuration for Password Reset
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@shopverse.com
EMAIL_FROM_NAME=ShopVerse

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Running the Application

```sh
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Import sample data
npm run data:import

# Remove all data
npm run data:destroy
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/csrf-token` - Generate CSRF token

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/bestsellers` - Get bestseller products
- `GET /api/products/sale` - Get products on sale
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (Admin)
- `PUT /api/products/:id` - Update a product (Admin)
- `DELETE /api/products/:id` - Delete a product (Admin)
- `POST /api/products/:id/image` - Upload a single product image (Admin)
- `POST /api/products/:id/images` - Upload multiple product images (Admin)
- `DELETE /api/products/:productId/image/:imageIndex` - Delete a product image (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug
- `POST /api/categories` - Create a new category (Admin)
- `PUT /api/categories/:id` - Update a category (Admin)
- `DELETE /api/categories/:id` - Delete a category (Admin)
- `POST /api/categories/:id/image` - Upload a category image (Admin)
- `DELETE /api/categories/:id/image` - Delete a category image (Admin)

### Users
- `POST /api/users/register` - Register a new user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/wishlist` - Add product to wishlist
- `DELETE /api/users/wishlist/:productId` - Remove product from wishlist
- `GET /api/users/wishlist` - Get user wishlist
- `POST /api/users/forgot-password` - Request password reset
- `POST /api/users/reset-password` - Reset password with token

### Orders
- `POST /api/orders` - Create a new order (Cash on Delivery)
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/pay` - Update order to paid
- `GET /api/orders` - Get all orders (Admin)
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)
- `PUT /api/orders/:id/refund` - Process refund for order (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:productId` - Update cart item quantity
- `DELETE /api/cart/:productId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### System
- `GET /api/health` - Health check endpoint

## Default Users

After running the data import script, you can use these accounts:

- Admin: admin@example.com / 123456
- User: john@example.com / 123456
- User with address: jane@example.com / 123456

## Deployment to Railway

### Prerequisites

1. Create a [Railway](https://railway.app/) account
2. Install the Railway CLI (optional)
   ```
   npm i -g @railway/cli
   ```

### Deployment Steps

1. **Push your code to GitHub**
   Make sure your code is in a GitHub repository.

2. **Connect Railway to your GitHub repo**
   - Go to [Railway Dashboard](https://railway.app/dashboard)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Configure Environment Variables**
   - In your Railway project, go to the "Variables" tab
   - Add all required environment variables from the `.env.local` example above
   - Ensure NODE_ENV is set to "production"
   - Update MONGO_URI to point to your production MongoDB instance
   - Set FRONTEND_URL to your frontend application's URL

4. **Deployment Settings**
   - Railway will automatically detect your Node.js application
   - It will use the settings from your `railway.json` file
   - The build command (`npm run build`) and start command (`npm start`) are configured

5. **Database Setup**
   - Add a MongoDB database from Railway's Add-ons
   - Use the provided MongoDB connection string in your MONGO_URI variable

6. **Monitor Deployment**
   - Railway will automatically deploy your application
   - You can monitor the build and deployment process in the "Deployments" tab

7. **Accessing Your API**
   - Once deployed, you can find your API URL in the "Settings" tab
   - Your API will be available at `https://your-project-name.railway.app`

8. **Custom Domain (Optional)**
   - In the "Settings" tab, you can add a custom domain to your Railway project
