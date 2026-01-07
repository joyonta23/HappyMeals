const express = require("express");
const { getAnalytics, getPopularDishes } = require("../controllers/analyticsController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Public endpoint for customers: top 5 popular dishes
router.get("/popular", getPopularDishes);

router.get("/:partnerId", requireAuth(["partner", "admin"]), getAnalytics);

module.exports = router;
