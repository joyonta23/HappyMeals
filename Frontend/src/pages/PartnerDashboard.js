import React, { useState, useEffect } from "react";
import {
  Star,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Upload,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Settings,
  LogOut,
  CheckCircle,
  Truck,
  Store,
  CreditCard,
} from "lucide-react";
import { apiClient } from "../services/api";

export const PartnerDashboard = ({
  loggedInPartner,
  analyticsData,
  setCurrentPage,
}) => {
  const [timeframe, setTimeframe] = useState("daily");
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard', 'orders' or 'menu'
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeOfferItem, setActiveOfferItem] = useState(null);
  const [offerForm, setOfferForm] = useState({
    discountPercent: 0,
    freeDelivery: false,
    offerExpires: "",
  });
  const [menuLoading, setMenuLoading] = useState(false);
  const [incomingOrders, setIncomingOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const notificationKey = "partner-notifications";

  const restaurantId =
    loggedInPartner?.restaurant?._id || loggedInPartner?.restaurant?.id;

  // Load incoming orders from localStorage
  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem("partner-orders") || "[]");
    setIncomingOrders(orders);
  }, [activeTab]);

  const pushNotification = (message, orderId, type = "info") => {
    const list = JSON.parse(localStorage.getItem(notificationKey) || "[]");
    const entry = {
      id: `notif-${Date.now()}`,
      orderId,
      message,
      type,
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...list].slice(0, 50);
    localStorage.setItem(notificationKey, JSON.stringify(updated));
  };

  const updateCustomerOrderStatus = (orderId, status) => {
    const userOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updated = userOrders.map((o) =>
      o.id === orderId ? { ...o, status } : o,
    );
    localStorage.setItem("orders", JSON.stringify(updated));

    const userNotifs = JSON.parse(
      localStorage.getItem("user-notifications") || "[]",
    );
    const entry = {
      id: `unotif-${Date.now()}`,
      orderId,
      message:
        status === "accepted"
          ? `Your order ${orderId} was accepted!`
          : `Your order ${orderId} was rejected.`,
      type: status === "accepted" ? "success" : "error",
      read: false,
      createdAt: new Date().toISOString(),
    };
    const updatedNotifs = [entry, ...userNotifs].slice(0, 50);
    localStorage.setItem("user-notifications", JSON.stringify(updatedNotifs));
  };

  const handleAcceptOrder = async (orderId) => {
    const token = localStorage.getItem("partnerToken");
    if (!token) {
      alert("Please log in again.");
      return;
    }

    try {
      const response = await apiClient.updateOrderStatus(
        orderId,
        "accepted",
        token,
      );
      if (response?.order) {
        const orders = JSON.parse(
          localStorage.getItem("partner-orders") || "[]",
        );
        const updated = orders.map((o) =>
          o.id === orderId
            ? { ...o, status: "accepted", notificationRead: true }
            : o,
        );
        localStorage.setItem("partner-orders", JSON.stringify(updated));
        setIncomingOrders(updated);

        updateCustomerOrderStatus(orderId, "accepted");
        pushNotification(`Order ${orderId} accepted`, orderId, "success");
      }
    } catch (err) {
      console.error("Failed to accept order", err);
      alert("Could not accept order. Please try again.");
    }
  };

  const handleRejectOrder = async (orderId) => {
    const token = localStorage.getItem("partnerToken");
    if (!token) {
      alert("Please log in again.");
      return;
    }

    try {
      const response = await apiClient.updateOrderStatus(
        orderId,
        "rejected",
        token,
      );
      if (response?.order) {
        const orders = JSON.parse(
          localStorage.getItem("partner-orders") || "[]",
        );
        const updated = orders.map((o) =>
          o.id === orderId
            ? { ...o, status: "rejected", notificationRead: true }
            : o,
        );
        localStorage.setItem("partner-orders", JSON.stringify(updated));
        setIncomingOrders(updated);

        updateCustomerOrderStatus(orderId, "rejected");
        pushNotification(`Order ${orderId} rejected`, orderId, "error");
      }
    } catch (err) {
      console.error("Failed to reject order", err);
      alert("Could not reject order. Please try again.");
    }
  };

  useEffect(() => {
    const loadReviews = async () => {
      if (!restaurantId) return;
      try {
        setReviewsLoading(true);
        const data = await apiClient.getRestaurantReviews(restaurantId);
        if (Array.isArray(data)) {
          setReviews(data);
        }
      } catch (err) {
        console.error("Failed to load reviews", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [restaurantId]);

  // Menu state
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Chicken Biryani",
      category: "Main Course",
      price: 250,
      description: "Delicious aromatic rice with tender chicken",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=300&h=300&fit=crop",
      available: true,
      preparationTime: "30 mins",
    },
    {
      id: 2,
      name: "Beef Burger",
      category: "Burgers",
      price: 180,
      description: "Juicy beef patty with fresh vegetables",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=300&fit=crop",
      available: true,
      preparationTime: "15 mins",
    },
    {
      id: 3,
      name: "Chocolate Cake",
      category: "Desserts",
      price: 120,
      description: "Rich chocolate cake with frosting",
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
      available: false,
      preparationTime: "10 mins",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    image: "",
    available: true,
    preparationTime: "",
    // Chatbot fields
    dietary: "non-vegetarian",
    spiceLevel: "medium",
    allergens: [],
    isSide: false,
    popularityScore: 50,
  });

  const categories = [
    "All",
    "Main Course",
    "Appetizers",
    "Burgers",
    "Pizza",
    "Desserts",
    "Beverages",
    "Sides",
  ];

  const revenue = analyticsData.totalRevenue;
  const expenses = analyticsData.expenses.total;
  const profit = revenue - expenses;
  const profitMargin = ((profit / revenue) * 100).toFixed(1);

  const reviewList = reviews.length ? reviews : analyticsData.reviews;
  const averageRatingDisplay = reviewList.length
    ? Math.round(
        (reviewList.reduce((sum, r) => sum + (r.rating || 0), 0) /
          reviewList.length) *
          10,
      ) / 10
    : analyticsData.averageRating;
  const reviewCount = reviewList.length || analyticsData.reviews.length;

  // Menu Management Functions
  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "",
      price: "",
      description: "",
      image: "",
      available: true,
      preparationTime: "",
    });
    setShowMenuModal(true);
  };

  // Fetch menu items from backend when menu tab is active
  React.useEffect(() => {
    const loadMenuFromApi = async () => {
      const restaurantId =
        loggedInPartner?.restaurant?._id ||
        loggedInPartner?.restaurant?.id ||
        loggedInPartner?.restaurantId;
      if (!restaurantId) return;
      try {
        setMenuLoading(true);
        const data = await apiClient.getRestaurantById(restaurantId);
        if (data?.items && Array.isArray(data.items)) {
          setMenuItems(data.items);
        }
      } catch (err) {
        console.error("Failed to load menu items", err);
      } finally {
        setMenuLoading(false);
      }
    };

    if (activeTab === "menu") {
      loadMenuFromApi();
    }
  }, [activeTab, loggedInPartner]);

  const handleEditItem = (item) => {
    setEditingItem(item);
    setFormData(item);
    setShowMenuModal(true);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setMenuItems(menuItems.filter((item) => item.id !== id));
    }
  };

  const handleUpdateOffer = async (itemId, offer) => {
    const isMongoId = /^[a-f\d]{24}$/i.test(String(itemId));
    if (!itemId || !isMongoId) {
      alert("This item cannot be updated until it is saved in the database.");
      return;
    }
    const token = localStorage.getItem("partnerToken");
    if (!token) {
      alert("Please log in again to update offers.");
      return;
    }
    try {
      const payload = {
        discountPercent: offer.discountPercent,
        freeDelivery: !!offer.freeDelivery,
        offerExpires: offer.offerExpires || null,
      };
      const res = await apiClient.updateItemOffer(itemId, payload, token);
      if (res?.item) {
        setMenuItems((prev) =>
          prev.map((it) =>
            String(it._id || it.id) === String(itemId)
              ? { ...it, ...res.item }
              : it,
          ),
        );
        setActiveOfferItem(null);
        alert("Offer updated");
      } else if (res?.errors) {
        alert("Validation error: " + res.errors.map((e) => e.msg).join(", "));
      } else {
        alert(res?.message || "Could not update offer");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating offer");
    }
  };

  const handleToggleAvailability = (id) => {
    setMenuItems(
      menuItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item,
      ),
    );
  };

  const handleSaveItem = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in the required fields: name and price");
      return;
    }

    // For now, only persist creation; editing existing mock items will remain local
    if (!editingItem) {
      const token = localStorage.getItem("partnerToken");
      if (!token) {
        alert("Please log in again to add items.");
        return;
      }
      try {
        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("category", formData.category);
        fd.append("price", String(formData.price));
        if (formData.description)
          fd.append("description", formData.description);
        if (formData.preparationTime)
          fd.append("preparationTime", formData.preparationTime);
        fd.append("available", formData.available ? "true" : "false");
        if (formData.image) fd.append("imageUrl", formData.image);

        // Add chatbot fields
        fd.append("dietary", formData.dietary);
        fd.append("spiceLevel", formData.spiceLevel);
        fd.append("allergens", JSON.stringify(formData.allergens));
        fd.append("isSide", String(formData.isSide));
        fd.append("popularityScore", String(formData.popularityScore));

        const res = await apiClient.addMenuItem(fd, token);
        if (res?.item) {
          // Prepend the saved item (with real _id) and close modal
          setMenuItems((prev) => [res.item, ...prev]);
          setShowMenuModal(false);
          setEditingItem(null);
          setFormData({
            name: "",
            category: "",
            price: "",
            description: "",
            image: "",
            available: true,
            preparationTime: "",
            // Chatbot fields
            dietary: "non-vegetarian",
            spiceLevel: "medium",
            allergens: [],
            isSide: false,
            popularityScore: 50,
          });
          alert("Menu item saved");
        } else if (res?.errors) {
          alert("Validation error: " + res.errors.map((e) => e.msg).join(", "));
        } else {
          alert(res?.message || "Could not save item");
        }
      } catch (err) {
        console.error("Error saving item", err);
        alert("Error saving item");
      }
    } else {
      // Keep existing local edit behavior (no backend endpoint yet)
      setMenuItems(
        menuItems.map((item) =>
          item.id === editingItem.id
            ? { ...formData, id: editingItem.id }
            : item,
        ),
      );
      setShowMenuModal(false);
      setEditingItem(null);
    }
  };

  const getFilteredMenuItems = () => {
    let filtered = menuItems;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) =>
          item.category.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (item) =>
          (item.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description || "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  };

  // Offer summary chips for menu tab
  const nowForOffers = new Date();
  const activeDealCount = menuItems.filter((it) => {
    const expiresAt = it?.offerExpires ? new Date(it.offerExpires) : null;
    return (
      Number(it?.discountPercent || 0) > 0 &&
      (!expiresAt || expiresAt > nowForOffers)
    );
  }).length;
  const activeFreeDeliveryCount = menuItems.filter((it) => {
    const expiresAt = it?.offerExpires ? new Date(it.offerExpires) : null;
    return !!it?.freeDelivery && (!expiresAt || expiresAt > nowForOffers);
  }).length;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Partner Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {loggedInPartner.ownerName}!
              </p>
              <p className="text-sm text-gray-500">
                {loggedInPartner.restaurantName}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setCurrentPage("shop-management")}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
              >
                <Settings size={18} />
                Shop Management
              </button>
              <button
                onClick={() => setCurrentPage("partner-settings")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
              >
                <Settings size={18} />
                Settings
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem("partnerToken");
                  localStorage.removeItem("partner");
                  setCurrentPage("home");
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
          {activeTab === "dashboard" && (
            <div className="flex gap-2">
              <button
                onClick={() => setTimeframe("daily")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeframe === "daily"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeframe("weekly")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeframe === "weekly"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeframe("monthly")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  timeframe === "monthly"
                    ? "bg-orange-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                Monthly
              </button>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-4 border-b">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === "dashboard"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === "orders"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              📦 Incoming Orders
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                activeTab === "menu"
                  ? "border-orange-600 text-orange-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              🍽️ Menu Management
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === "dashboard" ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">
                    Total Revenue
                  </h3>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <span className="text-2xl">💰</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  ৳{revenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-2">
                  +11.7% from last month
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">
                    Total Orders
                  </h3>
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <span className="text-2xl">📦</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {analyticsData.totalOrders}
                </p>
                <p className="text-sm text-blue-600 mt-2">Last 30 days</p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">Profit</h3>
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <span className="text-2xl">📈</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  ৳{profit.toLocaleString()}
                </p>
                <p className="text-sm text-purple-600 mt-2">
                  Margin: {profitMargin}%
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-gray-600 text-sm font-medium">
                    Average Rating
                  </h3>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-800">
                  {averageRatingDisplay}
                </p>
                <p className="text-sm text-yellow-600 mt-2">
                  From {reviewCount} reviews
                </p>
              </div>
            </div>

            {/* Rating Breakdown - Only visible to partners */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 hover-lift">
              <h2 className="text-xl font-bold mb-6">Rating Breakdown</h2>
              <div className="grid grid-cols-5 gap-4">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = analyticsData.ratingBreakdown?.[stars] || 0;
                  const percentage =
                    reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                  return (
                    <div key={stars} className="text-center">
                      <div className="mb-2">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={
                                i < stars
                                  ? "text-yellow-500 fill-yellow-500"
                                  : "text-gray-300"
                              }
                            />
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {stars}★
                        </p>
                      </div>
                      <div className="bg-gray-200 rounded-full h-16 flex flex-col items-center justify-center">
                        <p className="text-lg font-bold text-gray-800">
                          {count}
                        </p>
                        <p className="text-xs text-gray-600">
                          {percentage.toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sales Chart */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8 hover-lift">
              <h2 className="text-xl font-bold mb-6">
                Sales Trend (Last 7 Days)
              </h2>
              <div className="space-y-4">
                {analyticsData.dailySales.map((day, idx) => {
                  const maxAmount = Math.max(
                    ...analyticsData.dailySales.map((d) => d.amount),
                  );
                  const width = (day.amount / maxAmount) * 100;
                  return (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          {day.date}
                        </span>
                        <span className="text-sm font-bold text-gray-800">
                          ৳{day.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-gray-200 rounded-full h-8 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-orange-600 h-full flex items-center justify-end pr-3 transition-all duration-500"
                          style={{ width: `${width}%` }}
                        >
                          <span className="text-white text-xs font-semibold">
                            {day.orders} orders
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Popular Items */}
              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <h2 className="text-xl font-bold mb-6">Popular Items</h2>
                <div className="space-y-4">
                  {analyticsData.popularItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b pb-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-orange-100 text-orange-600 w-10 h-10 rounded-full flex items-center justify-center font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.orders} orders
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-800">
                          ৳{item.revenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Revenue vs Expenses */}
              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <h2 className="text-xl font-bold mb-6">Revenue vs Expenses</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Revenue
                      </span>
                      <span className="text-sm font-bold text-green-600">
                        ৳{revenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-green-500 h-full transition-all duration-500"
                        style={{ width: "100%" }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Ingredients
                      </span>
                      <span className="text-sm font-bold text-red-600">
                        ৳{analyticsData.expenses.ingredients.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-red-400 h-full transition-all duration-500"
                        style={{
                          width: `${
                            (analyticsData.expenses.ingredients / revenue) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Labor
                      </span>
                      <span className="text-sm font-bold text-orange-600">
                        ৳{analyticsData.expenses.labor.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-orange-400 h-full transition-all duration-500"
                        style={{
                          width: `${
                            (analyticsData.expenses.labor / revenue) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Utilities
                      </span>
                      <span className="text-sm font-bold text-blue-600">
                        ৳{analyticsData.expenses.utilities.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-blue-400 h-full transition-all duration-500"
                        style={{
                          width: `${
                            (analyticsData.expenses.utilities / revenue) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">
                        Other
                      </span>
                      <span className="text-sm font-bold text-purple-600">
                        ৳{analyticsData.expenses.other.toLocaleString()}
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-purple-400 h-full transition-all duration-500"
                        style={{
                          width: `${
                            (analyticsData.expenses.other / revenue) * 100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">
                        Net Profit
                      </span>
                      <span className="font-bold text-xl text-green-600">
                        ৳{profit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Wastage Tracker */}
              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <h2 className="text-xl font-bold mb-6">Wastage Tracker</h2>
                <div className="space-y-4">
                  {analyticsData.wastage.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between border-b pb-3"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {item.item}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.amount} kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">৳{item.cost}</p>
                        <p className="text-xs text-gray-500">Loss</p>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800">
                        Total Wastage
                      </span>
                      <span className="font-bold text-red-600">
                        ৳
                        {analyticsData.wastage
                          .reduce((sum, w) => sum + w.cost, 0)
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6 hover-lift">
                <h2 className="text-xl font-bold mb-6">
                  Recent Customer Reviews
                </h2>
                {reviewsLoading && (
                  <p className="text-sm text-gray-500">Loading reviews...</p>
                )}
                <div className="space-y-4">
                  {reviewList.map((review, idx) => {
                    const name =
                      review.userName || review.customer || "Customer";
                    const date = review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : review.date;
                    return (
                      <div key={review._id || idx} className="border-b pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-gray-800">
                            {name}
                          </span>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600 mb-1">
                            {review.comment}
                          </p>
                        )}
                        {date && (
                          <p className="text-xs text-gray-500">{date}</p>
                        )}
                      </div>
                    );
                  })}
                  {reviewList.length === 0 && !reviewsLoading && (
                    <p className="text-sm text-gray-500">No reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : activeTab === "orders" ? (
          <>
            {/* Incoming Orders Section */}
            <div className="space-y-6">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">
                  📦 Incoming Orders
                </h2>
                <p className="text-gray-600">
                  {incomingOrders.length > 0
                    ? `You have ${incomingOrders.length} order${
                        incomingOrders.length !== 1 ? "s" : ""
                      }`
                    : "No incoming orders at the moment"}
                </p>
              </div>

              {incomingOrders.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-lg shadow-md">
                  <div className="text-6xl mb-4">📭</div>
                  <p className="text-gray-600 text-xl mb-6">
                    No orders yet. Check back soon!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {incomingOrders.map((order, idx) => (
                    <div
                      key={order.id || `order-${idx}`}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow border-l-4 border-orange-600 p-6"
                    >
                      {/* Order Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            Order #{order.id?.substring(0, 8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                        <div className="bg-green-100 px-4 py-2 rounded-full">
                          <span className="text-green-700 font-semibold text-sm">
                            ✓ Confirmed
                          </span>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-semibold text-sm">
                            Customer:
                          </span>
                          <span className="text-gray-800">
                            {order.customerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-semibold text-sm">
                            Phone:
                          </span>
                          <span className="text-gray-800">
                            {order.customerPhone}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-600 font-semibold text-sm">
                            Email:
                          </span>
                          <span className="text-gray-800 truncate">
                            {order.customerEmail}
                          </span>
                        </div>
                      </div>

                      {/* Service Type & Delivery Info */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          {order.serviceType === "delivery" ? (
                            <Truck size={18} className="text-blue-600" />
                          ) : (
                            <Store size={18} className="text-purple-600" />
                          )}
                          <span className="font-semibold text-gray-700">
                            {order.serviceType === "delivery"
                              ? "Delivery"
                              : "Pick-up"}
                          </span>
                        </div>
                        {order.serviceType === "delivery" && (
                          <div className="bg-blue-50 rounded-lg p-3 ml-6">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold">Address:</span>{" "}
                              {order.deliveryAddress}
                            </p>
                            {order.deliveryInstructions && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-semibold">
                                  Instructions:
                                </span>{" "}
                                {order.deliveryInstructions}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div className="mb-4 border-y border-gray-200 py-4">
                        <h4 className="font-semibold text-gray-700 mb-3">
                          Items:
                        </h4>
                        <div className="space-y-2">
                          {order.items.map((item, itemIdx) => (
                            <div
                              key={`${order.id}-item-${itemIdx}`}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-800">
                                {item.name} x{item.quantity}
                              </span>
                              <span className="font-semibold text-gray-800">
                                ৳{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>Subtotal:</span>
                          <span>
                            ৳{order.subtotal?.toLocaleString() || "0"}
                          </span>
                        </div>
                        {order.deliveryFee > 0 && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Delivery Fee:</span>
                            <span>৳{order.deliveryFee?.toLocaleString()}</span>
                          </div>
                        )}
                        <div className="flex justify-between border-t pt-2">
                          <span className="font-bold text-gray-800">
                            Total:
                          </span>
                          <span className="text-xl font-bold text-orange-600">
                            ৳{order.total?.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="mb-4 bg-yellow-50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <CreditCard size={18} className="text-yellow-600" />
                          <span className="text-sm text-gray-700">
                            <span className="font-semibold">Payment:</span>{" "}
                            {order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          {order.status === "accepted"
                            ? "Accepted"
                            : "Accept Order"}
                        </button>
                        <button
                          onClick={() => handleRejectOrder(order.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2"
                        >
                          <X size={18} />
                          {order.status === "rejected" ? "Rejected" : "Reject"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* Menu Management Section */
          <>
            {/* Menu Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  Menu Management
                </h2>
                <p className="text-gray-600 mt-1">
                  Manage your restaurant menu items
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeDealCount > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
                      {activeDealCount} item{activeDealCount > 1 ? "s" : ""} on
                      deal
                    </span>
                  )}
                  {activeFreeDeliveryCount > 0 && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                      {activeFreeDeliveryCount} item
                      {activeFreeDeliveryCount > 1 ? "s" : ""} free delivery
                    </span>
                  )}
                  {menuLoading && (
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                      Loading menu…
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddItem}
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all hover:shadow-xl hover:scale-105"
              >
                <Plus size={22} />
                Add New Item
              </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Category Filter */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() =>
                        setSelectedCategory(category.toLowerCase())
                      }
                      className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                        selectedCategory === category.toLowerCase()
                          ? "bg-orange-600 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Menu Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredMenuItems().map((item) => (
                <div
                  key={item._id || item.id || `item-${Math.random()}`}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover-lift transition"
                >
                  {/* Item Image */}
                  <div className="relative h-48">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Availability Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.available
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {item.available ? "✓ Available" : "✗ Out of Stock"}
                      </span>
                    </div>
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Item Details */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign size={18} className="text-green-600" />
                        <span className="text-2xl font-bold text-gray-800">
                          ৳{item.price}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        ⏱️ {item.preparationTime}
                      </div>
                    </div>

                    {/* Offer badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {Number(item.discountPercent || 0) > 0 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
                          {Number(item.discountPercent)}% OFF
                        </span>
                      )}
                      {item.freeDelivery && (
                        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700 font-semibold">
                          Free delivery
                        </span>
                      )}
                      {item.offerExpires && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                          Until{" "}
                          {new Date(item.offerExpires)
                            .toISOString()
                            .slice(0, 10)}
                        </span>
                      )}
                      {/* Chatbot badges */}
                      {item.dietary && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-700 font-semibold">
                          {(() => {
                            const dietary = Array.isArray(item.dietary)
                              ? item.dietary[0]
                              : item.dietary;
                            return dietary === "non-vegetarian"
                              ? "🍖"
                              : dietary === "vegetarian"
                                ? "🥗"
                                : dietary === "vegan"
                                  ? "🌱"
                                  : "🐟";
                          })()}{" "}
                          {Array.isArray(item.dietary)
                            ? item.dietary[0]
                            : item.dietary}
                        </span>
                      )}
                      {item.spiceLevel && item.spiceLevel !== "medium" && (
                        <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-700 font-semibold">
                          🌶️ {item.spiceLevel}
                        </span>
                      )}
                      {item.isSide && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700 font-semibold">
                          Side dish
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleToggleAvailability(item.id)}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                          item.available
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                      >
                        {item.available ? (
                          <ToggleRight size={18} />
                        ) : (
                          <ToggleLeft size={18} />
                        )}
                        {item.available ? "Available" : "Unavailable"}
                      </button>
                      <button
                        onClick={() => handleEditItem(item)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 size={18} />
                      </button>
                      {(() => {
                        const itemId = item._id || item.id;
                        const hasMongoId = /^[a-f\d]{24}$/i.test(
                          String(itemId),
                        );
                        if (!hasMongoId) {
                          return (
                            <button
                              disabled
                              title="Save this item first to enable offers"
                              className="px-4 py-2 bg-gray-200 text-gray-500 rounded-lg cursor-not-allowed"
                            >
                              Edit Offer
                            </button>
                          );
                        }
                        return (
                          <button
                            onClick={() => {
                              const expires = item.offerExpires
                                ? new Date(item.offerExpires)
                                    .toISOString()
                                    .slice(0, 10)
                                : "";
                              setActiveOfferItem(
                                String(activeOfferItem) === String(itemId)
                                  ? null
                                  : itemId,
                              );
                              setOfferForm({
                                discountPercent: Number(
                                  item.discountPercent || 0,
                                ),
                                freeDelivery: !!item.freeDelivery,
                                offerExpires: expires,
                              });
                            }}
                            className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition"
                          >
                            Edit Offer
                          </button>
                        );
                      })()}
                    </div>

                    {String(activeOfferItem) ===
                      String(item._id || item.id) && (
                      <div className="mt-3 p-3 border border-orange-200 rounded-lg bg-orange-50 space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              Discount %
                            </label>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={offerForm.discountPercent}
                              onChange={(e) =>
                                setOfferForm({
                                  ...offerForm,
                                  discountPercent: Number(e.target.value || 0),
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </div>
                          <div className="flex items-end">
                            <label className="inline-flex items-center gap-2 text-sm">
                              <input
                                type="checkbox"
                                checked={offerForm.freeDelivery}
                                onChange={(e) =>
                                  setOfferForm({
                                    ...offerForm,
                                    freeDelivery: e.target.checked,
                                  })
                                }
                              />
                              Free delivery
                            </label>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-700 mb-1">
                              Expires on
                            </label>
                            <input
                              type="date"
                              value={offerForm.offerExpires}
                              onChange={(e) =>
                                setOfferForm({
                                  ...offerForm,
                                  offerExpires: e.target.value,
                                })
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setActiveOfferItem(null)}
                            className="px-3 py-2 border border-gray-300 rounded text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateOffer(item._id || item.id, {
                                discountPercent: offerForm.discountPercent,
                                freeDelivery: offerForm.freeDelivery,
                                offerExpires: offerForm.offerExpires || null,
                              })
                            }
                            className="px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700"
                          >
                            Save Offer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {getFilteredMenuItems().length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-gray-600 text-xl mb-6">
                  No menu items found
                </p>
                <button
                  onClick={handleAddItem}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg"
                >
                  Add Your First Item
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showMenuModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingItem ? "✏️ Edit Menu Item" : "➕ Add New Menu Item"}
              </h2>
              <button
                onClick={() => setShowMenuModal(false)}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Chicken Biryani"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select a category</option>
                  {categories
                    .filter((c) => c !== "All")
                    .map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                </select>
              </div>

              {/* Price and Prep Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (৳) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="250"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preparation Time
                  </label>
                  <input
                    type="text"
                    value={formData.preparationTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        preparationTime: e.target.value,
                      })
                    }
                    placeholder="30 mins"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Describe your dish..."
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition flex items-center gap-2">
                    <Upload size={18} />
                    Upload
                  </button>
                </div>
                {formData.image && (
                  <div className="mt-3">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded-xl border-2 border-gray-200"
                    />
                  </div>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.available}
                    onChange={(e) =>
                      setFormData({ ...formData, available: e.target.checked })
                    }
                    className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-300"
                  />
                  <span className="font-semibold text-gray-700">
                    Item is available for order
                  </span>
                </label>
              </div>

              {/* Chatbot Fields Section */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  🤖 Chatbot Information
                </h3>

                {/* Dietary */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dietary Type
                  </label>
                  <select
                    value={formData.dietary || "non-vegetarian"}
                    onChange={(e) =>
                      setFormData({ ...formData, dietary: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non-vegetarian">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="pescatarian">Pescatarian</option>
                  </select>
                </div>

                {/* Spice Level */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Spice Level
                  </label>
                  <select
                    value={formData.spiceLevel || "medium"}
                    onChange={(e) =>
                      setFormData({ ...formData, spiceLevel: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="mild">Mild</option>
                    <option value="medium">Medium</option>
                    <option value="hot">Hot</option>
                    <option value="extra-hot">Extra Hot</option>
                  </select>
                </div>

                {/* Allergens */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Allergens
                  </label>
                  <div className="space-y-2">
                    {[
                      "Peanuts",
                      "Tree Nuts",
                      "Dairy",
                      "Eggs",
                      "Soy",
                      "Wheat",
                      "Sesame",
                      "Fish",
                    ].map((allergen) => (
                      <label key={allergen} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={(formData.allergens || []).includes(
                            allergen,
                          )}
                          onChange={(e) => {
                            const currentAllergens = formData.allergens || [];
                            const newAllergens = e.target.checked
                              ? [...currentAllergens, allergen]
                              : currentAllergens.filter((a) => a !== allergen);
                            setFormData({
                              ...formData,
                              allergens: newAllergens,
                            });
                          }}
                          className="w-4 h-4 text-orange-600 rounded focus:ring-2 focus:ring-orange-300"
                        />
                        <span className="text-gray-700 text-sm">
                          {allergen}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Is Side */}
                <div className="mt-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isSide || false}
                      onChange={(e) =>
                        setFormData({ ...formData, isSide: e.target.checked })
                      }
                      className="w-5 h-5 text-orange-600 rounded focus:ring-2 focus:ring-orange-300"
                    />
                    <span className="font-semibold text-gray-700">
                      This is a side dish
                    </span>
                  </label>
                </div>

                {/* Popularity Score */}
                <div className="mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Popularity Score (0-100)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.popularityScore || 50}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          popularityScore: parseInt(e.target.value),
                        })
                      }
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                    />
                    <span className="text-lg font-bold text-orange-600 min-w-12 text-right">
                      {formData.popularityScore || 50}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t">
              <button
                onClick={() => setShowMenuModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all"
              >
                {editingItem ? "Update Item" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
