const express = require("express");
const router = express.Router();
const roleCheck = require("../middleware/roleCheck");
const { 
  addOrganization, 
  setDiscount, 
  getCategoryPerformance,
  getOrders,
  getProducts,
  getUsers,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/adminController");
const { login } = require("../controllers/authController");
const mongoose = require('mongoose');
const { authenticateUser } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Public routes
router.post("/login", login);

// Protected admin routes
router.use(authenticateUser);
router.use(roleCheck(["admin"]));

// Test MongoDB connection
router.get("/test-connection", async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: 'success',
      connectionState: states[state],
      isConnected: state === 1,
      database: mongoose.connection.name,
      host: mongoose.connection.host
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Data fetching routes
router.get("/products", getProducts);
router.get("/categories", getCategories);
router.get("/orders", getOrders);
router.get("/users", getUsers);

// Product management routes
router.post("/products", upload.array('images', 5), addProduct);
router.put("/products/:id", upload.array('images', 5), updateProduct);
router.delete("/products/:id", deleteProduct);

// Organization and discount routes
router.post("/org", addOrganization);
router.post("/discount", setDiscount);
router.get("/category-performance", getCategoryPerformance);

module.exports = router;
