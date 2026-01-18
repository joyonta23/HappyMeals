import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { HomePage } from "./pages/HomePage";
import { RestaurantPage } from "./pages/RestaurantPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PartnerDashboard } from "./pages/PartnerDashboard";
import { PartnerSettingsPage } from "./pages/PartnerSettingsPage";
import { RestaurantPartnerPage } from "./pages/RestaurantPartnerPage";
import { CustomerSignupPage } from "./pages/CustomerSignupPage";
import { CustomerProfilePage } from "./pages/CustomerProfilePage";
import { ShopManagementPage } from "./pages/ShopManagementPage";
import { CustomerOrderTrackingPage } from "./pages/CustomerOrderTrackingPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/ResetPasswordPage";
import { apiClient } from "./services/api";

// Mock Data - Replace with API calls
const mockRestaurants = [
  {
    id: 1,
    name: "দেশী",
    cuisine: "Fast Food",
    rating: 4.5,
    deliveryFee: 29,
    deliveryTime: "25",
    address: "Gulshan 2, Dhaka",
    serviceTypes: ["delivery", "pickup"],
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    items: [
      {
        id: 101,
        name: "Whopper",
        price: 320,
        description: "Flame-grilled beef patty",
        image:
          "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=150&fit=crop",
      },
      {
        id: 102,
        name: "Chicken Royale",
        price: 280,
        description: "Crispy chicken burger",
        image:
          "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=200&h=150&fit=crop",
      },
      {
        id: 103,
        name: "French Fries",
        price: 120,
        description: "Crispy golden fries",
        image:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=200&h=150&fit=crop",
      },
      {
        id: 104,
        name: "Hyderabadi Biryani",
        price: 400,
        description: "Authentic Hyderabad style biryani",
        image:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=150&fit=crop",
      },
    ],
  },
  {
    id: 2,
    name: "Astana",
    cuisine: "bangali food",
    rating: 4.3,
    deliveryFee: 35,
    deliveryTime: "30",
    address: "Banani, Dhaka",
    serviceTypes: ["delivery"],
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop",
    items: [
      {
        id: 201,
        name: "Margherita Pizza",
        price: 450,
        description: "Classic cheese pizza",
        image:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=150&fit=crop",
      },
      {
        id: 202,
        name: "Pepperoni Pizza",
        price: 550,
        description: "With pepperoni slices",
        image:
          "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=200&h=150&fit=crop",
      },
    ],
  },
  {
    id: 3,
    name: "Habibi Bistro",
    cuisine: "Chinese and Bangla",
    rating: 4.7,
    deliveryFee: 40,
    deliveryTime: "35",
    address: "Dhanmondi, Dhaka",
    serviceTypes: ["delivery", "pickup"],
    image:
      "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop",
    items: [
      {
        id: 301,
        name: "Beef Kacchi",
        price: 380,
        description: "Traditional Kacchi Biryani",
        image:
          "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&h=150&fit=crop",
      },
      {
        id: 302,
        name: "Chicken Biryani",
        price: 320,
        description: "Aromatic chicken biryani",
        image:
          "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=200&h=150&fit=crop",
      },
      // Hyderabadi Biryani moved to Deshi Dine mock to reflect data correction
    ],
  },
  {
    id: 4,
    name: "Cuet Cafeteria",
    cuisine: "Chinese and Bangla",
    rating: 4.4,
    deliveryFee: 30,
    deliveryTime: "20",
    address: "Chattogram, Bangladesh",
    serviceTypes: ["pickup"],
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=400&h=300&fit=crop",
    items: [
      {
        id: 401,
        name: "Thai Fried Rice",
        price: 280,
        description: "Spicy fried rice",
        image:
          "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=200&h=150&fit=crop",
      },
      {
        id: 402,
        name: "Spring Rolls",
        price: 180,
        description: "Crispy vegetable rolls",
        image:
          "https://images.unsplash.com/photo-1620704669558-7e3aa60bc6dc?w=200&h=150&fit=crop",
      },
      {
        id: 403,
        name: "Mutton Biryani",
        price: 380,
        description: "Slow-cooked mutton biryani",
        image:
          "https://images.unsplash.com/photo-1604908177522-5f9b1b5f3b1f?w=200&h=150&fit=crop",
      },
    ],
  },
  {
    id: 5,
    name: "Panshi's Kitchen",
    cuisine: "Desserts & Bakery",
    rating: 4.8,
    deliveryFee: 25,
    deliveryTime: "15",
    address: "Mirpur, Dhaka",
    serviceTypes: ["delivery", "pickup"],
    image:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    items: [
      {
        id: 501,
        name: "Chocolate Cake",
        price: 350,
        description: "Rich chocolate layer cake",
        image:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=150&fit=crop",
      },
      {
        id: 502,
        name: "Cheesecake",
        price: 420,
        description: "Creamy New York cheesecake",
        image:
          "https://images.unsplash.com/photo-1612874742237-415c069f0580?w=200&h=150&fit=crop",
      },
    ],
  },
  {
    id: 6,
    name: "The Coffee Corner",
    cuisine: "Cafe & Coffee",
    rating: 4.6,
    deliveryFee: 20,
    deliveryTime: "10",
    address: "Uttara, Dhaka",
    serviceTypes: ["delivery"],
    image:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=300&fit=crop",
    items: [
      {
        id: 601,
        name: "Cappuccino",
        price: 150,
        description: "Creamy cappuccino",
        image:
          "https://images.unsplash.com/photo-1517668808822-9ebb02ae2a0e?w=200&h=150&fit=crop",
      },
      {
        id: 602,
        name: "Espresso Shots",
        price: 120,
        description: "Strong espresso",
        image:
          "https://images.unsplash.com/photo-1510812431401-41d2cab2707d?w=200&h=150&fit=crop",
      },
    ],
  },
  {
    id: 7,
    name: "Dragon's Wok",
    cuisine: "Chinese",
    rating: 4.5,
    deliveryFee: 35,
    deliveryTime: "25",
    address: "Bashundhara, Dhaka",
    serviceTypes: ["delivery", "pickup"],
    image:
      "https://images.unsplash.com/photo-1609501676725-7186f017a4b8?w=400&h=300&fit=crop",
    items: [
      {
        id: 701,
        name: "Chow Mein",
        price: 280,
        description: "Stir-fried noodles",
        image:
          "https://images.unsplash.com/photo-1609501676725-7186f017a4b8?w=200&h=150&fit=crop",
      },
      {
        id: 702,
        name: "Kung Pao Chicken",
        price: 350,
        description: "Spicy chicken with peanuts",
        image:
          "https://images.unsplash.com/photo-1582884921225-c36ebc5c9d2d?w=200&h=150&fit=crop",
      },
      {
        id: 703,
        name: "Beef Biryani",
        price: 390,
        description: "Delicious beef biryani with aromatic spices",
        image:
          "https://images.unsplash.com/photo-1604908177522-5f9b1b5f3b1f?w=200&h=150&fit=crop",
      },
    ],
  },
  {
    id: 8,
    name: "Spice Garden",
    cuisine: "Indian",
    rating: 4.7,
    deliveryFee: 40,
    deliveryTime: "30",
    address: "Mohakhali, Dhaka",
    serviceTypes: ["pickup"],
    image:
      "https://images.unsplash.com/photo-1585238341710-4ce9852212af?w=400&h=300&fit=crop",
    items: [
      {
        id: 801,
        name: "Butter Chicken",
        price: 420,
        description: "Creamy tomato curry",
        image:
          "https://images.unsplash.com/photo-1603894752352-e94ce4c1e36e?w=200&h=150&fit=crop",
      },
      {
        id: 802,
        name: "Naan Bread",
        price: 80,
        description: "Traditional Indian bread",
        image:
          "https://images.unsplash.com/photo-1585021066580-78b0ba3e1155?w=200&h=150&fit=crop",
      },
    ],
  },
];

// Mock Partner Accounts (Restaurant Owners)
const partnerAccounts = {
  PARTNER001: {
    id: "PARTNER001",
    password: "demo123",
    restaurantId: 1,
    restaurantName: "Burger King",
    ownerName: "John Doe",
    email: "john@burgerking.com",
  },
  PARTNER002: {
    id: "PARTNER002",
    password: "demo123",
    restaurantId: 2,
    restaurantName: "Pizza Hut",
    ownerName: "Jane Smith",
    email: "jane@pizzahut.com",
  },
};

// Mock Analytics Data
const getAnalyticsData = (partnerId) => ({
  dailySales: [
    { date: "2025-12-01", amount: 15420, orders: 45 },
    { date: "2025-12-02", amount: 18230, orders: 52 },
    { date: "2025-12-03", amount: 16890, orders: 48 },
    { date: "2025-12-04", amount: 21340, orders: 61 },
    { date: "2025-12-05", amount: 19650, orders: 56 },
    { date: "2025-12-06", amount: 22480, orders: 64 },
    { date: "2025-12-07", amount: 24120, orders: 69 },
  ],
  weeklySales: { current: 138130, previous: 125400, growth: 10.1 },
  monthlySales: { current: 556780, previous: 498230, growth: 11.7 },
  popularItems: [
    { name: "Whopper", orders: 234, revenue: 74880 },
    { name: "Chicken Royale", orders: 198, revenue: 55440 },
    { name: "French Fries", orders: 345, revenue: 41400 },
  ],
  expenses: {
    ingredients: 185000,
    labor: 95000,
    utilities: 15000,
    other: 25000,
    total: 320000,
  },
  wastage: [
    { item: "Lettuce", amount: 2.5, cost: 450 },
    { item: "Tomatoes", amount: 1.8, cost: 320 },
    { item: "Cheese", amount: 0.9, cost: 680 },
    { item: "Bread Buns", amount: 15, cost: 450 },
  ],
  reviews: [
    {
      customer: "Ahmed R.",
      rating: 5,
      comment: "Excellent food quality!",
      date: "2025-12-07",
    },
    {
      customer: "Fatima K.",
      rating: 4,
      comment: "Good taste but slow delivery",
      date: "2025-12-06",
    },
    {
      customer: "Karim M.",
      rating: 5,
      comment: "Always fresh and delicious",
      date: "2025-12-06",
    },
    {
      customer: "Nadia S.",
      rating: 4,
      comment: "Great burgers, reasonable price",
      date: "2025-12-05",
    },
  ],
  averageRating: 4.5,
  totalOrders: 892,
  totalRevenue: 556780,
});

const App = () => {
  // Check URL for reset password route on initial load
  const getInitialPage = () => {
    const path = window.location.pathname;
    const search = window.location.search;
    
    // Check if URL contains reset-password token
    if (search.includes('token=') && search.includes('type=')) {
      return "reset-password";
    }
    
    return "home";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage());
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [highlightedItemId, setHighlightedItemId] = useState(null);
  const [cart, setCart] = useState([]);
  const [location, setLocation] = useState("Chattogram");
  const [loggedInPartner, setLoggedInPartner] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [language, setLanguage] = useState("EN");

  const mergeWithMockItems = (apiRestaurant) => {
    const name = (apiRestaurant.name || "").toLowerCase();
    let fallback = mockRestaurants.find(
      (m) => (m.name || "").toLowerCase() === name
    );

    // If exact name match not found, try matching by cuisine
    if (!fallback && apiRestaurant.cuisine) {
      const cuisine = (apiRestaurant.cuisine || "").toLowerCase();
      fallback = mockRestaurants.find((m) =>
        (m.cuisine || "").toLowerCase().includes(cuisine)
      );
    }

    // Last resort: use first mock entry so we keep some items for corpus
    if (!fallback) fallback = mockRestaurants[0];

    return {
      ...fallback,
      ...apiRestaurant,
      id: apiRestaurant._id || apiRestaurant.id || fallback?.id,
      items:
        (apiRestaurant.items && apiRestaurant.items.length > 0
          ? apiRestaurant.items
          : fallback?.items) || [],
    };
  };

  // Fetch restaurants from API
  const loadRestaurants = async () => {
    try {
      const data = await apiClient.getRestaurants();
      if (Array.isArray(data) && data.length > 0) {
        setRestaurants(data.map(mergeWithMockItems));
      } else {
        // Fallback to mock data if no restaurants exist
        setRestaurants(mockRestaurants);
      }
    } catch (error) {
      console.error("Error loading restaurants:", error);
      setRestaurants(mockRestaurants);
    }
  };

  React.useEffect(() => {
    loadRestaurants();
  }, []);

  // Ensure Home list reflects latest offers/items after partner changes
  React.useEffect(() => {
    if (currentPage === "home") {
      loadRestaurants();
    }
  }, [currentPage]);

  const handleRestaurantSelection = async (restaurant) => {
    const id = restaurant._id || restaurant.id;
    const highlight =
      restaurant._highlightItemId || restaurant.highlightedItemId || null;
    let enriched = restaurant;

    try {
      const fetched = await apiClient.getRestaurantById(id);
      if (fetched) {
        enriched = mergeWithMockItems({ ...restaurant, ...fetched });
      }
    } catch (error) {
      console.error("Error loading restaurant details, using fallback", error);
      const fallback = mergeWithMockItems(restaurant);
      enriched = fallback;
    }

    setSelectedRestaurant(enriched);
    setHighlightedItemId(highlight);
    setCurrentPage("restaurant");
  };

  // Cart Management
  const addToCart = (item, restaurantId) => {
    const customerToken = localStorage.getItem("authToken");
    if (!customerToken) {
      // Gate cart actions behind login
      setShowLoginModal(true);
      return;
    }

    const existingItem = cart.find((c) => c.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1, restaurantId }]);
    }
  };

  const removeFromCart = (itemId, removeAll = false) => {
    const item = cart.find((c) => c.id === itemId);
    if (removeAll || item.quantity <= 1) {
      setCart(cart.filter((c) => c.id !== itemId));
    } else {
      setCart(
        cart.map((c) =>
          c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const now = new Date();
    const hasActiveFreeDelivery = cart.some((item) => {
      const expiresAt = item?.offerExpires ? new Date(item.offerExpires) : null;
      return !!item?.freeDelivery && (!expiresAt || expiresAt > now);
    });
    const deliveryFee =
      cart.length > 0
        ? hasActiveFreeDelivery
          ? 0
          : selectedRestaurant?.deliveryFee || 30
        : 0;
    return { subtotal, deliveryFee, total: subtotal + deliveryFee };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        location={location}
        cart={cart}
        loggedInPartner={loggedInPartner}
        onLogout={() => {
          setLoggedInPartner(null);
          setCurrentPage("home");
        }}
        onShowLogin={() => setShowLoginModal(true)}
        language={language}
        setLanguage={setLanguage}
      />

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLogin={(userData, userType) => {
            if (userType === "customer") {
              setShowLoginModal(false);
              setCurrentPage("customer-profile");
            } else {
              setLoggedInPartner(userData);
              setShowLoginModal(false);
              setCurrentPage("partner-dashboard");
            }
          }}
          onNavigateToSignup={() => {
            setShowLoginModal(false);
            setCurrentPage("customer-signup");
          }}
          onNavigateToForgotPassword={(userType) => {
            setShowLoginModal(false);
            setCurrentPage(userType === "partner" ? "forgot-password-partner" : "forgot-password-customer");
          }}
          language={language}
        />
      )}

      {/* Page Routes */}
      {currentPage === "home" && (
        <HomePage
          restaurants={restaurants}
          setCurrentPage={setCurrentPage}
          setSelectedRestaurant={setSelectedRestaurant}
          onSelectRestaurant={handleRestaurantSelection}
          onAddToCart={addToCart}
          cart={cart}
          language={language}
        />
      )}

      {currentPage === "restaurant" && selectedRestaurant && (
        <RestaurantPage
          restaurant={selectedRestaurant}
          setCurrentPage={setCurrentPage}
          highlightedItemId={highlightedItemId}
          onAddToCart={addToCart}
        />
      )}

      {currentPage === "checkout" && (
        <CheckoutPage
          cart={cart}
          selectedRestaurant={selectedRestaurant}
          setCurrentPage={setCurrentPage}
          onRemoveFromCart={removeFromCart}
          onAddToCart={addToCart}
          onClearCart={clearCart}
        />
      )}

      {currentPage === "restaurant-partner" && (
        <RestaurantPartnerPage
          setCurrentPage={setCurrentPage}
          onPartnerRegistered={loadRestaurants}
        />
      )}

      {currentPage === "partner-dashboard" && loggedInPartner && (
        <PartnerDashboard
          loggedInPartner={loggedInPartner}
          analyticsData={getAnalyticsData(loggedInPartner.id)}
          setCurrentPage={setCurrentPage}
        />
      )}

      {currentPage === "partner-settings" && loggedInPartner && (
        <PartnerSettingsPage
          setCurrentPage={setCurrentPage}
          partnerData={loggedInPartner}
        />
      )}

      {currentPage === "shop-management" && loggedInPartner && (
        <ShopManagementPage
          setCurrentPage={setCurrentPage}
          partnerData={loggedInPartner}
        />
      )}

      {currentPage === "customer-signup" && (
        <CustomerSignupPage setCurrentPage={setCurrentPage} />
      )}

      {currentPage === "customer-profile" && (
        <CustomerProfilePage
          onLogout={() => setLoggedInPartner(null)}
          onNavigate={setCurrentPage}
          language={language}
        />
      )}

      {currentPage === "order-tracking" && (
        <CustomerOrderTrackingPage setCurrentPage={setCurrentPage} />
      )}

      {currentPage === "forgot-password-customer" && (
        <ForgotPasswordPage
          setCurrentPage={setCurrentPage}
          userType="customer"
        />
      )}

      {currentPage === "forgot-password-partner" && (
        <ForgotPasswordPage
          setCurrentPage={setCurrentPage}
          userType="partner"
        />
      )}

      {currentPage === "reset-password" && (
        <ResetPasswordPage setCurrentPage={setCurrentPage} />
      )}

      <Footer language={language} />
    </div>
  );
};

export default App;
