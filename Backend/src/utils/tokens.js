const jwt = require("jsonwebtoken");
const config = require("../config/env");

const signToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: "7d" });
};

module.exports = { signToken };
