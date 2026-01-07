const { validationResult } = require("express-validator");
const Order = require("../models/Order");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { restaurantId, items = [], totals, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    // Fetch menu items from DB to ensure authoritative pricing and offers
    const menuItemIds = items.map((it) => it.menuItem || it.id || it._id).filter(Boolean);
    const dbItems = await MenuItem.find({ _id: { $in: menuItemIds } }).populate("restaurant").lean();

    // Build normalized items with offer-aware pricing
    const normalizedItems = [];
    for (const it of items) {
      const mid = it.menuItem || it.id || it._id;
      const qty = Number(it.quantity || 1);
      const dbItem = dbItems.find((d) => String(d._id) === String(mid));
      if (!dbItem) return res.status(400).json({ message: `Menu item not found: ${mid}` });

      const now = new Date();
      const offerValid = (dbItem.discountPercent && Number(dbItem.discountPercent) > 0)
        && (!dbItem.offerExpires || new Date(dbItem.offerExpires) > now);

      const freeDeliveryApplied = !!dbItem.freeDelivery && (!dbItem.offerExpires || new Date(dbItem.offerExpires) > now);

      const originalPrice = Number(dbItem.price || 0);
      const discountPercent = offerValid ? Number(dbItem.discountPercent || 0) : 0;
      const discountedPrice = offerValid ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice;

      const line = {
        menuItem: dbItem._id,
        name: dbItem.name,
        // price is the effective charged price per unit
        price: discountedPrice,
        originalPrice,
        discountPercent,
        discountedPrice,
        freeDeliveryApplied: !!freeDeliveryApplied,
        offerExpires: dbItem.offerExpires || null,
        quantity: qty,
      };

      normalizedItems.push(line);
    }

    // Compute subtotal from normalizedItems
    const subtotal = normalizedItems.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 1), 0);

    // Determine delivery fee: if any item has freeDeliveryApplied true, waive delivery
    let deliveryFee = 0;
    const restaurant = await Restaurant.findById(restaurantId).lean();
    const defaultDeliveryFee = restaurant ? Number(restaurant.deliveryFee || 0) : Number(totals?.deliveryFee || 0);
    const anyFreeDelivery = normalizedItems.some((it) => it.freeDeliveryApplied);
    deliveryFee = anyFreeDelivery ? 0 : defaultDeliveryFee;

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
