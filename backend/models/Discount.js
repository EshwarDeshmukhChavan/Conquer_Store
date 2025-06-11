const mongoose = require("mongoose");

const discountSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: "Organization", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  discountPercent: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Discount", discountSchema);
