import React, { useState } from "react";
import { X } from "lucide-react";
import { Hero } from "../components/Hero";
import { RestaurantCard } from "../components/RestaurantCard";
import PopularDishes from "../components/PopularDishes";

export const HomePage = ({
  restaurants = [],
  setCurrentPage,
  setSelectedRestaurant,
  onAddToCart,
  cart,
  language = "EN",
  onSelectRestaurant,
}) => {
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    superRestaurant: false,
    freeDelivery: false,
    deals: false,
    rating4Plus: false,
  });
  const [showSignUpBanner, setShowSignUpBanner] = useState(true);
  const isLoggedIn = !!(
    localStorage.getItem("authToken") ||
    localStorage.getItem("partnerToken") ||
    localStorage.getItem("user")
  );


  const cuisines = [
    {
      name: "Asian",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&h=150&fit=crop",
    },
    {
      name: "Pizza",
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&h=150&fit=crop",
    },
    {
      name: "Desserts",
      image:
        "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=150&h=150&fit=crop",
    },
    {
      name: "Biryani",
      image:
        "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&h=150&fit=crop",
    },
    {
      name: "Burgers",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150&h=150&fit=crop",
    },
    {
      name: "Coffee",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&h=150&fit=crop",
    },
    {
      name: "Thai",
      image:
        "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=150&h=150&fit=crop",
    },
  ];

  const getFilteredRestaurants = () => {
    let filtered = [...restaurants];

    const now = new Date();

    if (filters.rating4Plus) {
      filtered = filtered.filter((r) => r.rating >= 4.4);
    }

    if (filters.freeDelivery) {
      filtered = filtered.filter((r) => {
        // Check restaurant-level free delivery OR any item with active free-delivery offer
        if (r.deliveryFee === 0) return true;
        const items = Array.isArray(r.items) ? r.items : [];
        return items.some((it) => {
          const expiresAt = it?.offerExpires ? new Date(it.offerExpires) : null;
          return !!it?.freeDelivery && (!expiresAt || expiresAt > now);
        });
      });
    }

    if (filters.deals) {
      filtered = filtered.filter((r) => {
        const items = Array.isArray(r.items) ? r.items : [];
        return items.some((it) => {
          const expiresAt = it?.offerExpires ? new Date(it.offerExpires) : null;
          return Number(it?.discountPercent || 0) > 0 && (!expiresAt || expiresAt > now);
        });
      });
    }

    if (sortBy === "fastest") {
      filtered.sort(
        (a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime)
      );
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  };

  const handleSelectRestaurant = async (restaurant) => {
    if (onSelectRestaurant) {
      await onSelectRestaurant(restaurant);
    } else {
      setSelectedRestaurant(restaurant);
      setCurrentPage("restaurant");
    }
  };

  return (
    <>
      <Hero
        onSearch={(query) => console.log("Search:", query)}
        language={language}
        restaurants={restaurants}
        onSelectSuggestion={(arg1, arg2) => {
          // Support both (restaurantId, itemId) and suggestion object
          let restaurantId = null;
          let itemId = null;
          if (arg1 && typeof arg1 === "object" && arg1.restaurantId) {
            restaurantId = arg1.restaurantId;
            itemId = arg1.itemId;
            console.debug("Hero suggestion clicked:", arg1);
          } else {
            restaurantId = arg1;
            itemId = arg2;
          }

          if (typeof onSelectRestaurant === "function") {
            const found = restaurants.find(
              (r) => (r._id && String(r._id) === String(restaurantId)) || (r.id && String(r.id) === String(restaurantId))
            );
            const payload = found
              ? { ...found, _highlightItemId: itemId }
              : { _id: restaurantId, id: restaurantId, _highlightItemId: itemId };
            onSelectRestaurant(payload);
          } else {
            console.log("Suggestion selected", restaurantId, itemId);
          }
        }}
      />

      {/* Navigation Tabs removed: Delivery / Pick-up / Shops */}

      {/* Sign Up Banner */}
      {showSignUpBanner && !isLoggedIn && (
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-4">
                <div className="text-5xl">🎉</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    Sign up for free delivery on your first order
                  </h3>
                  <p className="text-gray-600">
                    Join thousands of happy customers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage && setCurrentPage("customer-signup")}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
                >
                  Sign up
                </button>
                <button
                  onClick={() => setShowSignUpBanner(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cuisines Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold mb-6">Cuisines</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {cuisines.map((cuisine, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 cursor-pointer group min-w-fit"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-orange-500 transition">
                  <img
                    src={cuisine.image}
                    alt={cuisine.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">
                  {cuisine.name}
                </span>
              </div>
            ))}
          </div>
        </div>

          {/* Popular dishes */}
          <PopularDishes onAddToCart={onAddToCart} />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Filters</h3>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">Sort by</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "relevance"}
                      onChange={() => setSortBy("relevance")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="text-gray-700">Relevance</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "fastest"}
                      onChange={() => setSortBy("fastest")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="text-gray-700">Fastest delivery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="sort"
                      checked={sortBy === "rating"}
                      onChange={() => setSortBy("rating")}
                      className="w-4 h-4 text-orange-600"
                    />
                    <span className="text-gray-700">Top rated</span>
                  </label>
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-gray-700">
                  Quick filters
                </h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.rating4Plus}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          rating4Plus: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="text-gray-700">Ratings 4.4+</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.superRestaurant}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          superRestaurant: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="text-gray-700">⭐ Super restaurant</span>
                  </label>
                </div>
              </div>

              {/* Offers */}
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Offers</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.freeDelivery}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          freeDelivery: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="text-gray-700">Free delivery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.deals}
                      onChange={(e) =>
                        setFilters({ ...filters, deals: e.target.checked })
                      }
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                    <span className="text-gray-700">Deals</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Restaurant List */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6">Restaurants near you</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {getFilteredRestaurants().map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onSelectRestaurant={handleSelectRestaurant}
                />
              ))}
            </div>
            {getFilteredRestaurants().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  No restaurants match your filters
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      superRestaurant: false,
                      freeDelivery: false,
                      deals: false,
                      rating4Plus: false,
                    })
                  }
                  className="mt-4 text-orange-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
