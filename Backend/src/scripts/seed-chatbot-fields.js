/**
 * Seed Script - Update Menu Items with Chatbot Fields
 * Run this to add chatbot-specific fields to existing menu items
 *
 * Usage:
 * node src/scripts/seed-chatbot-fields.js
 */

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const MenuItem = require("../models/MenuItem");
const connectDb = require("../config/db");

/**
 * Sample menu items with chatbot fields
 */
const sampleItemsWithChatbotFields = [
  {
    // Biryani items
    category: "biryani",
    dietary: ["non-vegetarian"],
    spiceLevel: "medium",
    allergens: [],
    isSide: false,
    popularityScore: 95,
  },
  {
    category: "biryani",
    dietary: ["vegetarian"],
    spiceLevel: "medium",
    allergens: [],
    isSide: false,
    popularityScore: 85,
  },
  // Grilled items
  {
    category: "grilled",
    dietary: ["non-vegetarian"],
    spiceLevel: "spicy",
    allergens: [],
    isSide: false,
    popularityScore: 80,
  },
  // Drinks (sides)
  {
    category: "drink",
    dietary: ["vegetarian"],
    spiceLevel: "mild",
    allergens: ["dairy"],
    isSide: true,
    popularityScore: 70,
  },
  // Bread (sides)
  {
    category: "bread",
    dietary: ["vegetarian"],
    spiceLevel: "mild",
    allergens: ["gluten"],
    isSide: true,
    popularityScore: 75,
  },
  // Salad (sides)
  {
    category: "salad",
    dietary: ["vegetarian", "vegan"],
    spiceLevel: "mild",
    allergens: [],
    isSide: true,
    popularityScore: 60,
  },
];

/**
 * Update existing menu items with default chatbot fields
 */
async function updateMenuItems() {
  try {
    console.log("📊 Starting Menu Items Update for Chatbot Fields...\n");

    await connectDb();

    // Get all menu items without chatbot fields
    const itemsToUpdate = await MenuItem.find({
      $or: [{ category: { $exists: false } }, { dietary: { $exists: false } }],
    });

    console.log(`Found ${itemsToUpdate.length} items to update\n`);

    if (itemsToUpdate.length === 0) {
      console.log("✅ All items already have chatbot fields!");
      process.exit(0);
    }

    // Update each item with default chatbot fields
    let updated = 0;
    for (const item of itemsToUpdate) {
      // Guess category and fields based on item name
      const guessedFields = guessItemFields(item.name);

      const updated_item = await MenuItem.findByIdAndUpdate(
        item._id,
        {
          $set: {
            category: guessedFields.category,
            dietary: guessedFields.dietary,
            spiceLevel: guessedFields.spiceLevel,
            allergens: guessedFields.allergens,
            isSide: guessedFields.isSide,
            popularityScore: guessedFields.popularityScore,
          },
        },
        { new: true }
      );

      console.log(
        `✅ Updated: ${updated_item.name} (${updated_item.category}, ${updated_item.dietary.join(", ")})`
      );
      updated++;
    }

    console.log(`\n✨ Successfully updated ${updated} menu items!\n`);

    // Show summary
    const summary = await MenuItem.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    console.log("📊 Items by Category:");
    summary.forEach((cat) => {
      console.log(`  - ${cat._id || "unknown"}: ${cat.count} items`);
    });

    console.log("\n✅ Chatbot fields successfully applied to menu items!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating menu items:", error);
    process.exit(1);
  }
}

/**
 * Guess menu item fields based on name and description
 * This is a simple heuristic - adjust based on your menu
 */
function guessItemFields(itemName) {
  const name = itemName.toLowerCase();

  // Default
  let fields = {
    category: "other",
    dietary: ["non-vegetarian"],
    spiceLevel: "medium",
    allergens: [],
    isSide: false,
    popularityScore: 50,
  };

  // Detect category
  if (name.includes("biryani") || name.includes("rice")) {
    fields.category = "biryani";
    fields.popularityScore = 90;
  } else if (
    name.includes("grilled") ||
    name.includes("tandoor") ||
    name.includes("kebab")
  ) {
    fields.category = "grilled";
    fields.spiceLevel = "spicy";
    fields.popularityScore = 85;
  } else if (
    name.includes("drink") ||
    name.includes("juice") ||
    name.includes("cola") ||
    name.includes("shake") ||
    name.includes("lassi")
  ) {
    fields.category = "drink";
    fields.isSide = true;
    fields.dietary = ["vegetarian"];
    fields.popularityScore = 70;
    fields.allergens = ["dairy"];
  } else if (
    name.includes("naan") ||
    name.includes("roti") ||
    name.includes("paratha") ||
    name.includes("bread")
  ) {
    fields.category = "bread";
    fields.isSide = true;
    fields.dietary = ["vegetarian"];
    fields.allergens = ["gluten"];
    fields.popularityScore = 75;
  } else if (
    name.includes("salad") ||
    name.includes("coleslaw") ||
    name.includes("raita")
  ) {
    fields.category = "salad";
    fields.isSide = true;
    fields.dietary = ["vegetarian"];
    fields.popularityScore = 60;
  } else if (name.includes("pizza")) {
    fields.category = "bread";
    fields.dietary = ["non-vegetarian"];
    fields.popularityScore = 75;
  } else if (name.includes("burger")) {
    fields.category = "grilled";
    fields.dietary = ["non-vegetarian"];
    fields.spiceLevel = "medium";
    fields.popularityScore = 80;
  } else if (name.includes("curry") || name.includes("masala")) {
    fields.category = "biryani";
    fields.spiceLevel = "spicy";
    fields.popularityScore = 85;
  } else if (name.includes("veg") || name.includes("vegetable")) {
    fields.dietary = ["vegetarian"];
    fields.popularityScore = 70;
  } else if (
    name.includes("chicken") ||
    name.includes("fish") ||
    name.includes("mutton")
  ) {
    fields.dietary = ["non-vegetarian"];
    fields.popularityScore = 80;
  }

  // Detect spice level
  if (
    name.includes("mild") ||
    name.includes("light") ||
    name.includes("sweet")
  ) {
    fields.spiceLevel = "mild";
  } else if (name.includes("spicy") || name.includes("hot")) {
    fields.spiceLevel = "spicy";
  } else {
    fields.spiceLevel = "medium";
  }

  // Detect allergens
  if (name.includes("nut") || name.includes("almond")) {
    fields.allergens.push("nuts");
  }
  if (name.includes("dairy") || name.includes("cheese")) {
    fields.allergens.push("dairy");
  }
  if (name.includes("gluten")) {
    fields.allergens.push("gluten");
  }

  return fields;
}

/**
 * Create sample menu items with full chatbot fields
 * Uncomment to add sample data
 */
async function createSampleItems() {
  try {
    console.log("🎯 Creating sample menu items with chatbot fields...\n");

    await connectDb();

    // Get first restaurant to add items to
    const Restaurant = require("../models/Restaurant");
    const restaurant = await Restaurant.findOne();

    if (!restaurant) {
      console.log(
        "⚠️  No restaurant found. Create a restaurant first using /api/partners/create-restaurant"
      );
      return;
    }

    const sampleItems = [
      {
        name: "Hyderabadi Biryani",
        price: 450,
        description: "Authentic Hyderabadi biryani with basmati rice",
        category: "biryani",
        dietary: ["non-vegetarian"],
        spiceLevel: "medium",
        allergens: [],
        isSide: false,
        popularityScore: 95,
        restaurant: restaurant._id,
      },
      {
        name: "Veg Biryani",
        price: 350,
        description: "Vegetarian biryani with mixed vegetables",
        category: "biryani",
        dietary: ["vegetarian"],
        spiceLevel: "medium",
        allergens: [],
        isSide: false,
        popularityScore: 85,
        restaurant: restaurant._id,
      },
      {
        name: "Tandoori Chicken",
        price: 400,
        description: "Grilled chicken marinated in yogurt and spices",
        category: "grilled",
        dietary: ["non-vegetarian"],
        spiceLevel: "spicy",
        allergens: ["dairy"],
        isSide: false,
        popularityScore: 90,
        restaurant: restaurant._id,
      },
      {
        name: "Plain Naan",
        price: 80,
        description: "Soft Indian bread",
        category: "bread",
        dietary: ["vegetarian"],
        spiceLevel: "mild",
        allergens: ["gluten"],
        isSide: true,
        popularityScore: 80,
        restaurant: restaurant._id,
      },
      {
        name: "Masala Chai",
        price: 50,
        description: "Indian spiced tea",
        category: "drink",
        dietary: ["vegetarian"],
        spiceLevel: "mild",
        allergens: ["dairy"],
        isSide: true,
        popularityScore: 75,
        restaurant: restaurant._id,
      },
      {
        name: "Cucumber Salad",
        price: 120,
        description: "Fresh cucumber and tomato salad",
        category: "salad",
        dietary: ["vegetarian", "vegan"],
        spiceLevel: "mild",
        allergens: [],
        isSide: true,
        popularityScore: 65,
        restaurant: restaurant._id,
      },
    ];

    const createdItems = await MenuItem.insertMany(sampleItems);

    console.log(`✅ Created ${createdItems.length} sample menu items:\n`);
    createdItems.forEach((item) => {
      console.log(
        `  - ${item.name} (${item.category}) @ ৳${item.price} - ${item.dietary.join(", ")}`
      );
    });

    console.log("\n✨ Sample data created successfully!");
  } catch (error) {
    console.error("❌ Error creating sample items:", error);
  }
}

// Main execution
console.log("🚀 Menu Items Chatbot Fields Seeder\n");
console.log("This script will update your menu items with chatbot fields.\n");

// Run update
updateMenuItems();

// Uncomment to also create sample items:
// createSampleItems().then(() => updateMenuItems());
