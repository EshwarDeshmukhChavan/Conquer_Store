const express = require('express');
const router = express.Router();
const { authenticateUser: protect, isAdmin: admin } = require('../middleware/authMiddleware');
const {
  createOrder,
  saveOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus
} = require('../controllers/paymentController');

// Validate request body middleware
const validateOrderRequest = (req, res, next) => {
  const { amount } = req.body;
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }
  next();
};

// Create Razorpay order
router.post('/create', protect, validateOrderRequest, createOrder);

// Save order after successful payment
router.post('/save', protect, saveOrder);

// Get user's orders
router.get('/orders', protect, getUserOrders);

// Get specific order details
router.get('/orders/:orderId', protect, getOrderDetails);

// Update order status (admin only)
router.put('/orders/:orderId/status', protect, admin, updateOrderStatus);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;
