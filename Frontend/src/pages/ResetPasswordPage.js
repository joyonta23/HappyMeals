import React, { useState, useEffect } from "react";
import { Lock, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { apiClient } from "../services/api";

export const ResetPasswordPage = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: null,
  });
  const [token, setToken] = useState("");
  const [userType, setUserType] = useState("customer");

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    const typeParam = urlParams.get("type");

    if (tokenParam) setToken(tokenParam);
    if (typeParam) setUserType(typeParam);

    if (!tokenParam) {
      setStatus({
        loading: false,
        success: false,
        error: "Invalid reset link. Please request a new password reset.",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: null });

    // Validation
    if (formData.newPassword.length < 6) {
      setStatus({
        loading: false,
        success: false,
        error: "Password must be at least 6 characters",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({
        loading: false,
        success: false,
        error: "Passwords do not match",
      });
      return;
    }

    try {
      const response = userType === "customer"
        ? await apiClient.customerResetPassword(token, formData.newPassword)
        : await apiClient.partnerResetPassword(token, formData.newPassword);

      if (response?.message === "Password reset successful") {
        setStatus({ loading: false, success: true, error: null });
        // Redirect to login after 3 seconds
        setTimeout(() => {
          if (userType === "customer") {
            setCurrentPage("home");
          } else {
            setCurrentPage("partner-login");
          }
        }, 3000);
      } else {
        setStatus({
          loading: false,
          success: false,
          error: response?.message || "Failed to reset password",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setStatus({
        loading: false,
        success: false,
        error: "Error resetting password. Please try again.",
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
            <Lock className="text-orange-600" size={32} />
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Enter your new password below.
          </p>

          {status.success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 flex-shrink-0" size={20} />
                <div>
                  <p className="text-green-800 font-medium mb-1">Password reset successful!</p>
                  <p className="text-green-700 text-sm">
                    Redirecting you to login page...
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status.error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <p className="text-red-800 text-sm">{status.error}</p>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading || !token}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status.loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
