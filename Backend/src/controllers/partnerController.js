const { validationResult } = require("express-validator");
const { hashPassword } = require("../utils/hash");
const Partner = require("../models/Partner");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

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

    // Handle restaurant image upload
    let restaurantImage =
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop";
    if (req.file) {
      const basePath = `${req.protocol}://${req.get("host")}`;
      restaurantImage = `${basePath}/uploads/${req.file.filename}`;
      console.log("Restaurant image uploaded:", restaurantImage);
    }

    const restaurant = await Restaurant.create({
      name: restaurantName,
      cuisine: "Mixed",
      city,
      address,
      phone,
      image: restaurantImage,
      isActive: true,
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

    console.log(
      "Old password hash:",
      partner.passwordHash.substring(0, 20) + "..."
    );
    const newPasswordHash = await hashPassword(newPassword);
    console.log("New password hash:", newPasswordHash.substring(0, 20) + "...");

    // Use findOneAndUpdate to bypass validation on unchanged fields
    const savedPartner = await Partner.findOneAndUpdate(
      { partnerId },
      { passwordHash: newPasswordHash },
      { new: true, runValidators: false }
    );

    console.log("Password changed successfully for partner:", partnerId);
    console.log(
      "Saved password hash:",
      savedPartner.passwordHash.substring(0, 20) + "..."
    );

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Change password error:", err);
    next(err);
  }
};

// Partner adds a menu item with optional image upload
const addMenuItem = async (req, res, next) => {
  try {
    console.log("=== ADD MENU ITEM BACKEND ===");
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    console.log("User from token:", req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const partnerId = req.user?.partnerId;
    if (!partnerId) {
      console.log("No partnerId found in token");
      return res.status(401).json({ message: "Unauthorized" });
    }

    console.log("Looking for partner with partnerId:", partnerId);
    const partner = await Partner.findOne({ partnerId }).populate("restaurant");
    if (!partner || !partner.restaurant) {
      console.log("Partner or restaurant not found");
      return res
        .status(404)
        .json({ message: "Restaurant not found for partner" });
    }

    console.log(
      "Partner found:",
      partner.email,
      "Restaurant:",
      partner.restaurant.name
    );

    const {
      name,
      price,
      description,
      preparationTime,
      available = true,
      imageUrl,
      // Chatbot fields
      category,
      dietary,
      spiceLevel,
      allergens,
      isSide,
      popularityScore,
    } = req.body;

    // Prefer uploaded file, fall back to provided URL
    let image = imageUrl;
    if (req.file) {
      const basePath = `${req.protocol}://${req.get("host")}`;
      image = `${basePath}/uploads/${req.file.filename}`;
      console.log("File uploaded, image URL:", image);
    } else if (imageUrl) {
      console.log("Using provided image URL:", imageUrl);
    } else {
      console.log("No image provided");
    }

    // Parse dietary and allergens from JSON strings if necessary
    let parsedDietary = dietary;
    let parsedAllergens = allergens;

    if (typeof dietary === "string") {
      try {
        parsedDietary = JSON.parse(dietary);
      } catch (e) {
        parsedDietary = dietary ? [dietary] : ["non-vegetarian"];
      }
    }

    if (typeof allergens === "string") {
      try {
        parsedAllergens = JSON.parse(allergens);
      } catch (e) {
        parsedAllergens = allergens ? [allergens] : [];
      }
    }

    console.log("Creating menu item with:", {
      restaurant: partner.restaurant.id,
      name,
      price,
      description,
      image,
      available,
      preparationTime,
      // Chatbot fields
      category: category || "other",
      dietary: parsedDietary || ["non-vegetarian"],
      spiceLevel: spiceLevel || "medium",
      allergens: parsedAllergens || [],
      isSide: isSide || false,
      popularityScore: popularityScore || 50,
    });

    const item = await MenuItem.create({
      restaurant: partner.restaurant.id,
      name,
      price,
      description,
      image,
      available: available === "false" ? false : Boolean(available),
      // accept offer fields if provided when creating
      discountPercent: req.body.discountPercent
        ? Number(req.body.discountPercent)
        : 0,
      freeDelivery:
        req.body.freeDelivery === "true" || req.body.freeDelivery === true
          ? true
          : false,
      offerExpires: req.body.offerExpires
        ? new Date(req.body.offerExpires)
        : undefined,
      preparationTime,
      // Chatbot fields
      category: category || "other",
      dietary: parsedDietary || ["non-vegetarian"],
      spiceLevel: spiceLevel || "medium",
      allergens: parsedAllergens || [],
      isSide: isSide || false,
      popularityScore: parseInt(popularityScore) || 50,
    });

    console.log("Menu item created successfully:", item._id);
    res.status(201).json({ message: "Menu item created", item });
  } catch (err) {
    console.error("Error in addMenuItem:", err);
    next(err);
  }
};

// Partner sets offer fields for an existing menu item
const setItemOffer = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const partnerId = req.user?.partnerId;
    if (!partnerId) return res.status(401).json({ message: "Unauthorized" });

    const partner = await Partner.findOne({ partnerId }).populate("restaurant");
    if (!partner || !partner.restaurant)
      return res
        .status(404)
        .json({ message: "Partner or restaurant not found" });

    const itemId = req.params.id;
    const item = await MenuItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // Ensure partner owns the restaurant for this item
    if (String(item.restaurant) !== String(partner.restaurant.id)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to modify this item" });
    }

    const updates = {};
    if (typeof req.body.discountPercent !== "undefined")
      updates.discountPercent = Number(req.body.discountPercent) || 0;
    if (typeof req.body.freeDelivery !== "undefined")
      updates.freeDelivery =
        req.body.freeDelivery === true || req.body.freeDelivery === "true";
    if (typeof req.body.offerExpires !== "undefined") {
      updates.offerExpires = req.body.offerExpires
        ? new Date(req.body.offerExpires)
        : null;
    }

    Object.assign(item, updates);
    await item.save();

    res.json({ message: "Offer updated", item });
  } catch (err) {
    next(err);
  }
};

// Partner updates restaurant image
const updateRestaurantImage = async (req, res, next) => {
  try {
    const partnerId = req.user?.partnerId;
    if (!partnerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const partner = await Partner.findOne({ partnerId }).populate("restaurant");
    if (!partner || !partner.restaurant) {
      return res
        .status(404)
        .json({ message: "Partner or restaurant not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const basePath = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${basePath}/uploads/${req.file.filename}`;

    partner.restaurant.image = imageUrl;
    await partner.restaurant.save();

    console.log("Restaurant image updated:", imageUrl);
    res.json({
      message: "Restaurant image updated successfully",
      image: imageUrl,
    });
  } catch (err) {
    console.error("Error updating restaurant image:", err);
    next(err);
  }
};

// Partner updates menu item with chatbot fields
const updateMenuItem = async (req, res, next) => {
  try {
    const partnerId = req.user?.partnerId;
    if (!partnerId) return res.status(401).json({ message: "Unauthorized" });

    const partner = await Partner.findOne({ partnerId }).populate("restaurant");
    if (!partner || !partner.restaurant)
      return res
        .status(404)
        .json({ message: "Partner or restaurant not found" });

    const itemId = req.params.id;
    const item = await MenuItem.findById(itemId);
    if (!item) return res.status(404).json({ message: "Menu item not found" });

    // Ensure partner owns the restaurant for this item
    if (String(item.restaurant) !== String(partner.restaurant.id)) {
      return res
        .status(403)
        .json({ message: "You do not have permission to modify this item" });
    }

    const {
      name,
      price,
      description,
      preparationTime,
      available,
      imageUrl,
      // Chatbot fields
      category,
      dietary,
      spiceLevel,
      allergens,
      isSide,
      popularityScore,
    } = req.body;

    // Update basic fields
    if (name !== undefined) item.name = name;
    if (price !== undefined) item.price = price;
    if (description !== undefined) item.description = description;
    if (preparationTime !== undefined) item.preparationTime = preparationTime;
    if (available !== undefined)
      item.available = available === "false" ? false : Boolean(available);

    // Handle image update
    if (req.file) {
      const basePath = `${req.protocol}://${req.get("host")}`;
      item.image = `${basePath}/uploads/${req.file.filename}`;
    } else if (imageUrl !== undefined && imageUrl !== null) {
      item.image = imageUrl;
    }

    // Update chatbot fields
    if (category !== undefined) item.category = category;

    if (dietary !== undefined) {
      if (typeof dietary === "string") {
        try {
          item.dietary = JSON.parse(dietary);
        } catch (e) {
          item.dietary = dietary ? [dietary] : item.dietary;
        }
      } else if (Array.isArray(dietary)) {
        item.dietary = dietary;
      }
    }

    if (spiceLevel !== undefined) item.spiceLevel = spiceLevel;

    if (allergens !== undefined) {
      if (typeof allergens === "string") {
        try {
          item.allergens = JSON.parse(allergens);
        } catch (e) {
          item.allergens = allergens ? [allergens] : item.allergens;
        }
      } else if (Array.isArray(allergens)) {
        item.allergens = allergens;
      }
    }

    if (isSide !== undefined)
      item.isSide = isSide === "true" || isSide === true;
    if (popularityScore !== undefined)
      item.popularityScore = parseInt(popularityScore) || 0;

    await item.save();

    res.json({ message: "Menu item updated successfully", item });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  registerPartner,
  changePassword,
  addMenuItem,
  setItemOffer,
  updateRestaurantImage,
  updateMenuItem,
};
