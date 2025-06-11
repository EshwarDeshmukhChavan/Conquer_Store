const mongoose = require("mongoose");

const segmentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Defines which roles can access this segment
  allowedRoles: [{ 
    type: String, 
    enum: ['admin', 'SEPP', 'EPP', 'SPP', 'user'],
    required: true 
  }],
  // Categories available to this segment
  allowedCategories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  }],
  // Organizations associated with this segment
  organizations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization'
  }],
  // Special discount percentage for this segment (if applicable)
  discountPercentage: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Segment", segmentSchema);