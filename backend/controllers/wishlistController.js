const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let wishlist = await Wishlist.findOne({ user: userId }).populate('items');
    
    if (!wishlist) {
      // If no wishlist exists, create an empty one
      wishlist = new Wishlist({
        user: userId,
        items: []
      });
      await wishlist.save();
      // Return empty wishlist without trying to populate
      return res.status(200).json(wishlist);
    }
    
    return res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.body;
    
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find user's wishlist or create new one
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: []
      });
    }
    
    // Check if product already in wishlist
    if (!wishlist.items.includes(productId)) {
      wishlist.items.push(productId);
      await wishlist.save();
    }
    
    return res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Remove the item from wishlist
    wishlist.items = wishlist.items.filter(
      item => item.toString() !== productId
    );
    
    await wishlist.save();
    return res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    
    // Clear all items
    wishlist.items = [];
    await wishlist.save();
    
    return res.status(200).json({ message: 'Wishlist cleared successfully' });
  } catch (error) {
    console.error('Error clearing wishlist:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Sync wishlist (for when user adds items while offline)
exports.syncWishlist = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }
    
    // Find user's wishlist or create new one
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        items: []
      });
    }
    
    // Process each item from the client
    const productIds = [];
    
    for (const item of items) {
      // Validate required fields
      if (!item._id && !item.product) {
        continue; // Skip invalid items
      }
      
      // Find the product to ensure it exists
      const productId = item._id || item.product;
      const product = await Product.findById(productId);
      if (!product) {
        continue; // Skip if product no longer exists
      }
      
      productIds.push(productId);
    }
    
    // Replace wishlist items with processed items
    wishlist.items = productIds;
    await wishlist.save();
    
    return res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error syncing wishlist:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
