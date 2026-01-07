const express = require("express");
const { body, param } = require("express-validator");
const multer = require("multer");
const path = require("path");
const {
  registerPartner,
  changePassword,
  addMenuItem,
} = require("../controllers/partnerController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

// Multer config for partner item image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname) || "";
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image uploads are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

router.post(
  "/register",
  upload.single("restaurantImage"),
  [
    body("restaurantName").notEmpty(),
    body("contactName").notEmpty(),
    body("phone").notEmpty(),
    body("email").isEmail(),
    body("address").notEmpty(),
    body("city").notEmpty(),
  ],
  registerPartner
);

router.put(
  "/change-password",
  requireAuth("partner"),
  [
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  changePassword
);

router.post(
  "/items",
  requireAuth("partner"),
  upload.single("image"),
  [
    body("name").notEmpty().withMessage("Item name is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
    body("description").optional().isLength({ max: 500 }),
    body("preparationTime").optional().isLength({ max: 50 }),
  ],
  addMenuItem
);

// Update offer fields for a menu item (partner-only)
router.put(
  "/items/:id/offer",
  requireAuth("partner"),
  [
    param("id").isMongoId().withMessage("Invalid menu item id"),
    body("discountPercent")
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage("discountPercent must be between 0 and 100"),
    body("freeDelivery")
      .optional()
      .isBoolean()
      .withMessage("freeDelivery must be boolean"),
    body("offerExpires").optional().isISO8601().toDate(),
  ],
  require("../controllers/partnerController").setItemOffer
);

module.exports = router;
