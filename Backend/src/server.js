const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const config = require("./config/env");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/error");

// Routes
const authRoutes = require("./routes/auth");
const restaurantRoutes = require("./routes/restaurants");
const orderRoutes = require("./routes/orders");
const analyticsRoutes = require("./routes/analytics");
const partnerRoutes = require("./routes/partners");
const chatbotRoutes = require("./routes/chatbot");

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

// Expose upload directory for partner item images
const uploadsDir = path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use(errorHandler);

const start = async () => {
  try {
    await connectDb();
    app.listen(config.port, () => {
      console.log(`API running on port ${config.port}`);
    });
  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
};

start();
