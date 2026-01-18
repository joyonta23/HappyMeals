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
import { apiClient } from "../services/api";

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
    preparationTime: "",
    // Chatbot fields
    category: "other",
    dietary: ["non-vegetarian"],
    spiceLevel: "medium",
    allergens: [],
    isSide: false,
    popularityScore: 50,
  });
  const [itemImageFile, setItemImageFile] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [activeOfferItem, setActiveOfferItem] = useState(null);
  const [offerForm, setOfferForm] = useState({
    discountPercent: 0,
    freeDelivery: false,
    offerExpires: "",
  });

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

    // Fetch menu items from the database
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const partner = JSON.parse(localStorage.getItem("partner") || "{}");
      console.log("Partner data from localStorage:", partner);

      const restaurantId =
        partner.restaurant?._id ||
        partner.restaurant?.id ||
        partner.restaurantId;

      console.log("Resolved restaurant ID:", restaurantId);

      if (restaurantId) {
        console.log("Fetching menu items for restaurant:", restaurantId);
        const restaurantData = await apiClient.getRestaurantById(restaurantId);
        console.log("Restaurant data received:", restaurantData);
        if (restaurantData?.items) {
          console.log(
            "Loaded",
            restaurantData.items.length,
            "menu items from database"
          );
          setItems(restaurantData.items);
        }
      } else {
        console.log("No restaurant ID found in partner data");
        console.log("Partner object keys:", Object.keys(partner));
      }
    } catch (error) {
      console.error("Error fetching menu items:", error);
      // Fallback to localStorage if API fails
      const partner = JSON.parse(localStorage.getItem("partner") || "{}");
      setItems(partner.items || []);
    }
  };

  const handleUpdateOffer = async (itemId, offer) => {
    const token = localStorage.getItem("partnerToken");
    if (!token) return alert("Please log in again to update offers.");
    try {
      const payload = {
        discountPercent: offer.discountPercent,
        freeDelivery: !!offer.freeDelivery,
        offerExpires: offer.offerExpires || null,
      };
      const res = await apiClient.updateItemOffer(itemId, payload, token);
      if (res?.item) {
        // update local items
        setItems((prev) =>
          prev.map((it) =>
            String(it._id || it.id) === String(itemId) ? res.item : it
          )
        );
        alert("Offer updated");
        setActiveOfferItem(null);
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
    alert("Shop details updated successfully!");
  };

  const handleAddItem = async () => {
    if (!newItem.name || !newItem.price) {
      alert("Please fill in item name and price");
      return;
    }

    const token = localStorage.getItem("partnerToken");
    if (!token) {
      alert("Please log in again to add items.");
      return;
    }

    console.log("=== ADD MENU ITEM DEBUG ===");
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Item name:", newItem.name);
    console.log("Item price:", newItem.price);
    console.log("Image file:", itemImageFile ? itemImageFile.name : "None");
    console.log("Image URL:", newItem.image || "None");

    const formData = new FormData();
    formData.append("name", newItem.name);
    formData.append("price", newItem.price);
    if (newItem.description)
      formData.append("description", newItem.description);
    if (newItem.preparationTime) {
      formData.append("preparationTime", newItem.preparationTime);
    }
    // Chatbot fields
    formData.append("category", newItem.category || "other");
    formData.append("spiceLevel", newItem.spiceLevel || "medium");
    formData.append("isSide", newItem.isSide || false);
    formData.append("popularityScore", newItem.popularityScore || 50);
    if (newItem.dietary && newItem.dietary.length > 0) {
      formData.append("dietary", JSON.stringify(newItem.dietary));
    }
    if (newItem.allergens && newItem.allergens.length > 0) {
      formData.append("allergens", JSON.stringify(newItem.allergens));
    }
    if (itemImageFile) {
      console.log(
        "Appending file to FormData:",
        itemImageFile.name,
        itemImageFile.type,
        itemImageFile.size
      );
      formData.append("image", itemImageFile);
    } else if (newItem.image?.trim()) {
      console.log("Appending image URL to FormData:", newItem.image.trim());
      formData.append("imageUrl", newItem.image.trim());
    }

    // Log FormData contents
    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], ":", pair[1]);
    }

    try {
      console.log("Sending request to API...");
      const response = await apiClient.addMenuItem(formData, token);
      console.log("API Response:", response);

      // Check if the response indicates success
      if (response?.item || response?.message?.includes("created")) {
        console.log("Item created successfully, refetching menu items...");
        alert("Item added to database! Refreshing menu...");

        // Refetch all menu items from the database to stay in sync
        await fetchMenuItems();

        setNewItem({
          name: "",
          price: "",
          description: "",
          image: "",
          preparationTime: "",
          category: "other",
          dietary: ["non-vegetarian"],
          spiceLevel: "medium",
          allergens: [],
          isSide: false,
          popularityScore: 50,
        });
        setItemImageFile(null);
        setShowAddItem(false);
        alert("Item added successfully and menu refreshed!");
      } else if (response?.errors) {
        const errorMsg = response.errors.map((e) => e.msg).join(", ");
        console.error("Validation errors:", response.errors);
        alert("Validation error: " + errorMsg);
      } else {
        console.error("Unexpected response:", response);
        alert("Error: " + (response?.message || "Could not add item"));
      }
    } catch (error) {
      console.error("Failed to add item - exception:", error);
      alert("Network error: " + error.message + "\nCheck console for details.");
    }
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
                  placeholder="Preparation time (e.g., 15 mins)"
                  value={newItem.preparationTime}
                  onChange={(e) =>
                    setNewItem({ ...newItem, preparationTime: e.target.value })
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
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setItemImageFile(e.target.files?.[0] || null)
                    }
                    className="flex-1 text-sm"
                  />
                  {itemImageFile && (
                    <span className="text-xs text-gray-600">
                      {itemImageFile.name}
                    </span>
                  )}
                </div>

                {/* Chatbot Fields Section */}
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-semibold text-gray-700 mb-3">
                    Chatbot Settings
                  </h4>

                  {/* Category */}
                  <select
                    value={newItem.category || "other"}
                    onChange={(e) =>
                      setNewItem({ ...newItem, category: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
                  >
                    <option value="other">Category - Other</option>
                    <option value="biryani">Category - Biryani</option>
                    <option value="grilled">Category - Grilled</option>
                    <option value="drink">Category - Drink</option>
                    <option value="side">Category - Side</option>
                    <option value="salad">Category - Salad</option>
                    <option value="dessert">Category - Dessert</option>
                    <option value="bread">Category - Bread</option>
                  </select>

                  {/* Dietary - Checkboxes */}
                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-2">
                      Dietary Options:
                    </label>
                    <div className="space-y-2">
                      {["vegetarian", "non-vegetarian", "vegan", "halal"].map(
                        (diet) => (
                          <label key={diet} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={newItem.dietary?.includes(diet) || false}
                              onChange={(e) => {
                                const updated = [...(newItem.dietary || [])];
                                if (e.target.checked) {
                                  if (!updated.includes(diet))
                                    updated.push(diet);
                                } else {
                                  const idx = updated.indexOf(diet);
                                  if (idx > -1) updated.splice(idx, 1);
                                }
                                setNewItem({ ...newItem, dietary: updated });
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-600 capitalize">
                              {diet}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Spice Level */}
                  <select
                    value={newItem.spiceLevel || "medium"}
                    onChange={(e) =>
                      setNewItem({ ...newItem, spiceLevel: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-3"
                  >
                    <option value="mild">Spice Level - Mild</option>
                    <option value="medium">Spice Level - Medium</option>
                    <option value="spicy">Spice Level - Spicy</option>
                  </select>

                  {/* Allergens - Checkboxes */}
                  <div className="mb-3">
                    <label className="block text-sm text-gray-700 mb-2">
                      Allergens:
                    </label>
                    <div className="space-y-2">
                      {["nuts", "dairy", "gluten", "shellfish", "eggs"].map(
                        (allergen) => (
                          <label
                            key={allergen}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={
                                newItem.allergens?.includes(allergen) || false
                              }
                              onChange={(e) => {
                                const updated = [...(newItem.allergens || [])];
                                if (e.target.checked) {
                                  if (!updated.includes(allergen))
                                    updated.push(allergen);
                                } else {
                                  const idx = updated.indexOf(allergen);
                                  if (idx > -1) updated.splice(idx, 1);
                                }
                                setNewItem({ ...newItem, allergens: updated });
                              }}
                              className="rounded"
                            />
                            <span className="text-sm text-gray-600 capitalize">
                              {allergen}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  {/* Is Side */}
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={newItem.isSide || false}
                      onChange={(e) =>
                        setNewItem({ ...newItem, isSide: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span className="text-sm text-gray-700">
                      This is a side dish (e.g., drink, salad, naan)
                    </span>
                  </label>

                  {/* Popularity Score */}
                  <div>
                    <label className="block text-sm text-gray-700 mb-2">
                      Popularity Score (0-100): {newItem.popularityScore || 50}
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={newItem.popularityScore || 50}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          popularityScore: parseInt(e.target.value),
                        })
                      }
                      className="w-full"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowAddItem(false);
                      setNewItem({
                        name: "",
                        price: "",
                        description: "",
                        image: "",
                        preparationTime: "",
                        category: "other",
                        dietary: ["non-vegetarian"],
                        spiceLevel: "medium",
                        allergens: [],
                        isSide: false,
                        popularityScore: 50,
                      });
                      setItemImageFile(null);
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
              items.map((item) => {
                const itemId = item._id || item.id;
                const isOfferOpen = String(activeOfferItem) === String(itemId);
                const currentDiscount = Number(item.discountPercent || 0);
                const currentFreeDelivery = !!item.freeDelivery;
                const currentExpiry = item.offerExpires
                  ? new Date(item.offerExpires).toISOString().slice(0, 10)
                  : "";
                return (
                  <div
                    key={itemId}
                    className="p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                        <div className="mt-1 flex items-center gap-3">
                          <p className="text-orange-600 font-semibold">
                            ৳{item.price}
                          </p>
                          {currentDiscount > 0 && (
                            <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 font-semibold">
                              {currentDiscount}% OFF
                            </span>
                          )}
                          {currentFreeDelivery && (
                            <span className="px-2 py-0.5 text-xs rounded bg-blue-100 text-blue-700 font-semibold">
                              Free delivery
                            </span>
                          )}
                          {currentExpiry && (
                            <span className="px-2 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                              Until {currentExpiry}
                            </span>
                          )}
                        </div>
                      </div>
                      {isEditing && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setActiveOfferItem(isOfferOpen ? null : itemId);
                              setOfferForm({
                                discountPercent: currentDiscount,
                                freeDelivery: currentFreeDelivery,
                                offerExpires: currentExpiry,
                              });
                            }}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                            {isOfferOpen ? "Close Offer" : "Edit Offer"}
                          </button>
                          <button
                            onClick={() => handleRemoveItem(itemId)}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>

                    {isEditing && isOfferOpen && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
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
                        <div className="flex items-end justify-end gap-2">
                          <button
                            onClick={() => setActiveOfferItem(null)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateOffer(itemId, {
                                discountPercent: offerForm.discountPercent,
                                freeDelivery: offerForm.freeDelivery,
                                offerExpires: offerForm.offerExpires || null,
                              })
                            }
                            className="px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600"
                          >
                            Save Offer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
