import React, { useEffect, useState } from "react";
import { Star, Clock, ShoppingBag } from "lucide-react";
import { apiClient } from "../services/api";

export const RestaurantPage = ({
  restaurant,
  setCurrentPage,
  onAddToCart,
  highlightedItemId,
}) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [menuItemId, setMenuItemId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const restaurantId = restaurant?.id || restaurant?._id;
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
        ).toFixed(1)
      : restaurant?.averageRating || restaurant?.rating || "New";

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await apiClient.getRestaurantReviews(restaurantId);
        setReviews(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading reviews", error);
      }
    };

    if (restaurantId) {
      fetchReviews();
    }
  }, [restaurantId]);
  // Ensure highlight effect runs on every render hook order consistently
  useEffect(() => {
    if (!highlightedItemId) return;
    const el = document.getElementById(`menu-item-${highlightedItemId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      // temporary highlight
      el.classList.add("ring", "ring-orange-300");
      setTimeout(() => el.classList.remove("ring", "ring-orange-300"), 3000);
    }
  }, [highlightedItemId]);

  if (!restaurant) return null;

  // Show a header hint if any item currently has active free delivery
  const anyFreeDeliveryActive =
    Array.isArray(restaurant.items) &&
    restaurant.items.some((it) => {
      const expiresAt = it?.offerExpires ? new Date(it.offerExpires) : null;
      return !!it?.freeDelivery && (!expiresAt || expiresAt > new Date());
    });

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    const token = localStorage.getItem("authToken");
    if (!token) {
      setReviewError("Please log in as a customer to add a review.");
      return;
    }

    try {
      setSubmitting(true);
      const response = await apiClient.addRestaurantReview(
        restaurantId,
        Number(rating),
        comment,
        token,
        menuItemId || undefined
      );

      if (response?.review) {
        setReviews((prev) => [response.review, ...prev]);
        setReviewSuccess("Thanks for your feedback!");
        setComment("");
        setRating(5);
        setMenuItemId("");
      } else {
        setReviewError(response?.message || "Could not add review");
      }
    } catch (error) {
      setReviewError("Could not add review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => setCurrentPage("home")}
            className="text-orange-600 mb-4 flex items-center gap-2 hover:underline"
          >
            ← Back to restaurants
          </button>
          <div className="flex gap-6">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{avgRating}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock size={16} />
                  <span>{restaurant.deliveryTime}</span>
                </div>
                <div className="text-gray-600">
                  ৳{restaurant.deliveryFee} delivery
                </div>
                {anyFreeDeliveryActive && (
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-semibold">
                    Free delivery available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurant.items &&
            restaurant.items.map((item) => {
              const itemId = item.id || item._id;
              const isHighlighted =
                highlightedItemId &&
                String(highlightedItemId) === String(itemId);
              const now = new Date();
              const expiresAt = item.offerExpires
                ? new Date(item.offerExpires)
                : null;
              const offerValid =
                Number(item.discountPercent || 0) > 0 &&
                (!expiresAt || expiresAt > now);
              const freeDeliveryActive =
                !!item.freeDelivery && (!expiresAt || expiresAt > now);
              const effectivePrice = offerValid
                ? Math.round(
                    Number(item.price || 0) *
                      (1 - Number(item.discountPercent || 0) / 100)
                  )
                : Number(item.price || 0);
              const expiryDisplay = expiresAt
                ? expiresAt.toISOString().slice(0, 10)
                : "";
              return (
                <div
                  id={`menu-item-${itemId}`}
                  key={itemId}
                  className={`bg-white rounded-lg shadow-md p-4 flex gap-4 ${
                    isHighlighted ? "ring ring-orange-300" : ""
                  }`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">
                      No Image
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-orange-600">
                        {offerValid ? (
                          <>
                            <span className="text-base line-through text-gray-400 mr-2">
                              ৳{item.price}
                            </span>
                            <span>৳{effectivePrice}</span>
                          </>
                        ) : (
                          <>৳{item.price}</>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        {offerValid && (
                          <span className="text-xs px-2 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
                            {Number(item.discountPercent)}% OFF
                            {expiryDisplay ? ` · until ${expiryDisplay}` : ""}
                          </span>
                        )}
                        {freeDeliveryActive && (
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-semibold">
                            Free delivery
                            {expiryDisplay ? ` · until ${expiryDisplay}` : ""}
                          </span>
                        )}

                        {item.reviewCount > 0 && (
                          <span className="flex items-center gap-1 text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                            <Star
                              size={14}
                              className="text-yellow-500 fill-yellow-500"
                            />
                            <span className="font-semibold">
                              {item.avgRating?.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({item.reviewCount})
                            </span>
                          </span>
                        )}
                        <button
                          onClick={() => {
                            const itemForCart = {
                              ...item,
                              price: effectivePrice,
                            };
                            onAddToCart(itemForCart, restaurantId);
                          }}
                          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="container mx-auto px-4 pb-12">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Reviews</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span>{avgRating || "New"}</span>
            </div>
          </div>

          <form onSubmit={handleSubmitReview} className="space-y-3 mb-6">
            <div className="flex gap-3 flex-col md:flex-row">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                Rating:
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} ⭐
                    </option>
                  ))}
                </select>
              </label>

              <div className="flex flex-col flex-1">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  Reviewed item (optional)
                </label>
                <select
                  value={menuItemId}
                  onChange={(e) => setMenuItemId(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Whole restaurant</option>
                  {restaurant.items?.map((item) => {
                    const itemId = item.id || item._id;
                    return (
                      <option key={itemId} value={itemId}>
                        {item.name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience (optional)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                maxLength={500}
              />

              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition disabled:opacity-60"
              >
                {submitting ? "Submitting..." : "Submit review"}
              </button>
            </div>
            {reviewError && (
              <div className="text-red-600 text-sm">{reviewError}</div>
            )}
            {reviewSuccess && (
              <div className="text-green-600 text-sm">{reviewSuccess}</div>
            )}
          </form>

          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-gray-600 text-sm">
                No reviews yet. Be the first!
              </p>
            )}
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="border border-gray-100 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-semibold text-gray-800">
                    {rev.userName || "Customer"}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Star
                      size={14}
                      className="text-yellow-500 fill-yellow-500"
                    />
                    <span className="font-semibold">{rev.rating}</span>
                  </div>
                </div>
                {rev.menuItem?.name && (
                  <p className="text-xs text-orange-600 font-semibold mt-1">
                    Item: {rev.menuItem.name}
                  </p>
                )}
                {rev.comment && (
                  <p className="text-gray-700 text-sm">{rev.comment}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
