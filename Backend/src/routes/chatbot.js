/**
 * Chatbot Routes
 * Endpoints for AI meal suggestions
 */

const express = require("express");
const {
  generateCombo,
  getPreferences,
} = require("../controllers/chatbotController");

const router = express.Router();

/**
 * POST /api/chatbot/generate-combo
 * Generate personalized meal combos
 * Body: { priceRange: string, preferences: string, restaurantId?: string }
 */
router.post("/generate-combo", generateCombo);

/**
 * GET /api/chatbot/preferences
 * Get available preference options (dietary, spice levels, etc.)
 */
router.get("/preferences", getPreferences);

module.exports = router;
