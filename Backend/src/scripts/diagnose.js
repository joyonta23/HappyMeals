// Diagnostic: Backend Health Check
// Location: Backend/src/scripts/diagnose.js
// Run: node src/scripts/diagnose.js

const fs = require("fs");
const path = require("path");

console.log("🔍 HappyMeal Backend Diagnostic Report");
console.log("=====================================\n");

// Check 1: Node version
console.log("✓ Node.js version:", process.version);

// Check 2: Environment variables
console.log("\n✓ Environment Check:");
try {
  const env = require("../config/env");
  console.log("  - Port:", env.port);
  console.log("  - CORS Origin:", env.corsOrigin);
  console.log("  - Database:", env.mongoUri ? "Configured" : "NOT CONFIGURED");
} catch (err) {
  console.log("  ❌ Error loading config:", err.message);
}

// Check 3: Uploads directory
console.log("\n✓ Uploads Directory Check:");
const uploadsDir = path.join(__dirname, "../uploads");
if (fs.existsSync(uploadsDir)) {
  console.log("  ✅ Uploads directory exists:", uploadsDir);
  try {
    const files = fs.readdirSync(uploadsDir);
    console.log("  📁 Files in uploads:", files.length);
  } catch (err) {
    console.log("  ❌ Cannot read uploads directory:", err.message);
  }
} else {
  console.log("  ⚠️  Uploads directory NOT FOUND");
  console.log("  Creating:", uploadsDir);
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("  ✅ Created successfully");
  } catch (err) {
    console.log("  ❌ Failed to create:", err.message);
  }
}

// Check 4: Required modules
console.log("\n✓ Dependencies Check:");
const modules = ["express", "mongoose", "multer", "cors", "helmet", "morgan"];
modules.forEach((mod) => {
  try {
    require(mod);
    console.log("  ✅", mod);
  } catch {
    console.log("  ❌", mod, "(NOT INSTALLED)");
  }
});

// Check 5: Model files
console.log("\n✓ Model Files Check:");
const models = [
  "Order.js",
  "MenuItem.js",
  "Partner.js",
  "Restaurant.js",
  "User.js",
];
const modelsDir = path.join(__dirname, "../models");
models.forEach((model) => {
  const modelPath = path.join(modelsDir, model);
  if (fs.existsSync(modelPath)) {
    console.log("  ✅", model);
  } else {
    console.log("  ❌", model, "(NOT FOUND)");
  }
});

// Check 6: Route files
console.log("\n✓ Route Files Check:");
const routes = ["orders.js", "partners.js", "auth.js", "restaurants.js"];
const routesDir = path.join(__dirname, "../routes");
routes.forEach((route) => {
  const routePath = path.join(routesDir, route);
  if (fs.existsSync(routePath)) {
    console.log("  ✅", route);
  } else {
    console.log("  ❌", route, "(NOT FOUND)");
  }
});

// Check 7: Middleware files
console.log("\n✓ Middleware Files Check:");
const middlewares = ["auth.js", "error.js"];
const middlewareDir = path.join(__dirname, "../middleware");
middlewares.forEach((mw) => {
  const mwPath = path.join(middlewareDir, mw);
  if (fs.existsSync(mwPath)) {
    console.log("  ✅", mw);
  } else {
    console.log("  ❌", mw, "(NOT FOUND)");
  }
});

// Check 8: Order Schema Check
console.log("\n✓ Order Schema Check:");
try {
  const Order = require("../models/Order");
  const schema = Order.schema;
  if (schema.paths.orderId) {
    console.log("  ✅ orderId field exists");
    console.log("    - Type:", schema.paths.orderId.instance);
    console.log("    - Required:", schema.paths.orderId.isRequired);
    console.log("    - Unique:", schema.paths.orderId.options.unique);
  } else {
    console.log("  ⚠️  orderId field NOT FOUND in Order schema");
    console.log("  This needs to be added for order status updates to work!");
  }
} catch (err) {
  console.log("  ❌ Error checking Order schema:", err.message);
}

// Check 9: MenuItem Schema Check
console.log("\n✓ MenuItem Schema Check:");
try {
  const MenuItem = require("../models/MenuItem");
  const schema = MenuItem.schema;
  if (schema.paths.image) {
    console.log("  ✅ image field exists");
    console.log("    - Type:", schema.paths.image.instance);
  } else {
    console.log("  ❌ image field NOT FOUND in MenuItem schema");
  }
} catch (err) {
  console.log("  ❌ Error checking MenuItem schema:", err.message);
}

// Check 10: Controllers
console.log("\n✓ Controller Files Check:");
const controllers = [
  "orderController.js",
  "partnerController.js",
  "authController.js",
  "restaurantController.js",
];
const controllersDir = path.join(__dirname, "../controllers");
controllers.forEach((controller) => {
  const controllerPath = path.join(controllersDir, controller);
  if (fs.existsSync(controllerPath)) {
    console.log("  ✅", controller);
  } else {
    console.log("  ❌", controller, "(NOT FOUND)");
  }
});

console.log("\n=====================================");
console.log("📋 Summary:");
console.log("  ✅ = Ready");
console.log("  ⚠️  = Warning (may need attention)");
console.log("  ❌ = Error (needs fixing)");
console.log("\n🚀 To start the server:");
console.log("  npm start");
console.log("\n=====================================\n");
