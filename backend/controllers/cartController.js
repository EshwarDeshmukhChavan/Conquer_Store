const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      // If no cart exists, create an empty one
      cart = new Cart({
        user: userId,
        items: []
      });
      await cart.save();
    }
    
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add item to cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity = 1, size } = req.body;
    
    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Find user's cart or create new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }
    
    // Check if product already in cart with the same size
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
              (!size || item.size === size)
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Get primary image (either from images array or imageData)
      const primaryImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : product.imageData;
      
      // Add new item to cart
      cart.items.push({
        product: productId,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        quantity,
        size: size || null,
        image: primaryImage,
        imageData: product.imageData,
        description: product.description
      });
    }
    
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, size } = req.body;
    
    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Find the item in the cart (considering size if provided)
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && 
              (!size || item.size === size)
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error updating cart item:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { size } = req.query; // Get size from query params if provided
    
    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Remove the item from cart (considering size if provided)
    if (size) {
      cart.items = cart.items.filter(
        item => !(item.product.toString() === productId && item.size === size)
      );
    } else {
      cart.items = cart.items.filter(
        item => item.product.toString() !== productId
      );
    }
    
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error removing from cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find user's cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    
    // Clear all items
    cart.items = [];
    await cart.save();
    
    return res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Sync cart (for when user adds items while offline)
exports.syncCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;
    
    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Items must be an array' });
    }
    
    // Find user's cart or create new one
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: []
      });
    }
    
    // Process each item from the client
    const processedItems = [];
    
    for (const item of items) {
      // Validate required fields
      if (!item._id && !item.product) {
        continue; // Skip invalid items
      }
      
      // Find the product to ensure it exists and get latest data
      const productId = item._id || item.product;
      const product = await Product.findById(productId);
      if (!product) {
        continue; // Skip if product no longer exists
      }
      
      // Get primary image (either from images array or imageData)
      const primaryImage = product.images && product.images.length > 0 
        ? product.images[0] 
        : product.imageData;
      
      processedItems.push({
        product: productId,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice || product.price,
        quantity: item.quantity || 1,
        size: item.size || null,
        image: primaryImage,
        imageData: product.imageData,
        description: product.description
      });
    }
    
    // Replace cart items with processed items
    cart.items = processedItems;
    await cart.save();
    
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error syncing cart:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
