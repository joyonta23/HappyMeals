import React, { useState } from "react";
import {
  Search,
  MapPin,
  ShoppingBag,
  User,
  ChevronRight,
  Package,
  X,
  Rocket,
  TrendingUp,
  Award,
} from "lucide-react";
import { useTranslation } from "../utils/translations";

export const Navbar = ({
  currentPage,
  setCurrentPage,
  location,
  cart,
  loggedInPartner,
  onLogout,
  onShowLogin,
  language,
  setLanguage,
}) => {
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const t = useTranslation(language);

  const handleLoginClick = () => {
    if (typeof onShowLogin === "function") {
      onShowLogin();
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  return (
    <>
      {/* Enhanced Top Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 text-white py-3 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="container mx-auto relative z-10">
          <div className="flex items-center justify-between">
            {/* Left Section - Delivery Info */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer">
                <Package size={20} className="animate-bounce-subtle" />
                <span className="text-sm font-semibold">
                  {t('deliverWithHappyMeal')}
                </span>
              </div>

              <div className="hidden md:flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full">
                <TrendingUp size={16} />
                <span className="text-xs font-medium">
                  {t('fastReliableService')}
                </span>
              </div>
            </div>

            {/* Center Section - Partner CTA */}
            <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
              <button
                onClick={() => setCurrentPage("restaurant-partner")}
                className="group flex items-center gap-3 bg-white text-orange-600 px-6 py-2.5 rounded-full hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-bold"
              >
                <Rocket size={18} className="group-hover:animate-bounce" />
                <span>{t('becomePartner')}</span>
                <Award
                  size={18}
                  className="group-hover:rotate-12 transition-transform"
                />
              </button>
            </div>

            {/* Right Section - Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full">
                <span className="text-2xl">🎉</span>
                <div className="text-left">
                  <div className="text-xs font-medium">10,000+</div>
                  <div className="text-[10px] opacity-90">{t('happyCustomers')}</div>
                </div>
              </div>
            </div>

            {/* Mobile Partner Button */}
            <button
              onClick={() => setCurrentPage("restaurant-partner")}
              className="lg:hidden bg-white text-orange-600 px-4 py-2 rounded-full hover:bg-orange-50 transition-all shadow-md text-sm font-bold flex items-center gap-2"
            >
              <Rocket size={16} />
              <span>{t('partner')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                className="flex items-center gap-3 focus:outline-none"
                onClick={() => setCurrentPage("home")}
                aria-label="Go to home"
              >
                <img
                  src="/logo192.png"
                  alt="happymeal logo"
                  className="w-12 h-12 rounded-full shadow-sm"
                />
                <span className="text-2xl font-bold text-orange-600 cursor-pointer hover:scale-105 transition-transform">
                  HappyMeals
                </span>
              </button>
              <div className="hidden md:flex items-center gap-2 text-gray-700 cursor-pointer hover:text-orange-600 transition group">
                <MapPin
                  size={18}
                  className="text-orange-600 group-hover:animate-bounce"
                />
                <span className="font-medium">{location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {loggedInPartner ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage("partner-dashboard")}
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition"
                  >
                    <User size={18} />
                    <span className="text-sm">{loggedInPartner.ownerName}</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Logout
                  </button>
                </div>
              ) : localStorage.getItem("user") ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setCurrentPage("customer-profile")}
                    className="hidden md:flex items-center gap-2 px-4 py-2 text-orange-600 font-medium hover:bg-orange-50 rounded-lg transition"
                  >
                    <User size={18} />
                    <span className="text-sm">
                      {JSON.parse(localStorage.getItem("user")).name}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      localStorage.removeItem("user");
                      setCurrentPage("home");
                      window.location.reload();
                    }}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {t('logout')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLoginClick}
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <User size={18} />
                  <span className="text-sm font-medium">{t('login')}</span>
                </button>
              )}
              <button
                onClick={() => setCurrentPage("customer-signup")}
                className="bg-orange-600 text-white px-5 py-2 rounded-lg hover:bg-orange-700 transition font-medium text-sm shadow-md hover:shadow-lg hover:scale-105"
              >
                {t('signUpFreeDelivery')}
              </button>

              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                  className="flex items-center gap-1 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition font-medium"
                >
                  <span className="text-sm">{language}</span>
                  <ChevronRight
                    size={14}
                    className={`transform transition ${
                      showLanguageMenu ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {showLanguageMenu && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 w-32 border animate-fadeIn">
                    <button
                      onClick={() => handleLanguageChange("EN")}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700 text-sm ${
                        language === "EN"
                          ? "bg-orange-50 text-orange-600 font-medium"
                          : ""
                      }`}
                    >
                      {t('english')}
                    </button>
                    <button
                      onClick={() => handleLanguageChange("বাংলা")}
                      className={`w-full px-4 py-2 text-left hover:bg-gray-100 text-gray-700 text-sm ${
                        language === "বাংলা"
                          ? "bg-orange-50 text-orange-600 font-medium"
                          : ""
                      }`}
                    >
                      {t('bangla')}
                    </button>
                  </div>
                )}
              </div>

              {/* Cart Icon */}
              <button
                className="relative p-2 hover:bg-gray-50 rounded-lg transition"
                onClick={() => cart.length > 0 && setCurrentPage("checkout")}
              >
                <ShoppingBag size={22} className="text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold animate-pulse">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
