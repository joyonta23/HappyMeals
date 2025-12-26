const mongoose = require("mongoose");
const config = require("./env");

const connectDb = async () => {
  if (!config.mongoUri) {
    throw new Error("MONGODB_URI is not set");
  }
  mongoose.set("strictQuery", false);
  await mongoose.connect(config.mongoUri);
  // Connection events could be logged here if desired
};

module.exports = connectDb;
