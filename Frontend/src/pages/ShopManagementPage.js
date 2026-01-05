import React, { useState, useEffect } from "react";
import {
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Clock,
} from "lucide-react";

export const ShopManagementPage = ({ partnerData, setCurrentPage }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [shopData, setShopData] = useState({
    name: "",
    cuisine: "",
    address: "",
    phone: "",
    deliveryFee: 30,
    deliveryTime: "30",
    serviceTypes: [],
  });
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
  });
  const [showAddItem, setShowAddItem] = useState(false);

  useEffect(() => {
    // Initialize with partner data from localStorage
    const partner = JSON.parse(localStorage.getItem("partner") || "{}");
    setShopData({
      name: partner.restaurantName || "",
      cuisine: partner.cuisine || "",
      address: partner.address || "",
      phone: partner.phone || "",
      deliveryFee: partner.deliveryFee || 30,
      deliveryTime: partner.deliveryTime || "30",
      serviceTypes: partner.serviceTypes || ["delivery"],
    });
    setItems(partner.items || []);
  }, []);

  const handleUpdateShop = () => {
    const partner = JSON.parse(localStorage.getItem("partner") || "{}");
    const updatedPartner = {
      ...partner,
      restaurantName: shopData.name,
      cuisine: shopData.cuisine,
      address: shopData.address,
      phone: shopData.phone,
      deliveryFee: parseInt(shopData.deliveryFee),
      deliveryTime: shopData.deliveryTime,
      serviceTypes: shopData.serviceTypes,
      items,
    };
    localStorage.setItem("partner", JSON.stringify(updatedPartner));
    setIsEditing(false);
    alert("Shop details updated successfully!");
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      alert("Please fill in item name and price");
      return;
    }

    const item = {
      id: Date.now(),
      name: newItem.name,
      price: parseInt(newItem.price),
      description: newItem.description,
      image:
        newItem.image?.trim() ||
        "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=200&h=150&fit=crop",
    };

    setItems([...items, item]);
    setNewItem({ name: "", price: "", description: "", image: "" });
    setShowAddItem(false);
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const toggleServiceType = (type) => {
    if (shopData.serviceTypes.includes(type)) {
      setShopData({
        ...shopData,
        serviceTypes: shopData.serviceTypes.filter((t) => t !== type),
      });
    } else {
      setShopData({
        ...shopData,
        serviceTypes: [...shopData.serviceTypes, type],
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => setCurrentPage("partner-dashboard")}
            className="text-orange-600 flex items-center gap-2 hover:underline mb-4"
          >
            ← Back to Dashboard
          </button>
          <div className="flex items-center justify-between bg-white rounded-lg shadow-md p-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Shop Management
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <Edit2 size={20} />
                Edit Shop
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateShop}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  <Save size={20} />
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Shop Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Shop Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shop Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.name}
                  onChange={(e) =>
                    setShopData({ ...shopData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800 font-semibold">{shopData.name}</p>
              )}
            </div>

            {/* Cuisine */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cuisine Type
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.cuisine}
                  onChange={(e) =>
                    setShopData({ ...shopData, cuisine: e.target.value })
                  }
                  placeholder="e.g., Italian, Chinese, Bangali"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">
                  {shopData.cuisine || "Not specified"}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  Address
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.address}
                  onChange={(e) =>
                    setShopData({ ...shopData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">
                  {shopData.address || "Not specified"}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </div>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={shopData.phone}
                  onChange={(e) =>
                    setShopData({ ...shopData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">
                  {shopData.phone || "Not specified"}
                </p>
              )}
            </div>

            {/* Delivery Fee */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Fee (৳)
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={shopData.deliveryFee}
                  onChange={(e) =>
                    setShopData({ ...shopData, deliveryFee: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800 font-semibold">
                  ৳{shopData.deliveryFee}
                </p>
              )}
            </div>

            {/* Delivery Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  Delivery Time (minutes)
                </div>
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={shopData.deliveryTime}
                  onChange={(e) =>
                    setShopData({ ...shopData, deliveryTime: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ) : (
                <p className="text-gray-800">{shopData.deliveryTime} mins</p>
              )}
            </div>

            {/* Service Types */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available Services
              </label>
              {isEditing ? (
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-orange-50">
                    <input
                      type="checkbox"
                      checked={shopData.serviceTypes.includes("delivery")}
                      onChange={() => toggleServiceType("delivery")}
                      className="w-4 h-4"
                    />
                    <span>🚚 Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer hover:bg-orange-50">
                    <input
                      type="checkbox"
                      checked={shopData.serviceTypes.includes("pickup")}
                      onChange={() => toggleServiceType("pickup")}
                      className="w-4 h-4"
                    />
                    <span>🏪 Pick-up</span>
                  </label>
                </div>
              ) : (
                <div className="flex gap-3">
                  {shopData.serviceTypes.includes("delivery") && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                      🚚 Delivery
                    </span>
                  )}
                  {shopData.serviceTypes.includes("pickup") && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      🏪 Pick-up
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Menu Items</h2>
            {isEditing && (
              <button
                onClick={() => setShowAddItem(!showAddItem)}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                <Plus size={20} />
                Add Item
              </button>
            )}
          </div>

          {/* Add Item Form */}
          {showAddItem && isEditing && (
            <div className="bg-orange-50 p-6 rounded-lg mb-6 border-2 border-orange-300">
              <h3 className="font-semibold text-gray-800 mb-4">
                Add New Menu Item
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="number"
                  placeholder="Price (৳)"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({ ...newItem, price: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newItem.description}
                  onChange={(e) =>
                    setNewItem({ ...newItem, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  placeholder="Image URL (optional)"
                  value={newItem.image}
                  onChange={(e) =>
                    setNewItem({ ...newItem, image: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({
                        name: "",
                        price: "",
                        description: "",
                        image: "",
                      });
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No menu items yet
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                    <p className="text-orange-600 font-semibold mt-1">
                      ৳{item.price}
                    </p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
