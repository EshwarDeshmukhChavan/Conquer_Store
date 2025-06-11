require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Create admin user with manual credentials
    const adminUser = new User({
      name: "Admin",
      email: "admin@admin.com",
      password: "admin123",
      role: "admin"
    });

    await adminUser.save();
    console.log("Admin user created successfully with credentials:");
    console.log("Email: admin@admin.com");
    console.log("Password: admin123");

  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

createAdminUser(); 