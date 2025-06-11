const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  }
}, {
  timestamps: true
});

// Create indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });

const Category = mongoose.model('Category', categorySchema);

// Initialize default categories
const initializeCategories = async () => {
  try {
    const defaultCategories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and accessories'
      },
      {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel'
      },
      {
        name: 'Books',
        slug: 'books',
        description: 'Books and publications'
      }
    ];

    for (const category of defaultCategories) {
      await Category.findOneAndUpdate(
        { slug: category.slug },
        category,
        { upsert: true, new: true }
      );
    }

    console.log('Default categories initialized successfully');
  } catch (error) {
    console.error('Error initializing categories:', error);
  }
};

// Call initialization
initializeCategories();

module.exports = Category; 