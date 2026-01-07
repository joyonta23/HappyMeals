// Usage: node src/scripts/check-offer.js <menuItemId>
// Prints effective offer state for a MenuItem, mirroring order logic

const mongoose = require("mongoose");
const connectDb = require("../config/db");
const MenuItem = require("../models/MenuItem");

(async () => {
  const id = process.argv[2];
  if (!id) {
    console.error("Provide a menuItemId. Example: node src/scripts/check-offer.js 65a6... ");
    process.exit(1);
  }
  try {
    await connectDb();
    const item = await MenuItem.findById(id).lean();
    if (!item) {
      console.error("Menu item not found:", id);
      process.exit(1);
    }

    const now = new Date();
    const expiresAt = item.offerExpires ? new Date(item.offerExpires) : null;
    const offerValid = Number(item.discountPercent || 0) > 0 && (!expiresAt || expiresAt > now);
    const freeDeliveryActive = !!item.freeDelivery && (!expiresAt || expiresAt > now);
    const originalPrice = Number(item.price || 0);
    const effectivePrice = offerValid
      ? Math.round(originalPrice * (1 - Number(item.discountPercent || 0) / 100))
      : originalPrice;

    const summary = {
      id: String(item._id),
      name: item.name,
      originalPrice,
      discountPercent: Number(item.discountPercent || 0),
      offerExpires: item.offerExpires || null,
      offerValid,
      effectivePrice,
      freeDelivery: !!item.freeDelivery,
      freeDeliveryActive,
    };

    console.log(JSON.stringify(summary, null, 2));
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    try { await mongoose.disconnect(); } catch {}
  }
})();
