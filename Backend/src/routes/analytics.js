const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/:partnerId", requireAuth(["partner", "admin"]), getAnalytics);

module.exports = router;
