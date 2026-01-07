// API Service - Backend endpoints
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const withAuth = (token) => (token ? { Authorization: `Bearer ${token}` } : {});

export const apiClient = {
  // Restaurant endpoints
  getRestaurants: async (filters = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      throw error;
    }
  },

  getRestaurantById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching restaurant:", error);
      throw error;
    }
  },

  // Reviews
  getRestaurantReviews: async (restaurantId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurants/${restaurantId}/reviews`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  addRestaurantReview: async (
    restaurantId,
    rating,
    comment,
    token,
    menuItemId
  ) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/restaurants/${restaurantId}/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", ...withAuth(token) },
          body: JSON.stringify({ rating, comment, menuItemId }),
        }
      );
      return await response.json();
    } catch (error) {
      console.error("Error adding review:", error);
      throw error;
    }
  },

  // Auth endpoints
  partnerLogin: async (partnerId, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/partner-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerId, password }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  customerSignup: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer-signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error signing up:", error);
      throw error;
    }
  },

  customerLogin: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  updateCustomerProfile: async (profileData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...withAuth(token) },
        body: JSON.stringify(profileData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  },

  // Order endpoints
  createOrder: async (orderData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...withAuth(token) },
        body: JSON.stringify(orderData),
      });
      return await response.json();
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Analytics endpoints
  getPartnerAnalytics: async (partnerId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/${partnerId}`, {
        headers: { ...withAuth(token) },
      });
      return await response.json();
    } catch (error) {
      console.error("Error fetching analytics:", error);
      throw error;
    }
  },

  // Public popular dishes
  getPopularDishes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/analytics/popular`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching popular dishes:", error);
      throw error;
    }
  },

  // Search items via backend text search
  search: async (q) => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/search?q=${encodeURIComponent(
        q
      )}`);
      return await response.json();
    } catch (error) {
      console.error("Error searching:", error);
      return [];
    }
  },
  // Partner: update item offers
  updateItemOffer: async (itemId, payload, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/items/${itemId}/offer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify(payload),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating item offer:", error);
      throw error;
    }
  },

  // Partner registration
  registerPartner: async (formData) => {
    try {
      // Check if formData is FormData (has entries method) or plain object
      const isFormData = formData instanceof FormData;
      const config = {
        method: "POST",
      };

      if (isFormData) {
        // FormData includes file, don't set Content-Type header
        // Let the browser set it with the boundary
        config.body = formData;
      } else {
        // Plain object
        config.headers = { "Content-Type": "application/json" };
        config.body = JSON.stringify(formData);
      }

      const response = await fetch(`${API_BASE_URL}/partners/register`, config);
      return await response.json();
    } catch (error) {
      console.error("Error registering partner:", error);
      throw error;
    }
  },

  // Partner password change
  changePartnerPassword: async (currentPassword, newPassword, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/change-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...withAuth(token) },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  },

  // Partner add menu item (supports file upload)
  addMenuItem: async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/partners/items`, {
        method: "POST",
        headers: { ...withAuth(token) },
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error("Error adding menu item:", error);
      throw error;
    }
  },

  // Update order status (partner/admin)
  updateOrderStatus: async (orderId, status, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...withAuth(token) },
        body: JSON.stringify({ status }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
};
