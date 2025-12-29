import React, { useState } from "react";
import {
  ShoppingBag,
  MapPin,
  CreditCard,
  Minus,
  Plus,
  X,
  Truck,
  Store,
} from "lucide-react";

export const CheckoutPage = ({
  cart,
  selectedRestaurant,
  setCurrentPage,
  onRemoveFromCart,
  onAddToCart,
}) => {
  const [serviceType, setServiceType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const getTotalPrice = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee =
      cart.length > 0 && serviceType === "delivery"
        ? selectedRestaurant?.deliveryFee || 30
        : 0;
    return { subtotal, deliveryFee, total: subtotal + deliveryFee };
  };

  const { subtotal, deliveryFee, total } = getTotalPrice();

  const handleProceedToPayment = () => {
    // Validation
    if (serviceType === "delivery" && !deliveryAddress.trim()) {
      alert("Please enter your delivery address");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const customerData = JSON.parse(localStorage.getItem("user") || "{}");

      const order = {
        id: `ORDER-${Date.now()}`,
        items: cart,
        restaurant: selectedRestaurant.name,
        restaurantId: selectedRestaurant.id,
        serviceType,
        paymentMethod,
        deliveryAddress:
          serviceType === "delivery"
            ? deliveryAddress
            : selectedRestaurant.name,
        deliveryInstructions,
        subtotal,
        deliveryFee,
        total,
        status: "confirmed", // New order status
        createdAt: new Date().toLocaleDateString(),
        customerName: customerData.name || "Guest",
        customerPhone: customerData.phone || "N/A",
        customerEmail: customerData.email || "N/A",
      };

      // Save order to customer's orders
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push(order);
      localStorage.setItem("orders", JSON.stringify(orders));

      // Save order notification to restaurant/partner
      const restaurantOrders = JSON.parse(
        localStorage.getItem("partner-orders") || "[]"
      );
      restaurantOrders.push({
        ...order,
        notificationRead: false,
        notificationType: "new_order",
      });
      localStorage.setItem("partner-orders", JSON.stringify(restaurantOrders));

      setIsProcessing(false);
      setShowSuccess(true);

      // Show success message and redirect
      setTimeout(() => {
        alert(
          `✅ Order placed successfully!\n\nOrder ID: ${
            order.id
          }\nPayment Method: ${paymentMethod.toUpperCase()}\nTotal: ৳${total}\n\n✅ Restaurant has been notified!`
        );
        setCurrentPage("home");
      }, 1000);
    }, 2000);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <button
          onClick={() =>
            setCurrentPage(selectedRestaurant ? "restaurant" : "home")
          }
          className="text-orange-600 mb-6 flex items-center gap-2 hover:underline"
        >
          ← Continue shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ShoppingBag size={24} />
                Your Order
              </h2>
              {cart.length === 0 ? (
                <p className="text-gray-600">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 border-b pb-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">৳{item.price}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onAddToCart(item, item.restaurantId)}
                          className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(item.id, true)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Service Type Selection */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Service Type</h2>
              <div className="space-y-3">
                <label
                  className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition"
                  style={{
                    borderColor:
                      serviceType === "delivery" ? "#ea580c" : "#e5e7eb",
                  }}
                >
                  <input
                    type="radio"
                    name="service"
                    value="delivery"
                    checked={serviceType === "delivery"}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <Truck size={24} className="text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Delivery</p>
                    <p className="text-sm text-gray-600">
                      Get it delivered to your door
                    </p>
                  </div>
                  <span className="ml-auto font-semibold text-orange-600">
                    +৳{deliveryFee}
                  </span>
                </label>
                <label
                  className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition"
                  style={{
                    borderColor:
                      serviceType === "pickup" ? "#ea580c" : "#e5e7eb",
                  }}
                >
                  <input
                    type="radio"
                    name="service"
                    value="pickup"
                    checked={serviceType === "pickup"}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-4 h-4"
                  />
                  <Store size={24} className="text-orange-600" />
                  <div>
                    <p className="font-semibold text-gray-800">Pick-up</p>
                    <p className="text-sm text-gray-600">
                      Pick up from the restaurant
                    </p>
                  </div>
                  <span className="ml-auto font-semibold text-orange-600">
                    Free
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin size={24} />
                {serviceType === "delivery"
                  ? "Delivery Address"
                  : "Pick-up Details"}
              </h2>
              {serviceType === "delivery" ? (
                <>
                  <input
                    type="text"
                    placeholder="Enter your delivery address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                  <input
                    type="text"
                    placeholder="Add delivery instructions (optional)"
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
                  />
                </>
              ) : (
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 mb-2">
                    {selectedRestaurant?.name}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    📍{" "}
                    {selectedRestaurant?.address ||
                      "Address will be shown here"}
                  </p>
                  <p className="text-sm text-gray-600">
                    ⏰ Ready in ~{selectedRestaurant?.deliveryTime || "30"}{" "}
                    minutes
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard size={24} />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={paymentMethod === "bkash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="font-medium">bKash</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="nagad"
                    checked={paymentMethod === "nagad"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="font-medium">Nagad</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="rocket"
                    checked={paymentMethod === "rocket"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="font-medium">Rocket</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="payment"
                    value="sonali-bank"
                    checked={paymentMethod === "sonali-bank"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-orange-600"
                  />
                  <span className="font-medium">Sonali Bank</span>
                </label>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">৳{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">৳{deliveryFee}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-orange-600">৳{total}</span>
                </div>
              </div>
              <button
                onClick={handleProceedToPayment}
                disabled={cart.length === 0 || isProcessing}
                className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  isProcessing
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : cart.length === 0
                    ? "bg-gray-300 cursor-not-allowed text-gray-600"
                    : "bg-orange-600 text-white hover:bg-orange-700"
                }`}
              >
                <CreditCard size={20} />
                {isProcessing ? "Processing..." : "Proceed to Payment"}
              </button>

              {showSuccess && (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
                  ✅ Order Processing...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
