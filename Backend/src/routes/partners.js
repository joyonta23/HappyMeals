const express = require("express");
const { body } = require("express-validator");
const { registerPartner, changePassword } = require("../controllers/partnerController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/register",
  [
    body("restaurantName").notEmpty(),
    body("contactName").notEmpty(),
    body("phone").notEmpty(),
    body("email").isEmail(),
    body("address").notEmpty(),
    body("city").notEmpty(),
  ],
  registerPartner
);

router.put(
  "/change-password",
  requireAuth("partner"),
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  changePassword
);

module.exports = router;
