const { validationResult } = require("express-validator");
const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");
const Review = require("../models/Review");

const getRestaurants = async (_req, res, next) => {
  try {
    let restaurants = await Restaurant.find({ isActive: true }).lean();

    if (!restaurants.length) {
      restaurants = [
        {
          _id: "mock-1",
          name: "Deshi Dine",
          cuisine: "Bangladeshi",
          rating: 4.5,
          deliveryFee: 29,
          image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
          city: "Chattogram",
        },
        {
          _id: "mock-2",
          name: "Astana",
          cuisine: "Bangali food",
          rating: 4.3,
          deliveryFee: 35,
          image:
            "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
          city: "Chattogram",
        },
      ];
    }

    res.json(restaurants);
  } catch (err) {
    next(err);
  }
};

const getRestaurantById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id).lean();
    if (!restaurant) {
      // Allow mock fallback
      if (id === "mock-1" || id === "mock-2") {
        return res.json({
          _id: id,
          name: id === "mock-1" ? "Deshi Dine" : "Astana",
          cuisine: id === "mock-1" ? "Bangladeshi" : "Bangali food",
          rating: id === "mock-1" ? 4.5 : 4.3,
          deliveryFee: id === "mock-1" ? 29 : 35,
          image:
            id === "mock-1"
              ? "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
              : "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
          items: [
            {
              id: 1,
              name: "Sample Item",
              price: 250,
              description: "Placeholder item",
              image:
                "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=150&fit=crop",
            },
          ],
        });
      }
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const items = await MenuItem.find({
      restaurant: id,
      available: true,
    }).lean();

    // Fetch latest reviews and compute average rating
    const reviews = await Review.find({ restaurant: id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    let averageRating = restaurant.rating || 0;
    if (reviews.length) {
      const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
      averageRating = Math.round((sum / reviews.length) * 10) / 10; // 1 decimal place
    }

    res.json({ ...restaurant, items, reviews, averageRating });
  } catch (err) {
    next(err);
  }
};

// Add a review for a restaurant (optionally for a specific menu item)
const addReview = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { rating, comment, menuItemId } = req.body;

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    let menuItem = null;
    if (menuItemId) {
      menuItem = await MenuItem.findOne({ _id: menuItemId, restaurant: id });
      if (!menuItem) {
        return res
          .status(400)
          .json({ message: "Menu item not found for this restaurant" });
      }
    }

    const userId = req.user?.userId;
    const user = await require("../models/User").findById(userId).lean();
    const userName = user?.name || "Customer";

    const review = await Review.create({
      restaurant: id,
      menuItem: menuItem ? menuItem.id : undefined,
      user: userId,
      userName,
      rating,
      comment,
    });

    // Recalculate average rating and persist on restaurant
    const agg = await Review.aggregate([
      { $match: { restaurant: review.restaurant } },
      {
        $group: {
          _id: "$restaurant",
          avgRating: { $avg: "$rating" },
        },
      },
    ]);

    const avgRating = agg?.[0]?.avgRating || restaurant.rating || 0;
    restaurant.rating = Math.round(avgRating * 10) / 10;
    await restaurant.save();

    res.status(201).json({
      message: "Review added",
      review,
      averageRating: restaurant.rating,
    });
  } catch (err) {
    next(err);
  }
};

// Get reviews for a restaurant
const getReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = Math.min(parseInt(req.query.limit || "20", 10), 50);

    const restaurant = await Restaurant.findById(id).lean();
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    const reviews = await Review.find({ restaurant: id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

module.exports = { getRestaurants, getRestaurantById, addReview, getReviews };
