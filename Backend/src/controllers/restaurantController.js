const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
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

    // Populate items with offer fields for each restaurant
    const restaurantIds = restaurants.map((r) => r._id);
    const allItems = await MenuItem.find({
      restaurant: { $in: restaurantIds },
      available: true,
    })
      .select(
        "restaurant name price discountPercent freeDelivery offerExpires image"
      )
      .lean();

    // Group items by restaurant
    const itemsByRestaurant = allItems.reduce((acc, item) => {
      const rid = String(item.restaurant);
      if (!acc[rid]) acc[rid] = [];
      acc[rid].push(item);
      return acc;
    }, {});

    // Attach items to each restaurant
    const enrichedRestaurants = restaurants.map((r) => ({
      ...r,
      items: itemsByRestaurant[String(r._id)] || [],
    }));

    res.json(enrichedRestaurants);
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

    // Aggregate per-item ratings for this restaurant
    const itemRatings = await Review.aggregate([
      {
        $match: {
          restaurant: new mongoose.Types.ObjectId(id),
          menuItem: { $exists: true, $ne: null },
        },
      },
      {
        $group: {
          _id: "$menuItem",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const ratingsMap = itemRatings.reduce((acc, r) => {
      acc[r._id.toString()] = {
        avgRating: Math.round((r.avgRating || 0) * 10) / 10,
        reviewCount: r.count,
      };
      return acc;
    }, {});

    const itemsWithRatings = items.map((it) => {
      const key = (it._id || it.id).toString();
      const ratingInfo = ratingsMap[key] || {};
      return {
        ...it,
        avgRating: ratingInfo.avgRating || 0,
        reviewCount: ratingInfo.reviewCount || 0,
      };
    });

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

    res.json({
      ...restaurant,
      items: itemsWithRatings,
      reviews,
      averageRating,
    });
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

    let review = await Review.create({
      restaurant: id,
      menuItem: menuItem ? menuItem.id : undefined,
      user: userId,
      userName,
      rating,
      comment,
    });

    // Populate menu item name for the response
    review = await review.populate("menuItem", "name");

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
      .populate("menuItem", "name")
      .limit(limit)
      .lean();

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

// Search menu items and restaurants by text query
const searchItems = async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q || q.length < 2) return res.json([]);

    const regex = new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");

    // Find menu items that match name or description
    const items = await MenuItem.find({
      available: true,
      $or: [{ name: regex }, { description: regex }],
    })
      .limit(30)
      .populate("restaurant", "name cuisine")
      .lean();

    // Also find restaurants that match name or cuisine and include some items
    const restaurants = await Restaurant.find({
      $or: [{ name: regex }, { cuisine: regex }],
      isActive: true,
    })
      .limit(10)
      .lean();

    const restaurantItems = [];
    if (restaurants.length) {
      const restaurantIds = restaurants.map((r) => r._id);
      const itemsForRestaurants = await MenuItem.find({
        restaurant: { $in: restaurantIds },
        available: true,
      })
        .limit(30)
        .populate("restaurant", "name cuisine")
        .lean();
      restaurantItems.push(...itemsForRestaurants);
    }

    // Combine and dedupe by item id
    const combined = [...items, ...restaurantItems];
    const seen = new Set();
    const output = [];
    for (const it of combined) {
      const id = (it._id || it.id).toString();
      if (seen.has(id)) continue;
      seen.add(id);
      output.push({
        name: it.name,
        description: it.description || "",
        restaurant: it.restaurant?.name || "",
        cuisine: it.restaurant?.cuisine || "",
        itemId: it._id || it.id,
        restaurantId: it.restaurant?._id || it.restaurant?.id,
      });
      if (output.length >= 20) break;
    }

    res.json(output);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRestaurants,
  getRestaurantById,
  addReview,
  getReviews,
  searchItems,
};
