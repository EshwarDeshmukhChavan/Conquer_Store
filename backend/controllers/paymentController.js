const Razorpay = require("razorpay");
const Order = require("../models/Order");
const User = require("../models/User");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ 
      message: "Error creating order",
      error: error.message 
    });
  }
};

const saveOrder = async (req, res) => {
  try {
    const {
      userId,
      products,
      amount,
      address,
      paymentId,
      orderId,
      paymentMethod
    } = req.body;

    // Validate required fields
    if (!userId || !products || !amount || !address) {
      return res.status(400).json({ 
        message: "Missing required fields" 
      });
    }

    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        message: "Invalid products data" 
      });
    }

    // Validate payment method
    if (!paymentMethod || !['online', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({
        message: "Invalid payment method"
      });
    }

    // Validate payment details for online payment
    if (paymentMethod === 'online' && (!paymentId || !orderId)) {
      return res.status(400).json({
        message: "Payment ID and Order ID are required for online payment"
      });
    }

    // Create new order with appropriate fields based on payment method
    const orderData = {
      user: userId,
      products,
      amount,
      address,
      paymentMethod,
      status: "pending"
    };

    // Only add payment details for online payment
    if (paymentMethod === 'online') {
      orderData.paymentId = paymentId;
      orderData.orderId = orderId;
    }

    const order = new Order(orderData);

    // Save the order
    const savedOrder = await order.save();

    // Update user's order history
    await User.findByIdAndUpdate(
      userId,
      { $push: { orders: savedOrder._id } },
      { new: true }
    );

    // Return the populated order
    const populatedOrder = await Order.findById(savedOrder._id)
      .populate("products.productId");

    res.status(201).json({
      message: "Order saved successfully",
      order: populatedOrder
    });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ 
      message: "Error saving order",
      error: error.message 
    });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: "Order tracking failed", error: err });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.productId")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ 
      message: "Error fetching orders",
      error: error.message 
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate("products.productId")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if the order belongs to the user
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ 
      message: "Error fetching order details",
      error: error.message 
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { orderId } = req.params;

    if (!status || !["pending", "processing", "shipped", "delivered", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ 
      message: "Error updating order status",
      error: error.message 
    });
  }
};

module.exports = {
  createOrder,
  saveOrder,
  trackOrder,
  getUserOrders,
  getOrderDetails,
  updateOrderStatus
};
