import React, { useState } from "react";
import { X } from "lucide-react";
import { apiClient } from "../services/api";

export const LoginModal = ({ onClose, onLogin, onNavigateToSignup }) => {
  const [loginType, setLoginType] = useState("customer");
  const [partnerId, setPartnerId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (loginType === "partner") {
      try {
        const response = await apiClient.partnerLogin(partnerId, password);
        if (response.token && response.partner) {
          localStorage.setItem("partnerToken", response.token);
          localStorage.setItem("partner", JSON.stringify(response.partner));
          onLogin(response.partner, "partner");
        } else {
          setError(response.message || "Invalid Partner ID or Password");
        }
      } catch (err) {
        setError("Login failed. Please try again.");
      }
    } else {
      try {
        const response = await apiClient.customerLogin(email, password);
        if (response.token && response.user) {
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("user", JSON.stringify(response.user));
          onLogin(response.user, "customer");
        } else {
          setError(response.message || "Invalid email or password");
        }
      } catch (err) {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">
          Login to happymeal
        </h2>

        {/* Login Type Selector */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setLoginType("customer");
              setPartnerId("");
              setEmail("");
              setPassword("");
              setError("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              loginType === "customer"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Customer
          </button>
          <button
            onClick={() => {
              setLoginType("partner");
              setPartnerId("");
              setEmail("");
              setPassword("");
              setError("");
            }}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              loginType === "partner"
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Restaurant Partner
          </button>
        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
          key={loginType}
          autoComplete="off"
        >
          {loginType === "partner" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner ID
                </label>
                <input
                  type="text"
                  name="partner-id-unique"
                  id="partner-id-field"
                  value={partnerId}
                  onChange={(e) => setPartnerId(e.target.value)}
                  placeholder="Enter your Partner ID"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Demo: PARTNER001 or PARTNER002
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="partner-password-unique"
                  id="partner-password-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Demo password: demo123
                </p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="customer-email-unique"
                  id="customer-email-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="off"
                  data-lpignore="true"
                  data-form-type="other"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="customer-password-unique"
                  id="customer-password-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  data-lpignore="true"
                  data-form-type="other"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </>
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{" "}
          <button
            onClick={() => {
              onClose();
              if (onNavigateToSignup) onNavigateToSignup();
            }}
            className="text-orange-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};
