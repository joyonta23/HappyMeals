// Returns static analytics for now; replace with real aggregation later
const getAnalytics = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    // Placeholder data aligned with frontend structure
    const data = {
      dailySales: [
        { date: "2025-12-01", amount: 15420, orders: 45 },
        { date: "2025-12-02", amount: 18230, orders: 52 },
        { date: "2025-12-03", amount: 16890, orders: 48 },
        { date: "2025-12-04", amount: 21340, orders: 61 },
        { date: "2025-12-05", amount: 19650, orders: 56 },
        { date: "2025-12-06", amount: 22480, orders: 64 },
        { date: "2025-12-07", amount: 24120, orders: 69 }
      ],
      weeklySales: { current: 138130, previous: 125400, growth: 10.1 },
      monthlySales: { current: 556780, previous: 498230, growth: 11.7 },
      popularItems: [
        { name: "Whopper", orders: 234, revenue: 74880 },
        { name: "Chicken Royale", orders: 198, revenue: 55440 },
        { name: "French Fries", orders: 345, revenue: 41400 }
      ],
      expenses: {
        ingredients: 185000,
        labor: 95000,
        utilities: 15000,
        other: 25000,
        total: 320000
      },
      wastage: [
        { item: "Lettuce", amount: 2.5, cost: 450 },
        { item: "Tomatoes", amount: 1.8, cost: 320 },
        { item: "Cheese", amount: 0.9, cost: 680 },
        { item: "Bread Buns", amount: 15, cost: 450 }
      ],
      reviews: [
        { customer: "Ahmed R.", rating: 5, comment: "Excellent food quality!", date: "2025-12-07" },
        { customer: "Fatima K.", rating: 4, comment: "Good taste but slow delivery", date: "2025-12-06" },
        { customer: "Karim M.", rating: 5, comment: "Always fresh and delicious", date: "2025-12-06" },
        { customer: "Nadia S.", rating: 4, comment: "Great burgers, reasonable price", date: "2025-12-05" }
      ],
      averageRating: 4.5,
      totalOrders: 892,
      totalRevenue: 556780,
      partnerId,
    };

    res.json(data);
  } catch (err) {
    next(err);
  }
};

module.exports = { getAnalytics };
