const mongoose = require("mongoose");
require("dotenv").config();
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");
const Partner = require("../models/Partner");

async function testAddItem() {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/happymeal";
    console.log("Connecting to MongoDB:", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("Connected to database\n");

    // Find the partner
    const partner = await Partner.findOne({ partnerId: "PARTNER001" }).populate(
      "restaurant"
    );
    if (!partner) {
      console.log("Partner PARTNER001 not found!");
      process.exit(1);
    }

    console.log("Partner found:", partner.email);
    console.log("Restaurant ID:", partner.restaurant._id);
    console.log("Restaurant name:", partner.restaurant.name);

    // Check existing menu items
    const existingItems = await MenuItem.find({
      restaurant: partner.restaurant._id,
    });
    console.log("\nExisting menu items:", existingItems.length);
    existingItems.forEach((item) => {
      console.log(`  - ${item.name} ($${item.price})`);
    });

    // Add test item
    console.log("\n--- Adding Test Item: Hyderabad Biryani ---");
    const newItem = await MenuItem.create({
      restaurant: partner.restaurant._id,
      name: "Hyderabad Biryani",
      price: 400,
      description: "Authentic Hyderabad style biryani",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=150&fit=crop",
      available: true,
      preparationTime: "45 mins",
    });

    console.log("Item created successfully!");
    console.log("Item ID:", newItem._id);
    console.log("Item name:", newItem.name);

    // Verify it was saved
    const allItems = await MenuItem.find({
      restaurant: partner.restaurant._id,
    });
    console.log("\nTotal menu items after adding:", allItems.length);
    allItems.forEach((item) => {
      console.log(`  - ${item.name} ($${item.price}) - ID: ${item._id}`);
    });

    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

testAddItem();
