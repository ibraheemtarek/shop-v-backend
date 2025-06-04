# Separate Image Upload Guide

## Overview

This guide explains how to use the new separate image upload functionality in the ShopVerse API. This approach allows you to:

1. First create/update a product with JSON data
2. Then upload images to that product in separate requests

## Benefits

- **Cleaner API Design**: Separates data concerns from file uploads
- **Easier Frontend Implementation**: Handle product data and image uploads as separate operations
- **Better Error Handling**: If image upload fails, the product data is still saved
- **Flexibility**: Update images without changing product data and vice versa

## How to Use the New Endpoints

### Step 1: Create/Update Product with JSON Data

First, create or update your product using a standard JSON request:

```http
POST {{baseUrl}}/api/products
Content-Type: application/json
Authorization: Bearer {{token}}

{
  "name": "New Smartphone",
  "description": "Latest smartphone with advanced features",
  "price": 799.99,
  "category": "60d21b4667d0d8992e610c85",
  "inStock": true,
  "isNewProduct": true
}
```

### Step 2: Upload Images Separately

After creating the product, you can upload images using the new endpoints:

#### For Main Product Image:
```http
POST {{baseUrl}}/api/products/{{productId}}/image
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

[Form Data]
image: [file]
```

#### For Additional Product Images:
```http
POST {{baseUrl}}/api/products/{{productId}}/images
Authorization: Bearer {{token}}
Content-Type: multipart/form-data

[Form Data]
images: [file1]
images: [file2]
...
```

### Step 3: Delete Images (If Needed)

You can also delete specific images:

```http
DELETE {{baseUrl}}/api/products/{{productId}}/image/main  // Delete main image
DELETE {{baseUrl}}/api/products/{{productId}}/image/0     // Delete first additional image
DELETE {{baseUrl}}/api/products/{{productId}}/image/1     // Delete second additional image
```

## Implementation Details

The backend now supports both approaches:

1. **Combined Approach**: Upload product data and images in a single request (original method)
2. **Separate Approach**: Upload product data first, then upload images separately (new method)

Both methods use local file storage in the `/uploads/products` directory and serve images via the `/uploads` route.

## Notes

- All images are stored locally in the `/uploads/products` directory
- Image URLs in API responses use the format `/uploads/products/{filename}`
- You must be authenticated as an admin to use these endpoints
- The original combined upload endpoints still work as before
