const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: false,
    },
    name: { type: String, required: true },
    // price stored is the effective price charged per unit
    price: { type: Number, required: true },
    // track original and offer details
    originalPrice: { type: Number },
    discountPercent: { type: Number, default: 0 },
    discountedPrice: { type: Number },
    freeDeliveryApplied: { type: Boolean, default: false },
    offerExpires: { type: Date },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: { type: String, unique: true, required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: { type: [orderItemSchema], required: true },
    totals: {
      subtotal: { type: Number, required: true },
      deliveryFee: { type: Number, required: true },
      total: { type: Number, required: true },
    },
    address: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "on-the-way",
        "delivered",
        "cancelled",
        "accepted",
        "rejected",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
