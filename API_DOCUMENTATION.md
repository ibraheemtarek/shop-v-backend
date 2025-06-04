# Shopverse Prime API Documentation

This document provides detailed information about the API endpoints available in the Shopverse Prime backend.

## Base URL

```
http://localhost:5000/api
```

When using the frontend application, the API is accessed through a proxy at `/api`.

## Authentication

Many endpoints require authentication. To authenticate, include the JWT token in the request headers:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

The token is obtained by logging in or registering a new user.

## Endpoints

### Authentication

#### Register a new user

- **URL**: `/users/register`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "token": "JWT_TOKEN"
  }
  ```

#### Login

- **URL**: `/users/login`
- **Method**: `POST`
- **Auth required**: No
- **Request body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user",
    "token": "JWT_TOKEN"
  }
  ```

### Users

#### Get user profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "user"
  }
  ```

#### Update user profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "password": "newpassword123" // Optional
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "user_id",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@example.com",
    "role": "user",
    "token": "NEW_JWT_TOKEN"
  }
  ```

### Products

#### Get all products

- **URL**: `/products`
- **Method**: `GET`
- **Auth required**: No
- **Query Parameters**:
  - `keyword`: Search term
  - `category`: Filter by category ID
  - `page`: Page number (default: 1)
  - `limit`: Number of products per page (default: 10)
  - `sort`: Sort field (default: 'createdAt')
- **Success Response**: `200 OK`
  ```json
  {
    "products": [
      {
        "_id": "product_id",
        "name": "Product Name",
        "description": "Product Description",
        "price": 99.99,
        "image": "/images/product.jpg",
        "category": "category_id",
        "countInStock": 10,
        "rating": 4.5,
        "numReviews": 12
      }
    ],
    "page": 1,
    "pages": 5,
    "total": 50
  }
  ```

#### Get product by ID

- **URL**: `/products/:id`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "product_id",
    "name": "Product Name",
    "description": "Product Description",
    "price": 99.99,
    "image": "/images/product.jpg",
    "category": {
      "_id": "category_id",
      "name": "Category Name"
    },
    "countInStock": 10,
    "rating": 4.5,
    "numReviews": 12,
    "reviews": [
      {
        "_id": "review_id",
        "user": "user_id",
        "name": "John Doe",
        "rating": 5,
        "comment": "Great product!",
        "createdAt": "2023-05-14T12:00:00.000Z"
      }
    ]
  }
  ```

#### Create a product (Admin only)

- **URL**: `/products`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request body**:
  ```json
  {
    "name": "New Product",
    "description": "Product Description",
    "price": 99.99,
    "image": "/images/product.jpg",
    "category": "category_id",
    "countInStock": 10
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "product_id",
    "name": "New Product",
    "description": "Product Description",
    "price": 99.99,
    "image": "/images/product.jpg",
    "category": "category_id",
    "countInStock": 10,
    "rating": 0,
    "numReviews": 0,
    "reviews": []
  }
  ```

#### Update a product (Admin only)

- **URL**: `/products/:id`
- **Method**: `PUT`
- **Auth required**: Yes (Admin)
- **Request body**:
  ```json
  {
    "name": "Updated Product",
    "description": "Updated Description",
    "price": 89.99,
    "image": "/images/updated-product.jpg",
    "category": "category_id",
    "countInStock": 15
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "product_id",
    "name": "Updated Product",
    "description": "Updated Description",
    "price": 89.99,
    "image": "/images/updated-product.jpg",
    "category": "category_id",
    "countInStock": 15,
    "rating": 4.5,
    "numReviews": 12
  }
  ```

#### Delete a product (Admin only)

- **URL**: `/products/:id`
- **Method**: `DELETE`
- **Auth required**: Yes (Admin)
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Product removed"
  }
  ```

### Categories

#### Get all categories

- **URL**: `/categories`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  [
    {
      "_id": "category_id",
      "name": "Category Name",
      "description": "Category Description",
      "image": "/images/category.jpg"
    }
  ]
  ```

#### Get category by ID

- **URL**: `/categories/:id`
- **Method**: `GET`
- **Auth required**: No
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "category_id",
    "name": "Category Name",
    "description": "Category Description",
    "image": "/images/category.jpg"
  }
  ```

#### Create a category (Admin only)

- **URL**: `/categories`
- **Method**: `POST`
- **Auth required**: Yes (Admin)
- **Request body**:
  ```json
  {
    "name": "New Category",
    "description": "Category Description",
    "image": "/images/category.jpg"
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "category_id",
    "name": "New Category",
    "description": "Category Description",
    "image": "/images/category.jpg"
  }
  ```

### Orders

#### Create an order

- **URL**: `/orders`
- **Method**: `POST`
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "orderItems": [
      {
        "product": "product_id",
        "name": "Product Name",
        "image": "/images/product.jpg",
        "price": 99.99,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02115",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 199.98,
    "taxPrice": 20.00,
    "shippingPrice": 10.00,
    "totalPrice": 229.98
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "_id": "order_id",
    "user": "user_id",
    "orderItems": [
      {
        "product": "product_id",
        "name": "Product Name",
        "image": "/images/product.jpg",
        "price": 99.99,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02115",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 199.98,
    "taxPrice": 20.00,
    "shippingPrice": 10.00,
    "totalPrice": 229.98,
    "isPaid": false,
    "isDelivered": false,
    "orderNumber": "ORD123456",
    "createdAt": "2023-05-14T12:00:00.000Z"
  }
  ```

#### Get user orders

- **URL**: `/orders/myorders`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  [
    {
      "_id": "order_id",
      "orderNumber": "ORD123456",
      "totalPrice": 229.98,
      "isPaid": false,
      "isDelivered": false,
      "createdAt": "2023-05-14T12:00:00.000Z"
    }
  ]
  ```

#### Get order by ID

- **URL**: `/orders/:id`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "order_id",
    "user": {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "orderItems": [
      {
        "product": "product_id",
        "name": "Product Name",
        "image": "/images/product.jpg",
        "price": 99.99,
        "quantity": 2
      }
    ],
    "shippingAddress": {
      "address": "123 Main St",
      "city": "Boston",
      "postalCode": "02115",
      "country": "USA"
    },
    "paymentMethod": "PayPal",
    "itemsPrice": 199.98,
    "taxPrice": 20.00,
    "shippingPrice": 10.00,
    "totalPrice": 229.98,
    "isPaid": false,
    "isDelivered": false,
    "orderNumber": "ORD123456",
    "createdAt": "2023-05-14T12:00:00.000Z"
  }
  ```

### Cart

#### Get user cart

- **URL**: `/cart`
- **Method**: `GET`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "image": "/images/product.jpg",
          "price": 99.99,
          "countInStock": 10
        },
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalItems": 2,
    "totalPrice": 199.98
  }
  ```

#### Add item to cart

- **URL**: `/cart`
- **Method**: `POST`
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "productId": "product_id",
    "quantity": 2
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "image": "/images/product.jpg",
          "price": 99.99,
          "countInStock": 10
        },
        "quantity": 2,
        "price": 99.99
      }
    ],
    "totalItems": 2,
    "totalPrice": 199.98
  }
  ```

#### Update cart item

- **URL**: `/cart/:productId`
- **Method**: `PUT`
- **Auth required**: Yes
- **Request body**:
  ```json
  {
    "quantity": 3
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "cart_id",
    "user": "user_id",
    "items": [
      {
        "product": {
          "_id": "product_id",
          "name": "Product Name",
          "image": "/images/product.jpg",
          "price": 99.99,
          "countInStock": 10
        },
        "quantity": 3,
        "price": 99.99
      }
    ],
    "totalItems": 3,
    "totalPrice": 299.97
  }
  ```

#### Remove item from cart

- **URL**: `/cart/:productId`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "cart_id",
    "user": "user_id",
    "items": [],
    "totalItems": 0,
    "totalPrice": 0
  }
  ```

#### Clear cart

- **URL**: `/cart`
- **Method**: `DELETE`
- **Auth required**: Yes
- **Success Response**: `200 OK`
  ```json
  {
    "_id": "cart_id",
    "user": "user_id",
    "items": [],
    "totalItems": 0,
    "totalPrice": 0
  }
  ```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

```json
{
  "message": "Invalid request data"
}
```

### 401 Unauthorized

```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden

```json
{
  "message": "Not authorized as an admin"
}
```

### 404 Not Found

```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "message": "Server error"
}
```
