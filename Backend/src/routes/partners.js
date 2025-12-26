const express = require("express");
const { body } = require("express-validator");
const { registerPartner } = require("../controllers/partnerController");

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

module.exports = router;
