
/********************************************************
 * seed2.js
 * Usage: node seed2.js
 * This script:
 *   1) Connects to Mongo
 *   2) Maps certain image keys to real .jpg paths
 *   3) Reads each .jpg, converts to base64
 *   4) Finds the existing product by name, updates imageData
 ********************************************************/
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("./models/Product"); // your product model file

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/conquerstore";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
}).catch(err => {
  console.error("Mongo connect error:", err);
});

// Map product names → local file name
// (Feel free to tweak to match how your original data references images)
const imageMap = {
  "iPhone XR": "iphone.jpg",
  "iPhone 11": "iphone.jpg",
  "iPhone 11 Pro": "iphone.jpg",
  "iPhone 11 Pro Max": "iphone.jpg",
  "iPhone SE (2nd generation)": "iphone.jpg",
  "iPhone 12": "iphone.jpg",
  "iPhone 12 mini": "iphone.jpg",
  "iPhone 12 Pro": "iphone.jpg",
  "iPhone 12 Pro Max": "iphone.jpg",
  "iPhone 13": "iphone.jpg",
  "iPhone 13 mini": "iphone.jpg",
  "iPhone 13 Pro": "iphone.jpg",
  "iPhone 13 Pro Max": "iphone.jpg",
  "iPhone SE (3rd generation)": "iphone.jpg",
  "iPhone 14": "iphone.jpg",
  "iPhone 14 Plus": "iphone.jpg",
  "iPhone 14 Pro": "iphone.jpg",
  "iPhone 14 Pro Max": "iphone.jpg",
  "iPhone 15": "iphone.jpg",
  "iPhone 15 Plus": "iphone.jpg",
  "iPhone 15 Pro": "iphone.jpg",
  "iPhone 15 Pro Max": "iphone.jpg",
  "iPad 10th generation": "ipad.jpg",
  "iPad Air (5th generation)": "ipad.jpg",
  "iPad Pro 11-inch": "ipad.jpg",
  "iPad Pro 12.9-inch": "ipad.jpg",
  "iPad mini (6th generation)": "ipad.jpg",
  "MacBook Air M1": "macbook.jpg",
  "MacBook Air M2": "macbook.jpg",
  "MacBook Pro 14-inch": "macbook.jpg",
  "MacBook Pro 16-inch": "macbook.jpg",
  "iMac 24-inch": "apple vr.jpg",
  "Apple Watch Series 9": "apple-watch.jpg",
  "Apple Watch Ultra 2": "apple-watch2.jpg",
  "AirPods (3rd generation)": "appleairpods.jpg",
  "AirPods Pro (2nd generation)": "appleairpods2.jpg",
  "AirPods Max": "apple-headphones.jpg",
  "Apple TV 4K": "apple vr.jpg",
  "Apple Pencil (2nd generation)": "apple vr.jpg",
  "Magic Keyboard for iPad": "ipad2.jpg",
  "MagSafe Charger": "apple vr.jpg"
};

// Helper: read file → base64
function fileToBase64(filePath) {
  const buffer = fs.readFileSync(filePath);
  return buffer.toString("base64");
}

async function seedImages() {
  try {
    // We'll iterate over imageMap
    for (const [productName, fileName] of Object.entries(imageMap)) {
      // 1) Compute file path in backend/assets
      const fullPath = path.join(__dirname, "assets", fileName);
      if (!fs.existsSync(fullPath)) {
        console.warn(`File not found for ${productName}: ${fileName}`);
        continue;
      }

      // 2) Convert to base64
      const base64 = fileToBase64(fullPath);

      // 3) Find product by name, update imageData
      const product = await Product.findOne({ name: productName });
      if (!product) {
        console.warn(`Product not found in DB: ${productName}`);
        continue;
      }

      product.imageData = base64;
      await product.save();

      console.log(`Updated imageData for: ${productName}`);
    }
    console.log("Done updating images. Press Ctrl+C to exit.");
  } catch (err) {
    console.error("Error in seed2:", err);
  }
}

seedImages();
