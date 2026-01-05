const express = require("express");
const { body } = require("express-validator");
const {
  getRestaurants,
  getRestaurantById,
  addReview,
  getReviews,
} = require("../controllers/restaurantController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);

router.post(
  "/:id/reviews",
  requireAuth("customer"),
  [
    body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be 1-5"),
    body("comment")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Comment too long"),
    body("menuItemId").optional().isMongoId().withMessage("Invalid menu item"),
  ],
  addReview
);

router.get("/:id/reviews", getReviews);

module.exports = router;
