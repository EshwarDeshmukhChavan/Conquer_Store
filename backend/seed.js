/*****************************************************
 * seed.js
 * Usage: node seed.js
 * Requires: 
 *   - "mongoose" in package.json (npm install mongoose)
 *   - MONGO_URI in .env or replace with your connection string below
 *****************************************************/
require('dotenv').config();
const mongoose = require('mongoose');

// 1. Connect to Mongo
// If you have MONGO_URI in your .env, use process.env.MONGO_URI
// Otherwise, directly paste your connection string here.
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/conquerstore";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.error("Mongo connect error:", err));

// 2. Define Mongoose Schemas/Models if you don't already have them
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  image: [String],
  category: String,
  colors: [String],
  date: Number,
  bestseller: Boolean
});

const organizationSchema = new mongoose.Schema({
  name: String,
  domain: String,
  allowedCategories: [String]
});

const discountSchema = new mongoose.Schema({
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  discountPercent: Number
});

const Product = mongoose.model("Product", productSchema);
const Organization = mongoose.model("Organization", organizationSchema);
const Discount = mongoose.model("Discount", discountSchema);

// 3. Full product data from your question:
const productsData = [
  {
    id: 1,
    name: "iPhone XR",
    description: "iPhone XR - latest Apple device with amazing performance and elegant design.",
    price: 144805,
    image: ["iphone"],  // Typically "iphone" in 'assets'
    category: "iphones",
    colors: ["White", "Black", "Blue", "Yellow", "Coral", "(PRODUCT)RED"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 2,
    name: "iPhone 11",
    description: "iPhone 11 - latest Apple device with amazing performance and elegant design.",
    price: 156202,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black", "Green", "Yellow", "Purple", "White", "(PRODUCT)RED"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 3,
    name: "iPhone 11 Pro",
    description: "iPhone 11 Pro - latest Apple device with amazing performance and elegant design.",
    price: 149455,
    image: ["iphone"],
    category: "iphones",
    colors: ["Midnight Green", "Space Gray", "Silver", "Gold"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 4,
    name: "iPhone 11 Pro Max",
    description: "iPhone 11 Pro Max - latest Apple device with amazing performance and elegant design.",
    price: 102472,
    image: ["iphone"],
    category: "iphones",
    colors: ["Midnight Green", "Space Gray", "Silver", "Gold"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 5,
    name: "iPhone SE (2nd generation)",
    description: "iPhone SE (2nd generation) - latest Apple device with amazing performance and elegant design.",
    price: 98815,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black", "White", "(PRODUCT)RED"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 6,
    name: "iPhone 12",
    description: "iPhone 12 - latest Apple device with amazing performance and elegant design.",
    price: 122234,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black", "White", "(PRODUCT)RED", "Green", "Blue", "Purple"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 7,
    name: "iPhone 12 mini",
    description: "iPhone 12 mini - latest Apple device with amazing performance and elegant design.",
    price: 141934,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black", "White", "(PRODUCT)RED", "Green", "Blue", "Purple"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 8,
    name: "iPhone 12 Pro",
    description: "iPhone 12 Pro - latest Apple device with amazing performance and elegant design.",
    price: 87892,
    image: ["iphone"],
    category: "iphones",
    colors: ["Silver", "Graphite", "Gold", "Pacific Blue"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 9,
    name: "iPhone 12 Pro Max",
    description: "iPhone 12 Pro Max - latest Apple device with amazing performance and elegant design.",
    price: 85070,
    image: ["iphone"],
    category: "iphones",
    colors: ["Silver", "Graphite", "Gold", "Pacific Blue"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 10,
    name: "iPhone 13",
    description: "iPhone 13 - latest Apple device with amazing performance and elegant design.",
    price: 125699,
    image: ["iphone"],
    category: "iphones",
    colors: ["Pink", "Blue", "Midnight", "Starlight", "(PRODUCT)RED", "Green"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 11,
    name: "iPhone 13 mini",
    description: "iPhone 13 mini - latest Apple device with amazing performance and elegant design.",
    price: 153113,
    image: ["iphone"],
    category: "iphones",
    colors: ["Pink", "Blue", "Midnight", "Starlight", "(PRODUCT)RED", "Green"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 12,
    name: "iPhone 13 Pro",
    description: "iPhone 13 Pro - latest Apple device with amazing performance and elegant design.",
    price: 155343,
    image: ["iphone"],
    category: "iphones",
    colors: ["Sierra Blue", "Silver", "Gold", "Graphite", "Alpine Green"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 13,
    name: "iPhone 13 Pro Max",
    description: "iPhone 13 Pro Max - latest Apple device with amazing performance and elegant design.",
    price: 98752,
    image: ["iphone"],
    category: "iphones",
    colors: ["Sierra Blue", "Silver", "Gold", "Graphite", "Alpine Green"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 14,
    name: "iPhone SE (3rd generation)",
    description: "iPhone SE (3rd generation) - latest Apple device with amazing performance and elegant design.",
    price: 103930,
    image: ["iphone"],
    category: "iphones",
    colors: ["Midnight", "Starlight", "(PRODUCT)RED"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 15,
    name: "iPhone 14",
    description: "iPhone 14 - latest Apple device with amazing performance and elegant design.",
    price: 109505,
    image: ["iphone"],
    category: "iphones",
    colors: ["Midnight", "Starlight", "Blue", "Purple", "(PRODUCT)RED", "Yellow"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 16,
    name: "iPhone 14 Plus",
    description: "iPhone 14 Plus - latest Apple device with amazing performance and elegant design.",
    price: 128760,
    image: ["iphone"],
    category: "iphones",
    colors: ["Midnight", "Starlight", "Blue", "Purple", "(PRODUCT)RED", "Yellow"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 17,
    name: "iPhone 14 Pro",
    description: "iPhone 14 Pro - latest Apple device with amazing performance and elegant design.",
    price: 81287,
    image: ["iphone"],
    category: "iphones",
    colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 18,
    name: "iPhone 14 Pro Max",
    description: "iPhone 14 Pro Max - latest Apple device with amazing performance and elegant design.",
    price: 63452,
    image: ["iphone"],
    category: "iphones",
    colors: ["Space Black", "Silver", "Gold", "Deep Purple"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 19,
    name: "iPhone 15",
    description: "iPhone 15 - latest Apple device with amazing performance and elegant design.",
    price: 71947,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 20,
    name: "iPhone 15 Plus",
    description: "iPhone 15 Plus - latest Apple device with amazing performance and elegant design.",
    price: 131635,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black", "Blue", "Green", "Yellow", "Pink"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 21,
    name: "iPhone 15 Pro",
    description: "iPhone 15 Pro - latest Apple device with amazing performance and elegant design.",
    price: 120216,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black Titanium", "White Titanium", "Blue Titanium", "Natural Titanium"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 22,
    name: "iPhone 15 Pro Max",
    description: "iPhone 15 Pro Max - latest Apple device with amazing performance and elegant design.",
    price: 109291,
    image: ["iphone"],
    category: "iphones",
    colors: ["Black Titanium", "White Titanium", "Blue Titanium", "Natural Titanium"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 23,
    name: "iPad 10th generation",
    description: "iPad 10th generation - latest Apple device with amazing performance and elegant design.",
    price: 63347,
    image: ["ipad","ipad2"],
    category: "ipads",
    colors: ["Blue", "Pink", "Yellow", "Silver"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 24,
    name: "iPad Air (5th generation)",
    description: "iPad Air (5th generation) - latest Apple device with amazing performance and elegant design.",
    price: 143335,
    image: ["ipad","ipad2"],
    category: "ipads",
    colors: ["Space Gray", "Starlight", "Pink", "Purple", "Blue"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 25,
    name: "iPad Pro 11-inch",
    description: "iPad Pro 11-inch - latest Apple device with amazing performance and elegant design.",
    price: 118057,
    image: ["ipad","ipad2"],
    category: "ipads",
    colors: ["Silver", "Space Gray"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 26,
    name: "iPad Pro 12.9-inch",
    description: "iPad Pro 12.9-inch - latest Apple device with amazing performance and elegant design.",
    price: 80532,
    image: ["ipad","ipad2"],
    category: "ipads",
    colors: ["Silver", "Space Gray"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 27,
    name: "iPad mini (6th generation)",
    description: "iPad mini (6th generation) - latest Apple device with amazing performance and elegant design.",
    price: 50958,
    image: ["ipad","ipad2"],
    category: "ipads",
    colors: ["Space Gray", "Pink", "Purple", "Starlight"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 28,
    name: "MacBook Air M1",
    description: "MacBook Air M1 - latest Apple device with amazing performance and elegant design.",
    price: 48350,
    image: ["macbook","macbook2"],
    category: "mac",
    colors: ["Silver", "Space Gray", "Gold"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 29,
    name: "MacBook Air M2",
    description: "MacBook Air M2 - latest Apple device with amazing performance and elegant design.",
    price: 151424,
    image: ["macbook","macbook2"],
    category: "mac",
    colors: ["Midnight", "Starlight", "Silver", "Space Gray"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 30,
    name: "MacBook Pro 14-inch",
    description: "MacBook Pro 14-inch - latest Apple device with amazing performance and elegant design.",
    price: 93686,
    image: ["macbook","macbook2"],
    category: "mac",
    colors: ["Silver", "Space Gray"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 31,
    name: "MacBook Pro 16-inch",
    description: "MacBook Pro 16-inch - latest Apple device with amazing performance and elegant design.",
    price: 102667,
    image: ["macbook","macbook2"],
    category: "mac",
    colors: ["Silver", "Space Gray"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 32,
    name: "iMac 24-inch",
    description: "iMac 24-inch - latest Apple device with amazing performance and elegant design.",
    price: 128796,
    image: ["appleVR"],
    category: "monitors",
    colors: ["Blue", "Green", "Pink", "Silver", "Yellow", "Orange", "Purple"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 33,
    name: "Apple Watch Series 9",
    description: "Apple Watch Series 9 - latest Apple device with amazing performance and elegant design.",
    price: 75411,
    image: ["appleWatch","appleWatch2"],
    category: "watch",
    colors: ["Midnight", "Starlight", "Silver", "Red", "Blue"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 34,
    name: "Apple Watch Ultra 2",
    description: "Apple Watch Ultra 2 - latest Apple device with amazing performance and elegant design.",
    price: 44421,
    image: ["appleWatch","appleWatch2"],
    category: "watch",
    colors: ["Titanium"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 35,
    name: "AirPods (3rd generation)",
    description: "AirPods (3rd generation) - latest Apple device with amazing performance and elegant design.",
    price: 117649,
    image: ["appleAirpods","appleAirpods2","appleHeadphones"],
    category: "airpods",
    colors: ["White"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 36,
    name: "AirPods Pro (2nd generation)",
    description: "AirPods Pro (2nd generation) - latest Apple device with amazing performance and elegant design.",
    price: 67271,
    image: ["appleAirpods","appleAirpods2","appleHeadphones"],
    category: "airpods",
    colors: ["White"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 37,
    name: "AirPods Max",
    description: "AirPods Max - latest Apple device with amazing performance and elegant design.",
    price: 88100,
    image: ["appleAirpods","appleAirpods2","appleHeadphones"],
    category: "airpods",
    colors: ["Space Gray", "Silver", "Green", "Sky Blue", "Pink"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 38,
    name: "Apple TV 4K",
    description: "Apple TV 4K - latest Apple device with amazing performance and elegant design.",
    price: 151024,
    image: ["appleVR"],
    category: "monitors",
    colors: ["Black"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 39,
    name: "Apple Pencil (2nd generation)",
    description: "Apple Pencil (2nd generation) - latest Apple device with amazing performance and elegant design.",
    price: 141997,
    image: ["appleVR"],
    category: "accessories",
    colors: ["White"],
    date: 1743249341,
    bestseller: true
  },
  {
    id: 40,
    name: "Magic Keyboard for iPad",
    description: "Magic Keyboard for iPad - latest Apple device with amazing performance and elegant design.",
    price: 83486,
    image: ["ipad","ipad2"],
    category: "ipads",
    colors: ["White", "Black"],
    date: 1743249341,
    bestseller: false
  },
  {
    id: 41,
    name: "MagSafe Charger",
    description: "MagSafe Charger - latest Apple device with amazing performance and elegant design.",
    price: 57398,
    image: ["appleVR"],
    category: "accessories",
    colors: ["White"],
    date: 1743249341,
    bestseller: false
  }
];

// 4. Sample organizations for EPP & SPP
const orgsData = [
  {
    name: "Gitam University",
    domain: "gitam.edu",     // SPP
    allowedCategories: ["iphones", "ipads", "mac", "watch"] 
  },
  {
    name: "TCS Company",
    domain: "tcs.com",       // EPP
    allowedCategories: ["iphones", "mac"]  
  },
  {
    name: "Amazon",
    domain: "amazon.com",
    allowedCategories: ["iphones", "mac", "airpods", "watch", "ipads"]
  }
  
];

// We'll insert the entire product list to the DB, then create a few sample discount docs
// referencing some of those newly inserted products.

// 5. Main seeding function
async function seedData() {
  try {
    // Clear existing data to avoid duplicates
    await Product.deleteMany({});
    await Organization.deleteMany({});
    await Discount.deleteMany({});

    console.log("Old data cleared.");

    // Insert products
    const insertedProducts = await Product.insertMany(productsData.map(p => ({
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.image,      // array of strings, e.g. ["iphone"]
      category: p.category,
      colors: p.colors,
      date: p.date,
      bestseller: p.bestseller
    })));
    console.log(`Inserted ${insertedProducts.length} products.`);

    // Insert organizations
    const insertedOrgs = await Organization.insertMany(orgsData);
    console.log(`Inserted ${insertedOrgs.length} organizations.`);

    // Let's pick a couple products for discounts:
    // e.g. first product for Gitam, second product for TCS.
    // In real scenario you'd do some dynamic or more coverage.

    const iphoneXR = insertedProducts.find(p => p.name === "iPhone XR");
    const iphone11 = insertedProducts.find(p => p.name === "iPhone 11");
    
    const gitam = insertedOrgs.find(o => o.domain === "gitam.edu");
    const tcs   = insertedOrgs.find(o => o.domain === "tcs.com");

    if (iphoneXR && gitam) {
      await Discount.create({
        orgId: gitam._id,
        productId: iphoneXR._id,
        discountPercent: 10   // 10% discount for Gitam
      });
    }
    if (iphone11 && tcs) {
      await Discount.create({
        orgId: tcs._id,
        productId: iphone11._id,
        discountPercent: 15   // 15% discount for TCS
      });
    }

    console.log("Discounts created for sample items.");

    console.log("Seeding complete! Press Ctrl+C to exit.");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

// Run the seeding
seedData();
