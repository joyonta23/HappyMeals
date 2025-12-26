const { validationResult } = require("express-validator");
const { hashPassword } = require("../utils/hash");
const Partner = require("../models/Partner");
const Restaurant = require("../models/Restaurant");

// Creates a partner lead and basic restaurant record
const registerPartner = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { restaurantName, contactName, phone, email, address, city } = req.body;
    const partnerId = `PARTNER-${Date.now()}`;
    const passwordHash = await hashPassword("demo123");

    const restaurant = await Restaurant.create({ name: restaurantName, cuisine: "Mixed", city, image: "" });

    const partner = await Partner.create({
      partnerId,
      email,
      passwordHash,
      ownerName: contactName,
      restaurant: restaurant.id,
    });

    res.status(201).json({
      message: "Partner registered",
      partnerId: partner.partnerId,
      tempPassword: "demo123",
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { registerPartner };
