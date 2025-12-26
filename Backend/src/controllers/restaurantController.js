const Restaurant = require("../models/Restaurant");
const MenuItem = require("../models/MenuItem");

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
          image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
          city: "Chattogram",
        },
        {
          _id: "mock-2",
          name: "Astana",
          cuisine: "Bangali food",
          rating: 4.3,
          deliveryFee: 35,
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
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
          image: id === "mock-1"
            ? "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop"
            : "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
          items: [
            { id: 1, name: "Sample Item", price: 250, description: "Placeholder item", image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=150&fit=crop" },
          ],
        });
      }
      return res.status(404).json({ message: "Restaurant not found" });
    }
    const items = await MenuItem.find({ restaurant: id, available: true }).lean();
    res.json({ ...restaurant, items });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRestaurants, getRestaurantById };
