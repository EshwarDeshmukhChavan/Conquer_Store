const mongoose = require("mongoose");

const organizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  allowedCategories: [{ type: String }] // e.g. ['Laptop', 'Phone']
}, { timestamps: true });

module.exports = mongoose.model("Organization", organizationSchema);
