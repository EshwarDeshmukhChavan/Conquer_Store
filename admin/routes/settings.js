const express = require('express');
const router = express.Router();

// Get settings
router.get('/', async (req, res) => {
  try {
    // In a real application, you would fetch this from a database
    const settings = {
      storeName: 'Conquer Store',
      storeEmail: 'admin@conquerstore.com',
      storePhone: '+1234567890',
      storeAddress: '123 Store Street, City, Country',
      currency: 'USD',
      taxRate: 10
    };
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update settings
router.put('/', async (req, res) => {
  try {
    // In a real application, you would save this to a database
    const settings = req.body;
    res.json(settings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 