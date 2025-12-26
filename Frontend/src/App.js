import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { LoginModal } from "./components/LoginModal";
import { HomePage } from "./pages/HomePage";
import { RestaurantPage } from "./pages/RestaurantPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { PartnerDashboard } from "./pages/PartnerDashboard";
import { RestaurantPartnerPage } from "./pages/RestaurantPartnerPage";
import { CustomerSignupPage } from "./pages/CustomerSignupPage";
import { CustomerProfilePage } from "./pages/CustomerProfilePage";

// Mock Data - Replace with API calls
const mockRestaurants = [
  {
    id: 1,
    name: "দেশী",
    cuisine: "Fast Food",
    rating: 4.5,
    deliveryFee: 29,
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
    ],
  },
  {
    id: 2,
    name: "Astana",
    cuisine: "bangali food",
    rating: 4.3,
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
    ],
  },
  {
    id: 4,
    name: "Cuet Cafeteria",
    cuisine: "Chinese and Bangla",
    rating: 4.4,
    deliveryFee: 30,
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
  const [currentPage, setCurrentPage] = useState("home");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [location, setLocation] = useState("Chattogram");
  const [loggedInPartner, setLoggedInPartner] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [restaurants, setRestaurants] = useState(mockRestaurants);
  const [language, setLanguage] = useState("EN");

  // Fetch restaurants (replace with API call)
  const loadRestaurants = async () => {
    try {
      // const data = await apiClient.getRestaurants();
      // setRestaurants(data);
      // For now using mock data
    } catch (error) {
      console.error("Error loading restaurants:", error);
    }
  };

  React.useEffect(() => {
    loadRestaurants();
  }, []);

  // Cart Management
  const addToCart = (item, restaurantId) => {
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

  const getTotalPrice = () => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const deliveryFee =
      cart.length > 0 ? selectedRestaurant?.deliveryFee || 30 : 0;
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
          onNavigateToSignup={() => setCurrentPage("customer-signup")}
          language={language}
        />
      )}

      {/* Page Routes */}
      {currentPage === "home" && (
        <HomePage
          restaurants={restaurants}
          setCurrentPage={setCurrentPage}
          setSelectedRestaurant={setSelectedRestaurant}
          onAddToCart={addToCart}
          cart={cart}
          language={language}
        />
      )}

      {currentPage === "restaurant" && selectedRestaurant && (
        <RestaurantPage
          restaurant={selectedRestaurant}
          setCurrentPage={setCurrentPage}
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
        />
      )}

      {currentPage === "restaurant-partner" && (
        <RestaurantPartnerPage setCurrentPage={setCurrentPage} />
      )}

      {currentPage === "partner-dashboard" && loggedInPartner && (
        <PartnerDashboard
          loggedInPartner={loggedInPartner}
          analyticsData={getAnalyticsData(loggedInPartner.id)}
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

      <Footer language={language} />
    </div>
  );
};

export default App;
