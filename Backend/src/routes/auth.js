const express = require("express");
const { body } = require("express-validator");
const {
  customerSignup,
  customerLogin,
  partnerLogin,
  updateCustomerProfile,
} = require("../controllers/authController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.post(
  "/customer-signup",
  [
    body("name").notEmpty(),
    body("email").isEmail(),
    body("phone").notEmpty(),
    body("password").isLength({ min: 6 }),
  ],
  customerSignup
);

router.post(
  "/customer-login",
  [body("email").isEmail(), body("password").notEmpty()],
  customerLogin
);

router.post(
  "/partner-login",
  [body("partnerId").notEmpty(), body("password").notEmpty()],
  partnerLogin
);

router.put("/customer-profile", requireAuth(), updateCustomerProfile);

module.exports = router;
