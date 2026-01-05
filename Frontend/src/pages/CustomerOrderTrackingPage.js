import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Clock,
  Truck,
  Store,
  CheckCircle,
  AlertCircle,
  ChevronDown,
} from "lucide-react";

export const CustomerOrderTrackingPage = ({ setCurrentPage }) => {
  const [orders, setOrders] = useState([]);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    const userOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(userOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "accepted":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "preparing":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "on-the-way":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock size={18} />;
      case "accepted":
        return <CheckCircle size={18} />;
      case "preparing":
        return <Store size={18} />;
      case "on-the-way":
        return <Truck size={18} />;
      case "delivered":
        return <CheckCircle size={18} />;
      case "rejected":
        return <AlertCircle size={18} />;
      default:
        return <AlertCircle size={18} />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "pending":
        return "Awaiting Confirmation";
      case "accepted":
        return "Accepted";
      case "preparing":
        return "Preparing";
      case "on-the-way":
        return "On the Way";
      case "delivered":
        return "Delivered";
      case "rejected":
        return "Rejected";
      default:
        return "Unknown";
    }
  };

  const getProgressPercentage = (status) => {
    const statuses = ["pending", "accepted", "preparing", "on-the-way", "delivered"];
    const index = statuses.indexOf(status);
    return index === -1 ? 0 : ((index + 1) / statuses.length) * 100;
  };

  const renderStatusTimeline = (status) => {
    const statuses = [
      { key: "pending", label: "Order Placed", icon: "📝" },
      { key: "accepted", label: "Accepted", icon: "✓" },
      { key: "preparing", label: "Preparing", icon: "👨‍🍳" },
      { key: "on-the-way", label: "On the Way", icon: "🚚" },
      { key: "delivered", label: "Delivered", icon: "✅" },
    ];

    const currentIndex = statuses.findIndex((s) => s.key === status);

    return (
      <div className="my-4">
        <div className="flex justify-between items-center relative">
          {statuses.map((s, idx) => (
            <div key={s.key} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition ${
                  idx <= currentIndex
                    ? "bg-green-500 text-white shadow-lg scale-110"
                    : "bg-gray-300 text-white"
                }`}
              >
                {s.icon}
              </div>
              <p className="text-xs font-semibold text-center mt-2 text-gray-700">
                {s.label}
              </p>
            </div>
          ))}

          {/* Progress Bar */}
          <div
            className="absolute top-5 left-0 right-0 h-1 bg-gray-300"
            style={{ zIndex: -1 }}
          >
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${getProgressPercentage(status)}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-orange-600 mb-6 flex items-center gap-2 hover:underline"
          >
            ← Back to Home
          </button>
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start ordering delicious food now!
            </p>
            <button
              onClick={() => setCurrentPage("home")}
              className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Order Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-orange-600 flex items-center gap-2 hover:underline mb-4"
          >
            ← Back to Home
          </button>
          <h1 className="text-4xl font-bold text-gray-800">Order Tracking</h1>
          <p className="text-gray-600 mt-2">Track the status of your orders</p>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Order Header */}
              <div
                className="p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition"
                onClick={() =>
                  setExpandedOrderId(
                    expandedOrderId === order.id ? null : order.id
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{order.id}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm opacity-90">
                      <span>📍 {order.restaurant}</span>
                      <span>🕐 {new Date(order.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`transform transition ${
                      expandedOrderId === order.id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* Order Details (Expandable) */}
              {expandedOrderId === order.id && (
                <div className="p-6 border-t">
                  {/* Status Timeline */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-gray-800 mb-4">Delivery Progress</h4>
                    {renderStatusTimeline(order.status)}
                  </div>

                  {/* Order Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">
                        Delivery Details
                      </h5>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="text-orange-600 mt-0.5" />
                          <div>
                            <p className="font-semibold">Address</p>
                            <p>{order.deliveryAddress}</p>
                          </div>
                        </div>
                        {order.serviceType === "delivery" && (
                          <div className="flex items-start gap-2">
                            <Clock size={16} className="text-orange-600 mt-0.5" />
                            <div>
                              <p className="font-semibold">Estimated Time</p>
                              <p>~30 minutes from acceptance</p>
                            </div>
                          </div>
                        )}
                        {order.deliveryInstructions && (
                          <div>
                            <p className="font-semibold">Special Instructions</p>
                            <p className="text-gray-600">{order.deliveryInstructions}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h5 className="font-semibold text-gray-800 mb-3">Order Summary</h5>
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold">৳{order.subtotal}</span>
                        </div>
                        {order.deliveryFee > 0 && (
                          <div className="flex justify-between">
                            <span>Delivery Fee</span>
                            <span className="font-semibold">৳{order.deliveryFee}</span>
                          </div>
                        )}
                        <div className="border-t pt-2 flex justify-between">
                          <span className="font-bold">Total</span>
                          <span className="font-bold text-orange-600">
                            ৳{order.total}
                          </span>
                        </div>
                        <div className="mt-2 pt-2 border-t">
                          <span className="text-xs text-gray-500">
                            Payment: {order.paymentMethod.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-800 mb-3">Items</h5>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              ৳{item.price} × {item.quantity}
                            </p>
                          </div>
                          <p className="font-semibold text-gray-800">
                            ৳{item.price * item.quantity}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Need help?</span> Contact the restaurant at
                      your phone or check your notifications for updates.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
