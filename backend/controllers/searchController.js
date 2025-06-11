const Product = require("../models/Product");

const searchProducts = async (req, res) => {
  try {
    const { query } = req.query;
    const results = await Product.find({
      name: { $regex: query, $options: 'i' }
    });
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed", error: err });
  }
};

const compareProducts = async (req, res) => {
  try {
    const { ids } = req.body; // product IDs in array
    const products = await Product.find({ _id: { $in: ids } });
    res.status(200).json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Comparison failed", error: err });
  }
};

module.exports = { searchProducts, compareProducts };
