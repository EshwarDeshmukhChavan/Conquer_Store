const Product = require("../models/Product");
const Organization = require("../models/Organization");
const Discount = require("../models/Discount");

const getAllowedCategories = async (req, res) => {
  try {
    const user = req.user;
    const domain = user.email.split("@")[1];
    const org = await Organization.findOne({ domain });
    
    if (!org) {
      return res.json([]);
    }
    
    res.status(200).json(org.allowedCategories || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    const user = req.user;
    // Determine user domain => org => allowedCategories => fetch products
    const domain = user.email.split("@")[1];
    const org = await Organization.findOne({ domain });
    if (!org) {
      // fallback => no org => show default?
      return res.json([]);
    }
    const allowedCategories = org.allowedCategories || [];

    const products = await Product.find({ category: { $in: allowedCategories } });
    const orgDiscounts = await Discount.find({ orgId: org._id });

    // Map product => discount
    const discountMap = {};
    orgDiscounts.forEach(d => {
      discountMap[d.productId] = d.discountPercent;
    });

    const finalProducts = products.map(p => {
      const disc = discountMap[p._id] || 0;
      const discountedPrice = Math.round(p.price - (p.price * disc / 100));
      return { ...p._doc, discount: disc, discountedPrice };
    });

    res.status(200).json(finalProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// New endpoint to get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const user = req.user;
    
    // Determine user domain => org => check if category is allowed
    const domain = user.email.split("@")[1];
    const org = await Organization.findOne({ domain });
    
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    
    const allowedCategories = org.allowedCategories || [];
    
    // Check if the requested category is allowed for this user's organization
    if (!allowedCategories.includes(category)) {
      return res.status(403).json({ message: "Category not available for your organization" });
    }
    
    // Fetch products for the specific category
    const products = await Product.find({ category });
    
    // Apply discounts
    const orgDiscounts = await Discount.find({ orgId: org._id });
    const discountMap = {};
    orgDiscounts.forEach(d => {
      discountMap[d.productId] = d.discountPercent;
    });
    
    const finalProducts = products.map(p => {
      const disc = discountMap[p._id] || 0;
      const discountedPrice = Math.round(p.price - (p.price * disc / 100));
      return { ...p._doc, discount: disc, discountedPrice };
    });
    
    res.status(200).json(finalProducts);
  } catch (err) {
    console.error('Error in getProductsByCategory:', err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// New endpoint to get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;
    
    // Determine user domain => org
    const domain = user.email.split("@")[1];
    const org = await Organization.findOne({ domain });
    
    if (!org) {
      return res.status(404).json({ message: "Organization not found" });
    }
    
    // Find the product
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    
    // Check if the product's category is allowed for this user's organization
    const allowedCategories = org.allowedCategories || [];
    if (!allowedCategories.includes(product.category)) {
      return res.status(403).json({ message: "Product not available for your organization" });
    }
    
    // Apply discount if available
    const orgDiscount = await Discount.findOne({ 
      orgId: org._id,
      productId: product._id
    });
    
    const discount = orgDiscount ? orgDiscount.discountPercent : 0;
    const discountedPrice = Math.round(product.price - (product.price * discount / 100));
    
    // Return the product with discount info
    const finalProduct = { 
      ...product._doc, 
      discount, 
      discountedPrice 
    };
    
    res.status(200).json(finalProduct);
  } catch (err) {
    console.error('Error in getProductById:', err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

module.exports = { 
  getFilteredProducts, 
  getAllowedCategories, 
  getProductsByCategory,
  getProductById
};
