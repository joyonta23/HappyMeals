const jwt = require("jsonwebtoken");
const config = require("../config/env");

const requireAuth = (roles = []) => {
  const allowedRoles = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.replace("Bearer ", "")
        : null;

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const payload = jwt.verify(token, config.jwtSecret);
      if (allowedRoles.length && !allowedRoles.includes(payload.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = payload;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = requireAuth;
