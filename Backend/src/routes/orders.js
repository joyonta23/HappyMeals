const express = require("express");
const { body, param } = require("express-validator");
const {
  createOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
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

router.put(
  "/:orderId/status",
  requireAuth(["partner", "admin"]),
  [
    param("orderId").notEmpty().withMessage("Order ID is required"),
    body("status").notEmpty().withMessage("Status is required"),
  ],
  updateOrderStatus
);

module.exports = router;
