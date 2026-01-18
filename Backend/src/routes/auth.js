const express = require("express");
const { body } = require("express-validator");
const {
  customerSignup,
  customerLogin,
  partnerLogin,
  updateCustomerProfile,
  customerForgotPassword,
  customerResetPassword,
  partnerForgotPassword,
  partnerResetPassword,
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

// Password reset routes for customers
router.post(
  "/customer-forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  customerForgotPassword
);

router.post(
  "/customer-reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  customerResetPassword
);

// Password reset routes for partners
router.post(
  "/partner-forgot-password",
  [body("email").isEmail().withMessage("Valid email is required")],
  partnerForgotPassword
);

router.post(
  "/partner-reset-password",
  [
    body("token").notEmpty().withMessage("Reset token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  partnerResetPassword
);

module.exports = router;
