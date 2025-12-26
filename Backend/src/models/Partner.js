const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    partnerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    ownerName: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
