const dotenv = require("dotenv");

// Ensure local .env overrides any pre-set environment vars in dev
dotenv.config({ override: true });

const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
};

module.exports = config;
