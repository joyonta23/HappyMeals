const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cuisine: { type: String, required: true },
    rating: { type: Number, default: 4.2 },
    deliveryFee: { type: Number, default: 30 },
    image: { type: String },
    city: { type: String, default: "Chattogram" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
