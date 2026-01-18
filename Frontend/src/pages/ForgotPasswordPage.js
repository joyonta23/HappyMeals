import React, { useState } from "react";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { apiClient } from "../services/api";

export const ForgotPasswordPage = ({
  setCurrentPage,
  userType = "customer",
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    try {
      const response =
        userType === "customer"
          ? await apiClient.customerForgotPassword(email)
          : await apiClient.partnerForgotPassword(email);

      if (response?.message) {
        setStatus({ loading: false, success: true, error: null });
      } else {
        setStatus({
          loading: false,
          success: false,
          error: response?.message || "Failed to send reset link",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setStatus({
        loading: false,
        success: false,
        error: "Error sending reset link. Please try again.",
      });
    }
  };

  const handleBack = () => {
    if (userType === "customer") {
      setCurrentPage("home");
    } else {
      setCurrentPage("partner-login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Login
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4">
            <Mail className="text-orange-600" size={32} />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Forgot Password?
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your
            password.
          </p>

          {status.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle
                  className="text-green-600 flex-shrink-0"
                  size={20}
                />
                <div>
                  <p className="text-green-800 font-medium mb-1">
                    Check your email!
                  </p>
                  <p className="text-green-700 text-sm">
                    If an account exists with that email, we've sent a password
                    reset link. Check your inbox and spam folder.
                  </p>
                  <p className="text-green-700 text-xs mt-2 bg-green-100 p-2 rounded">
                    📧 The email should arrive within a few minutes. If you
                    don't see it, check your spam/junk folder.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="text-red-600 flex-shrink-0"
                      size={20}
                    />
                    <p className="text-red-800 text-sm">{status.error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status.loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={handleBack}
              className="text-orange-600 hover:text-orange-700 text-sm font-medium"
            >
              Remember your password? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
