import React from 'react';
import { Star, Clock, ShoppingBag } from 'lucide-react';

export const RestaurantPage = ({ 
  restaurant, 
  setCurrentPage,
  onAddToCart 
}) => {
  if (!restaurant) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <button 
            onClick={() => setCurrentPage('home')}
            className="text-orange-600 mb-4 flex items-center gap-2 hover:underline"
          >
            ← Back to restaurants
          </button>
          <div className="flex gap-6">
            <img src={restaurant.image} alt={restaurant.name} className="w-32 h-32 object-cover rounded-lg" />
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{restaurant.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={16} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="text-gray-600">
                  ৳{restaurant.deliveryFee} delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurant.items && restaurant.items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex gap-4">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-orange-600">৳{item.price}</span>
                  <button 
                    onClick={() => onAddToCart(item, restaurant.id)}
                    className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
