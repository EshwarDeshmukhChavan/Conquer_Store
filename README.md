# 🛍️ CONQUER_STORE

**Empowering Seamless Shopping Experiences for Everyone**

<div align="center">

![last-commit](https://img.shields.io/github/last-commit/EshwarDeshmukhChavan/Conquer_Store?style=flat&logo=git&logoColor=white&color=0080ff)
![repo-top-language](https://img.shields.io/github/languages/top/EshwarDeshmukhChavan/Conquer_Store?style=flat&color=0080ff)
![repo-language-count](https://img.shields.io/github/languages/count/EshwarDeshmukhChavan/Conquer_Store?style=flat&color=0080ff)

### 🛠️ Built With

![Express](https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-F04D35.svg?style=flat&logo=Mongoose&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB.svg?style=flat&logo=React&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF.svg?style=flat&logo=Vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06B6D4.svg?style=flat&logo=tailwindcss&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5.svg?style=flat&logo=Cloudinary&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-0C2451.svg?style=flat&logo=Razorpay&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&logo=Axios&logoColor=white)
![DotEnv](https://img.shields.io/badge/.ENV-ECD53F.svg?style=flat&logo=dotenv&logoColor=black)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A.svg?style=flat&logo=PostCSS&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735.svg?style=flat&logo=Autoprefixer&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white)
![Nodemon](https://img.shields.io/badge/Nodemon-76D04B.svg?style=flat&logo=Nodemon&logoColor=white)

</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Folder Structure](#folder-structure)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## 🧾 Overview

`Conquer_Store` is a robust full-stack e-commerce platform built using the MERN stack. It streamlines the online shopping experience for both customers and administrators by offering key functionalities such as user management, product listing, payments, image hosting, and real-time order processing.

---

## ✨ Features

- 🛒 **E-commerce Ready** — Add/remove/edit products, cart, checkout, orders.
- 👤 **Authentication** — Secure login/register with JWT and role-based access.
- 📦 **Admin Dashboard** — Manage inventory, orders, users, and discounts.
- 💳 **Payments** — Integrated Razorpay payment gateway.
- 🌁 **Image Upload** — Store images using Cloudinary.
- 📱 **Responsive UI** — Built with Tailwind CSS for mobile-first design.
- 🧠 **RESTful API** — Clean backend architecture for frontend communication.
- 🔐 **RBAC** — Role-Based Access Control for secure multi-user roles.

---

## 🚀 Technologies Used

**Frontend:**
- React
- Vite
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- Mongoose (MongoDB)
- Razorpay SDK
- Cloudinary SDK

**Others:**
- JWT Auth
- DotEnv
- Nodemon
- PostCSS
- Autoprefixer

---

## 🧰 Getting Started

### ✅ Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### 📥 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/EshwarDeshmukhChavan/Conquer_Store
cd Conquer_Store
npm install
```

## 🖥️ Usage

Start the backend and frontend development servers:

```bash
# Start Backend
cd backend
npm install
npm run dev

# Start Frontend
cd ../frontend
npm install
npm run dev
```

🧪 Testing
To run tests for the backend or frontend (if configured):

🔹 Backend Testing (using Jest or similar)
```bash
cd backend
npm test
```
🔹 Frontend Testing (if setup with React Testing Library / Jest)
```bash
cd frontend
npm test
```

## 📂 Folder Structure

```bash
Conquer_Store/
├── admin/                 # Admin dashboard (React + Express)
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── src/               # React components, pages, contexts
│   └── server.js          # Express server entry
├── backend/               # Main backend API
│   ├── controllers/       # Route logic
│   ├── models/            # Database schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Auth, role-checking
│   └── server.js          # Backend server entry
├── frontend/              # Customer-facing frontend (React)
│   ├── src/               # React app (components, pages, store)
│   └── index.html         # Main HTML template
├── .env                   # Environment variables
├── README.md              # Project documentation
└── package.json           # Project metadata and scripts

```
The project is organized into three main components:

1. Backend : Node.js/Express.js server with MongoDB database connection, API routes, controllers, and models
2. Frontend : React application with components, pages, and state management
3. Admin : Separate admin panel application for managing the store

## API Endpoints
### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/forgot-password - Request password reset
### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID
- GET /api/products/category/:category - Get products by category
### Cart
- GET /api/cart - Get user's cart
- POST /api/cart - Add item to cart
- PUT /api/cart/:itemId - Update cart item
- DELETE /api/cart/:itemId - Remove item from cart
- DELETE /api/cart - Clear cart
### Wishlist
- GET /api/wishlist - Get user's wishlist
- POST /api/wishlist - Add item to wishlist
- DELETE /api/wishlist/:itemId - Remove item from wishlist
### Payment
- POST /api/payment/create-order - Create Razorpay order
- POST /api/payment/save-order - Save order details
- GET /api/payment/orders - Get user's orders
- GET /api/payment/order/:orderId - Get order details
### Admin
- GET /api/admin/products - Get all products (admin)
- POST /api/admin/products - Add new product (admin)
- PUT /api/admin/products/:id - Update product (admin)
- DELETE /api/admin/products/:id - Delete product (admin)
- GET /api/admin/orders - Get all orders (admin)
- PUT /api/admin/orders/:id - Update order status (admin)
## Database Models
### User
- Email, password, name, role (user/admin)
### Product
- Name, description, price, discountedPrice, category, images, stock
### Category
- Name, slug, description, image
### Cart
- User reference, items array (product, quantity, price)
### Order
- User reference, products array, amount, address, payment details, status
### Wishlist
- User reference, products array
## Deployment
### Backend
1. Set up environment variables on your hosting platform
2. Build and deploy the Node.js application
### Frontend
1. Build the React application: npm run build
2. Deploy the build folder to your hosting service
## Contributing
1. Fork the repository
2. Create your feature branch: git checkout -b feature/amazing-feature
3. Commit your changes: git commit -m 'Add some amazing feature'
4. Push to the branch: git push origin feature/amazing-feature
5. Open a Pull Request
## License
This project is licensed under the ISC License

## Acknowledgements
- React
- Node.js
- Express
- MongoDB
- TailwindCSS
- Razorpay
- Cloudinary

