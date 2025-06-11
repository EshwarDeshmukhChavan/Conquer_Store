const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All cart routes require authentication
router.use(authenticateUser);

// Get user's cart
router.get('/', cartController.getCart);

// Add item to cart
router.post('/add', authenticateUser, cartController.addToCart);

// Update cart item quantity
router.put('/update', cartController.updateCartItem);

// Remove item from cart
router.delete('/remove/:productId', cartController.removeFromCart);

// Clear cart
router.delete('/clear', cartController.clearCart);

// Sync cart (for when user adds items while offline)
router.post('/sync', cartController.syncCart);

module.exports = router;