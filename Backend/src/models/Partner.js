const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    partnerId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, default: "Chattogram" },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Partner", partnerSchema);
