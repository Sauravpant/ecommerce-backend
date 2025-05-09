<h1 align="center" id="title">Ecommerce Backend</h1>

<p id="description">A robust and scalable backend for an e-commerce application built with Node.js Express.js and MongoDB. This project provides RESTful APIs for managing products users carts and orders incorporating features like authentication authorization and image uploads via Cloudinary.</p>

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   User Authentication & Authorization: Secure login and registration using JWT with role-based access control for admin and regular users.
*   Product Management: CRUD operations for products including image uploads to Cloudinary.
*   Cart Functionality: Add update and remove items from the shopping cart.
*   Order Processing: Place orders update order status and manage order history.
*   Admin Controls: Admin-specific routes for managing products and orders.
*   Error Handling: Centralized error management for consistent API responses.

<h2>🛠️ Installation Steps:</h2>

<p>1. Clone the repository</p>

```
git clone https://github.com/Sauravpant/ecommerce-backend.git
```

<p>2. Navigate to project folder</p>

```
cd ecommerce-backend 
```

```
cd server
```

<p>4. Install the dependencies</p>

```
npm install
```

<p>5. Create a .env file and add the following:</p>

```
MONGODB_URI=your_mongodb_connection_stringr
```

```
PORT=5000
```

```
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
```

```
CLOUDINARY_API_KEY=your_cloudinary_api_key
```

```
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret
```

```
ACCESS_TOKEN_SECRET=your_access_token_secret_key
```

```
REFRESH_TOKEN_SECRET=your_access_token_secret_key
```

<h2>🔌 API Endpoints</h2>

Here is a list of the key API endpoints available:

### User Routes

- `PATCH /update`: Update the user's profile details.
- `PATCH /profilepicture`: Update the user's profile picture.
- `GET /user`: Get the current user's profile.
- `DELETE /delete-account`: Delete the user's account.

### Product Routes

- `POST /add-item`: Add a new product (Admin only).
- `DELETE /delete-product/:productId`: Delete a product (Admin only).
- `PATCH /update-product/:productId`: Update product details (Admin only).
- `GET /get-all-products`: Get a list of all products.
- `GET /get-single-products/:productId`: Get details of a single product.
- `GET /get-filtered-products`: Get products with filtering.

### Order Routes

- `POST /create`: Create a new order (Authenticated users).
- `DELETE /cancel/:orderId`: Cancel an order (Authenticated users).
- `GET /user/:userId`: Get all orders for a user (Authenticated users).
- `PATCH /status/:orderId`: Update the order status (Admin only).
- `PATCH /deliver/:orderId`: Mark the order as delivered (Admin only).

### Cart Routes

- `POST /add/:productId`: Add a product to the cart (Authenticated users).
- `DELETE /delete`: Delete all items from the cart (Authenticated users).
- `DELETE /remove/:productId`: Remove a product from the cart (Authenticated users).
- `PATCH /decrement/:productId`: Decrement the quantity of a product in the cart (Authenticated users).
- `PATCH /increment/:productId`: Increment the quantity of a product in the cart (Authenticated users).

### Authentication Routes

- `POST /register-user`: Register a new user (Uploads profile picture).
- `POST /login`: Log in to the system.
- `GET /logout`: Log out the user.
- `PATCH /change-password`: Change the user's password.


  
<h2>💻 Built with</h2>

Technologies used in the project:

*   Backend: Node.js Express.js
*   Database: MongoDB with Mongoose ODM
*   Authentication: JWT (JSON Web Tokens)
*   File Uploads: Multer and Cloudinary