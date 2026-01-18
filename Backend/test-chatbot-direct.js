require("dotenv").config();
const mongoose = require("mongoose");
const MenuItem = require("./src/models/MenuItem");
const {
  parsePriceRange,
  parsePreferences,
  generateCombos,
} = require("./src/utils/chatbotHelper");

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB\n");

    const priceRange = "120";
    const preferences = "Chicken Shawrma";

    const budget = parsePriceRange(priceRange);
    const userPrefs = parsePreferences(preferences);

    console.log("Budget:", budget);
    console.log("User Prefs:", userPrefs);

    const menuItems = await MenuItem.find({ available: true }).lean();
    console.log(`\nFound ${menuItems.length} menu items\n`);

    console.log("Calling generateCombos...");
    const combos = generateCombos(menuItems, budget, userPrefs, 4);

    console.log(`\n✅ Generated ${combos.length} combos:`);
    combos.forEach((combo, idx) => {
      console.log(`\nCombo ${idx + 1}:`);
      combo.items.forEach((item) => {
        console.log(`  - ${item.name} ($${item.price})`);
      });
      console.log(`  Total: $${combo.totalPrice}`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

test();
