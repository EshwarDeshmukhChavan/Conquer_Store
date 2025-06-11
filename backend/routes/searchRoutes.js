const express = require("express");
const router = express.Router();
const roleCheck = require("../middleware/roleCheck");
const { searchProducts, compareProducts } = require("../controllers/searchController");

// Must be logged in to search or compare
router.get("/", roleCheck(["EPP", "SPP", "SEPP", "admin"]), searchProducts);
router.post("/compare", roleCheck(["EPP", "SPP", "SEPP", "admin"]), compareProducts);

module.exports = router;
