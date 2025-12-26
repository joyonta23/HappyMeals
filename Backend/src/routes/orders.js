const express = require("express");
const { body } = require("express-validator");
const { createOrder } = require("../controllers/orderController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/",
  requireAuth(["customer", "partner", "admin"]),
  [
    body("restaurantId").notEmpty(),
    body("items").isArray({ min: 1 }),
    body("totals.subtotal").isNumeric(),
    body("totals.deliveryFee").isNumeric(),
    body("totals.total").isNumeric(),
    body("address").notEmpty(),
  ],
  createOrder
);

module.exports = router;
