const { validationResult } = require("express-validator");
const Order = require("../models/Order");

const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { restaurantId, items, totals, address } = req.body;
    const order = await Order.create({
      restaurant: restaurantId,
      items,
      totals,
      address,
      customer: req.user?.userId,
    });

    res.status(201).json({ orderId: order.id, status: order.status });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder };
