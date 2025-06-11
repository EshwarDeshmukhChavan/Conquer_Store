const express = require("express");
const router = express.Router();
const roleCheck = require("../middleware/roleCheck");
const { 
  getFilteredProducts, 
  getAllowedCategories, 
  getProductsByCategory, 
  getProductById 
} = require("../controllers/productController");

// Must be logged in with any role to get products
router.get("/filtered", roleCheck(["EPP", "SPP", "SEPP", "admin"]), getFilteredProducts);
router.get("/allowed-categories", roleCheck(["EPP", "SPP", "SEPP", "admin"]), getAllowedCategories);
router.get("/category/:category", roleCheck(["EPP", "SPP", "SEPP", "admin"]), getProductsByCategory);
router.get("/:id", roleCheck(["EPP", "SPP", "SEPP", "admin"]), getProductById);

module.exports = router;
