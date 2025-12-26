const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image: { type: String },
    available: { type: Boolean, default: true },
    preparationTime: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
