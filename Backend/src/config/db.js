const mongoose = require("mongoose");
const config = require("./env");

const connectDb = async () => {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }
  mongoose.set("strictQuery", false);
  // Log a masked version of the URI for debugging (hides the password)
  try {
    const maskedUri = config.mongoUri.replace(/(\/\/.*?:)(.*?)(@)/, "$1***$3");
    console.log("Connecting to MongoDB:", maskedUri);
  } catch (e) {
    // fallback: don't crash on masking
    console.log("Connecting to MongoDB: <masked>");
  }
  await mongoose.connect(config.mongoUri);
  // Connection events could be logged here if desired
};

module.exports = connectDb;
