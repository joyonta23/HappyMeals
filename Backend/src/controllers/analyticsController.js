const mongoose = require("mongoose");
const MenuItem = require("../models/MenuItem");
const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");

// Returns static analytics for partners; replace with real aggregation later
const getAnalytics = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const data = {
      dailySales: [],
      weeklySales: {},
      monthlySales: {},
      popularItems: [],
      expenses: {},
      wastage: [],
      reviews: [],
      ratingBreakdown: {},
      averageRating: 0,
      totalOrders: 0,
      totalRevenue: 0,
      partnerId,
    };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

// Popularity score formula (implemented in aggregation):
// score = (0.6 * menuAvgRating + 0.3 * restaurant.rating) * (1 + ln(1 + votes))
// This combines the menu item's own average rating, the parent restaurant's rating,
// and boosts by the number of votes (reviews) using a logarithmic scale.
const getPopularDishes = async (req, res, next) => {
  try {
    // Aggregate menu items with restaurant and review stats, compute score, return top 5
    const pipeline = [
      { $match: { available: true } },
      {
        $lookup: {
          from: "restaurants",
          localField: "restaurant",
          foreignField: "_id",
          as: "restaurant",
        },
      },
      { $unwind: { path: "$restaurant", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "reviews",
          let: { itemId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$menuItem", "$$itemId"] } } },
            { $group: { _id: null, avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
          ],
          as: "revStats",
        },
      },
      { $unwind: { path: "$revStats", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          avgRating: { $ifNull: ["$revStats.avgRating", 0] },
          votes: { $ifNull: ["$revStats.count", 0] },
          restaurantRating: { $ifNull: ["$restaurant.rating", 4.2] },
        },
      },
      {
        $addFields: {
          score: {
            $multiply: [
              { $add: [ { $multiply: ["$avgRating", 0.6] }, { $multiply: ["$restaurantRating", 0.3] } ] },
              { $add: [1, { $ln: { $add: [1, "$votes"] } } ] },
            ],
          },
        },
      },
      { $sort: { score: -1 } },
      { $limit: 5 },
      {
        $project: {
          name: 1,
          price: 1,
          image: 1,
          avgRating: 1,
          votes: 1,
          score: 1,
          restaurant: { _id: 1, name: 1, rating: 1 },
        },
      },
    ];

    const top = await MenuItem.aggregate(pipeline);
    res.json({ top });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics, getPopularDishes };
