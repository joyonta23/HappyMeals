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

    const { restaurantName, contactName, phone, email, address, city } =
      req.body;
    const partnerId = `PARTNER-${Date.now()}`;
    const passwordHash = await hashPassword("demo123");

    const existingPartner = await Partner.findOne({ email });
    if (existingPartner) {
      return res
        .status(409)
        .json({ message: "A partner with this email already exists." });
    }

    const restaurant = await Restaurant.create({
      name: restaurantName,
      cuisine: "Mixed",
      city,
      address,
      phone,
      image: "",
    });

    const partner = await Partner.create({
      partnerId,
      email,
      passwordHash,
      ownerName: contactName,
      phone,
      address,
      city,
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

// Change partner password
const changePassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { currentPassword, newPassword } = req.body;
    const partnerId = req.user.partnerId; // From auth middleware

    console.log("Change password attempt for partnerId:", partnerId);
    console.log("req.user:", req.user);

    const partner = await Partner.findOne({ partnerId });
    if (!partner) {
      console.log("Partner not found:", partnerId);
      return res.status(404).json({ message: "Partner not found" });
    }

    const { comparePassword } = require("../utils/hash");
    const isPasswordValid = await comparePassword(
      currentPassword,
      partner.passwordHash
    );
    if (!isPasswordValid) {
      console.log("Current password invalid for partner:", partnerId);
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    console.log("Old password hash:", partner.passwordHash.substring(0, 20) + "...");
    const newPasswordHash = await hashPassword(newPassword);
    console.log("New password hash:", newPasswordHash.substring(0, 20) + "...");
    
    // Use findOneAndUpdate to bypass validation on unchanged fields
    const savedPartner = await Partner.findOneAndUpdate(
      { partnerId },
      { passwordHash: newPasswordHash },
      { new: true, runValidators: false }
    );
    
    console.log("Password changed successfully for partner:", partnerId);
    console.log("Saved password hash:", savedPartner.passwordHash.substring(0, 20) + "...");
    
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    next(err);
  }
};

module.exports = { registerPartner, changePassword };
