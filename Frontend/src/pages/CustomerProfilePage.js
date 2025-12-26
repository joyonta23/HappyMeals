import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Edit2,
  ShoppingBag,
  Heart,
  CreditCard,
  LogOut,
} from "lucide-react";
import { apiClient } from "../services/api";

export const CustomerProfilePage = ({ onLogout, onNavigate }) => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    country: "",
  });

  useEffect(() => {
    // Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      const primaryAddress = userData.addresses?.[0] || {};
      setEditForm({
        name: userData.name || "",
        phone: userData.phone || "",
        line1: primaryAddress.line1 || "",
        line2: primaryAddress.line2 || "",
        city: primaryAddress.city || "",
        country: primaryAddress.country || "",
      });
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      console.log("Sending profile data:", editForm);

      // Check if address fields have values
      if (!editForm.line1 && !editForm.city) {
        alert("Please fill in at least Street Address and City before saving!");
        return;
      }

      const response = await apiClient.updateCustomerProfile(editForm, token);
      console.log("Response from server:", response);

      if (response.user) {
        const updatedUser = { ...user, ...response.user };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Profile updated successfully! Check MongoDB Atlas now.");
      } else {
        alert(
          "Error updating profile: " + (response.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  const handleCancel = () => {
    const primaryAddress = user.addresses?.[0] || {};
    setEditForm({
      name: user.name || "",
      phone: user.phone || "",
      line1: primaryAddress.line1 || "",
      line2: primaryAddress.line2 || "",
      city: primaryAddress.city || "",
      country: primaryAddress.country || "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    onLogout();
    onNavigate("home");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "profile"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <User className="w-5 h-5" />
                Profile
              </div>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "orders"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Orders
              </div>
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "favorites"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Favorites
              </div>
            </button>
            <button
              onClick={() => setActiveTab("payment")}
              className={`flex-1 px-6 py-4 text-center font-medium transition ${
                activeTab === "payment"
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {activeTab === "profile" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800">{user.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Email
                    </label>
                    <p className="text-gray-800">{user.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        placeholder="Enter phone number"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800">
                        {user.phone || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Address
                    </label>
                    {isEditing ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.line1}
                          onChange={(e) =>
                            setEditForm({ ...editForm, line1: e.target.value })
                          }
                          placeholder="Street address (Line 1)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          value={editForm.line2}
                          onChange={(e) =>
                            setEditForm({ ...editForm, line2: e.target.value })
                          }
                          placeholder="Apartment, suite, etc. (Line 2)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) =>
                            setEditForm({ ...editForm, city: e.target.value })
                          }
                          placeholder="City"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                        <input
                          type="text"
                          value={editForm.country}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              country: e.target.value,
                            })
                          }
                          placeholder="Country"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    ) : (
                      <div className="text-gray-800">
                        {user.addresses && user.addresses.length > 0 ? (
                          <div>
                            <p>{user.addresses[0].line1}</p>
                            {user.addresses[0].line2 && (
                              <p>{user.addresses[0].line2}</p>
                            )}
                            <p>
                              {user.addresses[0].city},{" "}
                              {user.addresses[0].country}
                            </p>
                          </div>
                        ) : (
                          <p>Not provided</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Order History
              </h2>
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No orders yet</p>
                <p className="text-sm text-gray-500">
                  Start ordering delicious food from your favorite restaurants!
                </p>
                <button
                  onClick={() => onNavigate("home")}
                  className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Browse Restaurants
                </button>
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Favorite Restaurants
              </h2>
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No favorites yet</p>
                <p className="text-sm text-gray-500">
                  Add restaurants to your favorites to easily find them later!
                </p>
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Payment Methods
              </h2>
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">No payment methods added</p>
                <p className="text-sm text-gray-500">
                  Add a payment method for faster checkout
                </p>
                <button className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                  Add Payment Method
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
