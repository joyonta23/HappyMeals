const mongoose = require("mongoose");
require("dotenv").config();
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

async function checkMenuItems() {
  try {
    const mongoURI =
      process.env.MONGODB_URI || "mongodb://localhost:27017/happymeal";
    console.log("Connecting to MongoDB:", mongoURI);

    await mongoose.connect(mongoURI);
    console.log("Connected to database\n");

    // Get all restaurants
    const restaurants = await Restaurant.find({}).select("name restaurantId");
    console.log(`Found ${restaurants.length} restaurants:`);
    restaurants.forEach((r) =>
      console.log(`  - ${r.name} (${r.restaurantId})`)
    );
    console.log("");

    // Get all menu items
    const menuItems = await MenuItem.find({}).populate(
      "restaurant",
      "name restaurantId"
    );
    console.log(`Found ${menuItems.length} menu items in database:\n`);

    if (menuItems.length === 0) {
      console.log("No menu items found! This might be the issue.");
    } else {
      // Group by restaurant
      const grouped = {};
      menuItems.forEach((item) => {
        const restaurantName = item.restaurant?.name || "Unknown";
        if (!grouped[restaurantName]) {
          grouped[restaurantName] = [];
        }
        grouped[restaurantName].push(item);
      });

      Object.keys(grouped).forEach((restaurantName) => {
        console.log(`\n${restaurantName}:`);
        grouped[restaurantName].forEach((item) => {
          console.log(`  - ${item.name} ($${item.price})`);
          console.log(`    Image: ${item.image || "No image"}`);
          console.log(`    Available: ${item.available}`);
          console.log(`    ID: ${item._id}`);
        });
      });
    }

    await mongoose.connection.close();
    console.log("\n\nDatabase connection closed.");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkMenuItems();
