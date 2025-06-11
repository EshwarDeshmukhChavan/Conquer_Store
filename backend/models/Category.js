const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Pre-save hook to generate slug from name
categorySchema.pre('save', function(next) {
  if (this.name) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }
  next();
});

// Create the model first
const Category = mongoose.model('Category', categorySchema);

// Create default categories if they don't exist
const defaultCategories = [
  { name: "iphones", slug: "iphones", description: "Apple iPhones", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9" },
  { name: "mac", slug: "mac", description: "Apple Mac Computers", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853" },
  { name: "ipad", slug: "ipad", description: "Apple iPads", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0" },
  { name: "watch", slug: "watch", description: "Apple Watches", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12" },
  { name: "monitor", slug: "monitor", description: "Apple Monitors", image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf" }
];

// Initialize default categories
const initializeCategories = async () => {
  try {
    for (const category of defaultCategories) {
      // Check if category exists first
      const existingCategory = await Category.findOne({ name: category.name });
      
      if (!existingCategory) {
        // Only create if it doesn't exist
        await Category.create(category);
      }
    }
    console.log("Default categories initialized");
  } catch (error) {
    console.error("Error initializing categories:", error);
  }
};

// Call initialization when the model is first loaded
initializeCategories();

module.exports = Category;