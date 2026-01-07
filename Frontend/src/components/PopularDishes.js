import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { apiClient } from "../services/api";

export const PopularDishes = ({ onAddToCart }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await apiClient.getPopularDishes();
        // backend returns { top: [...] }
        const top = res && res.top ? res.top : [];
        if (mounted) setItems(top);
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to load popular dishes");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="py-6">Loading popular dishes...</div>;
  if (error) return <div className="py-6 text-red-500">{error}</div>;
  if (!items.length) return null;

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-4">Popular dishes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {items.map((it) => (
            <div key={it._id || it.name} className="border rounded-lg p-3 bg-gray-50">
              <div className="h-32 w-full overflow-hidden rounded mb-2 bg-gray-200">
                {it.image ? (
                  <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold">{it.name}</div>
                  <div className="text-sm text-gray-600">{it.restaurant?.name || ""}</div>
                </div>
                <div className="text-sm font-semibold">৳{it.price || "--"}</div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <Star size={14} className="text-yellow-500" />
                <span>{(it.avgRating || 0).toFixed(1)}</span>
                <span className="ml-2">({it.votes || 0} votes)</span>
              </div>
              <div className="mt-3">
                <button
                  onClick={() => onAddToCart && onAddToCart({ id: it._id || it.name, name: it.name, price: it.price || 0, image: it.image }, it.restaurant?._id)}
                  className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700"
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularDishes;
