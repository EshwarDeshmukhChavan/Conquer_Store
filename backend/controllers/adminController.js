const Organization = require("../models/Organization");
const Discount = require("../models/Discount");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const Category = require("../models/Category");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { cloudinary } = require('../config/cloudinary');

const addOrganization = async (req, res) => {
  try {
    const { name, domain, allowedCategories } = req.body;
    const org = new Organization({ name, domain, allowedCategories });
    await org.save();
    res.status(201).json(org);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add organization", error: err });
  }
};

const setDiscount = async (req, res) => {
  try {
    const { orgId, productId, discountPercent } = req.body;
    let discount = await Discount.findOne({ orgId, productId });
    if (discount) {
      discount.discountPercent = discountPercent;
      await discount.save();
      return res.status(200).json(discount);
    }
    discount = new Discount({ orgId, productId, discountPercent });
    await discount.save();
    res.status(201).json(discount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to set discount", error: err });
  }
};

const getCategoryPerformance = async (req, res) => {
  try {
    // Aggregate orders to get category performance
    const categoryPerformance = await Order.aggregate([
      {
        $unwind: "$products"
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      {
        $unwind: "$productDetails"
      },
      {
        $group: {
          _id: "$productDetails.category",
          totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
          totalOrders: { $sum: 1 },
          totalItems: { $sum: "$products.quantity" }
        }
      },
      {
        $project: {
          category: "$_id",
          totalSales: 1,
          totalOrders: 1,
          totalItems: 1,
          _id: 0
        }
      },
      {
        $sort: { totalSales: -1 }
      }
    ]);

    res.json(categoryPerformance);
  } catch (error) {
    console.error("Error fetching category performance:", error);
    res.status(500).json({ message: "Error fetching category performance data" });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.productId', 'name price')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders" });
  }
};

// Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password') // Exclude password from response
      .sort({ createdAt: -1 });
    
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get a single product
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error in getProduct:', error);
    res.status(500).json({ message: error.message });
  }
};

// Add new product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, quantity, colors, bestseller } = req.body;
    
    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      quantity,
      colors: colors ? JSON.parse(colors) : [],
      bestseller: bestseller === 'true',
      images
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, stock, quantity, colors, bestseller } = req.body;
    
    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path);
    }

    const updateData = {
      name,
      description,
      price,
      category,
      stock,
      quantity,
      colors: colors ? JSON.parse(colors) : [],
      bestseller: bestseller === 'true'
    };

    if (images.length > 0) {
      updateData.images = images;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const imageUrl of product.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Add new category
const addCategory = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error('Error in addCategory:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error in updateCategory:', error);
    res.status(400).json({ message: error.message });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCategory:', error);
    res.status(500).json({ message: error.message });
  }
};

// Auth controllers
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrganization,
  setDiscount,
  getCategoryPerformance,
  getOrders,
  getProducts,
  getUsers,
  getCategories,
  addProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  addCategory,
  updateCategory,
  deleteCategory,
  login
};
