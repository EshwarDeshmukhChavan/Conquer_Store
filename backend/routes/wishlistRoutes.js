const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authenticateUser } = require('../middleware/authMiddleware');

// All wishlist routes require authentication
router.use(authenticateUser);

// Get user's wishlist
router.get('/', wishlistController.getWishlist);

// Add item to wishlist
router.post('/add', wishlistController.addToWishlist);

// Remove item from wishlist
router.delete('/remove/:productId', wishlistController.removeFromWishlist);

// Clear wishlist
router.delete('/clear', wishlistController.clearWishlist);

// Sync wishlist (for when user adds items while offline)
router.post('/sync', wishlistController.syncWishlist);

module.exports = router;
