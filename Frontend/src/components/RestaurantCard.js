import React from "react";
import { Star, TrendingUp, Award } from "lucide-react";

export const RestaurantCard = ({ restaurant, onSelectRestaurant }) => {
  const isFreeDelivery = restaurant.deliveryFee === 0;
  const isTopRated = restaurant.rating >= 4.5;

  // Small indicators based on item-level offers
  const items = Array.isArray(restaurant.items) ? restaurant.items : [];
  const now = new Date();
  const hasDeal = items.some((it) => {
    const expiresAt = it?.offerExpires ? new Date(it.offerExpires) : null;
    return (
      Number(it?.discountPercent || 0) > 0 && (!expiresAt || expiresAt > now)
    );
  });
  const hasItemFreeDelivery = items.some((it) => {
    const expiresAt = it?.offerExpires ? new Date(it.offerExpires) : null;
    return !!it?.freeDelivery && (!expiresAt || expiresAt > now);
  });

  return (
    <div
      className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer restaurant-card"
      onClick={() => onSelectRestaurant(restaurant)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden h-48">
        {restaurant.image ? (
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            <span>No Image</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isFreeDelivery && (
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-scale-in">
              FREE DELIVERY
            </span>
          )}
          {isTopRated && (
            <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-scale-in delay-100">
              <Award size={12} />
              TOP RATED
            </span>
          )}
        </div>

        {/* Discount Badge (if applicable) */}
        {restaurant.discount && (
          <div className="absolute top-3 right-3 bg-red-500 text-white font-bold px-3 py-2 rounded-lg shadow-lg badge-glow">
            {restaurant.discount}% OFF
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Restaurant Name */}
        <h3 className="text-xl font-bold mb-2 text-gray-800 hover:text-orange-600 transition-colors truncate">
          {restaurant.name}
        </h3>

        {/* Cuisine */}
        <p className="text-gray-600 text-sm truncate">{restaurant.cuisine}</p>

        {/* Small offer indicators */}
        {(hasDeal || hasItemFreeDelivery) && (
          <div className="mt-2 mb-3 flex items-center gap-2">
            {hasDeal && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 font-semibold">
                Deals available
              </span>
            )}
            {hasItemFreeDelivery && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold">
                Free delivery items
              </span>
            )}
          </div>
        )}

        {/* Info Grid */}
        <div className="flex items-center justify-between text-sm">
          {/* Rating */}
          <div className="flex items-center gap-1.5 bg-green-50 px-3 py-1.5 rounded-lg">
            <Star size={16} className="text-green-600 fill-green-600" />
            <span className="font-bold text-green-600">
              {restaurant.rating}
            </span>
          </div>

          {/* Delivery Fee */}
          <div
            className={`font-semibold ${
              isFreeDelivery ? "text-green-600" : "text-gray-600"
            }`}
          >
            {isFreeDelivery ? "FREE" : `৳${restaurant.deliveryFee}`} delivery
          </div>
        </div>

        {/* Trending Indicator (optional) */}
        {restaurant.trending && (
          <div className="mt-3 flex items-center gap-2 text-orange-600 text-xs font-semibold">
            <TrendingUp size={14} />
            <span>Trending now</span>
          </div>
        )}
      </div>

      {/* Hover Bottom Bar */}
      <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
    </div>
  );
};
