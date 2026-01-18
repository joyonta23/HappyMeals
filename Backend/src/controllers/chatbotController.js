/**
 * Chatbot Controller
 * Handles AI meal combo suggestions
 */

const MenuItem = require("../models/MenuItem");
const {
  parsePriceRange,
  parsePreferences,
  generateCombos,
  validateInput,
} = require("../utils/chatbotHelper");

/**
 * Generate personalized meal combos based on budget and preferences
 * POST /api/chatbot/generate-combo
 */
exports.generateCombo = async (req, res) => {
  try {
    const { priceRange, preferences, restaurantId } = req.body;

    // Validate input
    const validation = validateInput({ priceRange, preferences });
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        errors: validation.errors,
      });
    }

    // Parse user inputs
    const budget = parsePriceRange(priceRange);
    const userPrefs = parsePreferences(preferences);

    console.log("Chatbot Request:", {
      priceRange,
      preferences,
      budget,
      userPrefs,
    });

    // Build query to fetch menu items
    let query = { available: true };

    // If restaurantId is provided, filter by restaurant
    if (restaurantId) {
      query.restaurant = restaurantId;
    }

    // Fetch items from database
    const menuItems = await MenuItem.find(query)
      .lean()
      .select(
        "name price category dietary spiceLevel allergens isSide popularityScore description image"
      );

    console.log(`Found ${menuItems.length} available menu items`);

    if (menuItems.length === 0) {
      return res.status(200).json({
        success: true,
        combos: [],
        message: "No menu items available. Please try again later.",
      });
    }

    // Generate combos
    const combos = generateCombos(menuItems, budget, userPrefs, 4);

    console.log(`Generated ${combos.length} combos`);

    if (combos.length === 0) {
      return res.status(200).json({
        success: true,
        combos: [],
        message:
          "Sorry, no combos found matching your preferences. Please adjust your preferences.",
      });
    }

    res.json({
      success: true,
      combos,
      message: `Great! We found ${combos.length} amazing combo${combos.length > 1 ? "s" : ""} for you!`,
    });
  } catch (error) {
    console.error("Chatbot combo generation error:", error);
    res.status(500).json({
      success: false,
      message: "Error creating combos. Please try again later.",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get available dietary preferences and spice levels
 * GET /api/chatbot/preferences
 */
exports.getPreferences = async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        dietary: ["vegetarian", "non-vegetarian", "vegan", "halal"],
        spiceLevels: ["mild", "medium", "spicy"],
        allergens: ["nuts", "dairy", "gluten", "shellfish", "eggs"],
        categories: [
          "biryani",
          "grilled",
          "drink",
          "side",
          "salad",
          "dessert",
          "bread",
        ],
      },
    });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    res.status(500).json({
      success: false,
      message: "পছন্দ আনতে ত্রুটি হয়েছে।",
    });
  }
};
