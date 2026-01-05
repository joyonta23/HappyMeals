const { validationResult } = require("express-validator");
const Order = require("../models/Order");

const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { restaurantId, items = [], totals, address } = req.body;

    // Normalize items to ensure required fields exist
    const normalizedItems = items.map((it) => ({
      menuItem: it.menuItem || it.id || it._id,
      name: it.name,
      price: Number(it.price),
      quantity: Number(it.quantity || 1),
    }));

    const subtotal = normalizedItems.reduce(
      (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1),
      0
    );
    const deliveryFee = Number(totals?.deliveryFee ?? 0);
    const total = Number(totals?.total ?? subtotal + deliveryFee);

    const orderId = `ORDER-${Date.now()}`;

    const order = await Order.create({
      orderId,
      restaurant: restaurantId,
      items: normalizedItems,
      totals: {
        subtotal,
        deliveryFee,
        total,
      },
      address,
      customer: req.user?.userId,
    });

    res.status(201).json({ orderId: order.orderId, status: order.status });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "pending",
      "preparing",
      "on-the-way",
      "delivered",
      "cancelled",
      "accepted",
      "rejected",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    next(err);
  }
};

module.exports = { createOrder, updateOrderStatus };
