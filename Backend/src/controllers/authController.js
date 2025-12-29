const { validationResult } = require("express-validator");
const { hashPassword, comparePassword } = require("../utils/hash");
const { signToken } = require("../utils/tokens");
const User = require("../models/User");
const Partner = require("../models/Partner");

const customerSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, password } = req.body;
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: "customer",
    });
    const token = signToken({ userId: user.id, role: user.role });
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

const customerLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await comparePassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ userId: user.id, role: user.role });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    next(err);
  }
};

const partnerLogin = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { partnerId, password } = req.body;
    console.log("Partner login attempt:", { partnerId });

    const partner = await Partner.findOne({ partnerId }).populate("restaurant");
    if (!partner) {
      console.log("Partner not found in database:", partnerId);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(
      "Partner found:",
      partner.partnerId,
      "with email:",
      partner.email
    );
    console.log("Stored password hash:", partner.passwordHash.substring(0, 20) + "...");
    console.log("Attempting password:", password);
    
    const ok = await comparePassword(password, partner.passwordHash);
    if (!ok) {
      console.log("Password mismatch for partner:", partnerId);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("Password match successful for partner:", partnerId);

    const token = signToken({
      userId: partner.id,
      role: "partner",
      partnerId: partner.partnerId,
    });
    res.json({
      token,
      partner: {
        id: partner.id,
        partnerId: partner.partnerId,
        ownerName: partner.ownerName,
        email: partner.email,
        restaurant: partner.restaurant,
      },
    });
  } catch (err) {
    console.error("Partner login error:", err);
    next(err);
  }
};

const updateCustomerProfile = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { name, phone, line1, line2, city, country } = req.body;

    console.log("Received profile update:", {
      name,
      phone,
      line1,
      line2,
      city,
      country,
    });

    const updateData = { name, phone };

    // If address fields are provided, create/update the first address
    if (line1 || line2 || city || country) {
      updateData.addresses = [
        {
          line1: line1 || "",
          line2: line2 || "",
          city: city || "",
          country: country || "",
        },
      ];
      console.log("Setting addresses:", updateData.addresses);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Updated user addresses:", updatedUser.addresses);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        addresses: updatedUser.addresses,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  customerSignup,
  customerLogin,
  partnerLogin,
  updateCustomerProfile,
};
