const mongoose = require("mongoose");
require("dotenv").config();
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

async function checkChatbotFields() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database\n");

    const menuItems = await MenuItem.find({}).populate("restaurant", "name");
    console.log(`Total items: ${menuItems.length}\n`);

    menuItems.forEach((item) => {
      console.log(`\n${item.name} ($${item.price}) - ${item.restaurant?.name}`);
      console.log(`  Category: ${item.category || "NOT SET"}`);
      console.log(`  Dietary: ${item.dietary?.join(", ") || "NOT SET"}`);
      console.log(`  Spice: ${item.spiceLevel || "NOT SET"}`);
      console.log(`  Allergens: ${item.allergens?.join(", ") || "none"}`);
      console.log(`  Is Side: ${item.isSide}`);
      console.log(`  Popularity: ${item.popularityScore}`);
      console.log(`  Available: ${item.available}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkChatbotFields();
