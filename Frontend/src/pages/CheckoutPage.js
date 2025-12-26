import React, { useState } from 'react';
import { ShoppingBag, MapPin, CreditCard, Minus, Plus, X } from 'lucide-react';

export const CheckoutPage = ({ 
  cart, 
  selectedRestaurant,
  setCurrentPage,
  onRemoveFromCart,
  onAddToCart
}) => {
  const getTotalPrice = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = cart.length > 0 ? (selectedRestaurant?.deliveryFee || 30) : 0;
    return { subtotal, deliveryFee, total: subtotal + deliveryFee };
  };

  const { subtotal, deliveryFee, total } = getTotalPrice();

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <button 
          onClick={() => setCurrentPage(selectedRestaurant ? 'restaurant' : 'home')}
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
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center gap-4 border-b pb-4">
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
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
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
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

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin size={24} />
                Delivery Address
              </h2>
              <input 
                type="text" 
                placeholder="Enter your delivery address"
                className="w-full p-3 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <input 
                type="text" 
                placeholder="Add delivery instructions (optional)"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
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
                disabled={cart.length === 0}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CreditCard size={20} />
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
