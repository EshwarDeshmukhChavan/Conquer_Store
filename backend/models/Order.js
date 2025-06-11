const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity must be at least 1"]
      },
      price: {
        type: Number,
        required: true,
        min: [0, "Price cannot be negative"]
      },
      discount: {
        type: Number,
        default: 0,
        min: [0, "Discount cannot be negative"],
        max: [100, "Discount cannot exceed 100%"]
      },
      size: {
        type: String,
        required: false,
        trim: true
      }
    }
  ],
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"]
  },
  address: {
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true
    },
    pincode: {
      type: String,
      required: [true, "PIN code is required"],
      trim: true,
      match: [/^\d{6}$/, "Please enter a valid 6-digit PIN code"]
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
    }
  },
  paymentId: {
    type: String,
    required: function() {
      return this.paymentMethod === 'online';
    },
    unique: true,
    sparse: true
  },
  orderId: {
    type: String,
    required: function() {
      return this.paymentMethod === 'online';
    },
    unique: true,
    sparse: true
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cod'],
    required: true,
    default: 'online'
  },
  status: {
    type: String,
    enum: {
      values: ["pending", "processing", "shipped", "delivered", "cancelled"],
      message: "{VALUE} is not a valid status"
    },
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ "products.productId": 1 });

// Virtual for formatted date
orderSchema.virtual("formattedDate").get(function() {
  return this.createdAt.toLocaleDateString();
});

// Pre-save middleware to validate total amount
orderSchema.pre("save", function(next) {
  const calculatedTotal = this.products.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const discount = (itemTotal * item.discount) / 100;
    return total + (itemTotal - discount);
  }, 0);

  if (Math.abs(calculatedTotal - this.amount) > 0.01) {
    next(new Error("Order amount does not match calculated total"));
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
