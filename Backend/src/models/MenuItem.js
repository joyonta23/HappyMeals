const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    // Offer fields
    discountPercent: { type: Number, default: 0 },
    freeDelivery: { type: Boolean, default: false },
    offerExpires: { type: Date },
    available: { type: Boolean, default: true },
    preparationTime: { type: String },
    // Chatbot fields
    category: { type: String, enum: ["biryani", "grilled", "drink", "side", "salad", "dessert", "bread", "other"], default: "other" },
    dietary: [{ type: String, enum: ["vegetarian", "non-vegetarian", "vegan", "halal"], default: "non-vegetarian" }],
    spiceLevel: { type: String, enum: ["mild", "medium", "spicy"], default: "medium" },
    allergens: [{ type: String, enum: ["nuts", "dairy", "gluten", "shellfish", "eggs"], default: [] }],
    isSide: { type: Boolean, default: false }, // true for drinks, salads, naan, raita, etc.
    popularityScore: { type: Number, default: 0, min: 0, max: 100 }, // 0-100 scale
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
