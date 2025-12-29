import React, { useState } from "react";
import { Lock, ArrowLeft, Copy, Check } from "lucide-react";
import { apiClient } from "../services/api";

export const PartnerSettingsPage = ({ setCurrentPage, partnerData }) => {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const [copied, setCopied] = useState(false);

  const handleCopyPartnerId = () => {
    navigator.clipboard.writeText(partnerData?.partnerId || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    // Validation
    if (!passwordForm.currentPassword) {
      setStatus({
        loading: false,
        success: null,
        error: "Current password is required",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setStatus({
        loading: false,
        success: null,
        error: "New password must be at least 6 characters",
      });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setStatus({
        loading: false,
        success: null,
        error: "Passwords do not match",
      });
      return;
    }

    try {
      const token = localStorage.getItem("partnerToken");
      const response = await apiClient.changePartnerPassword(
        passwordForm.currentPassword,
        passwordForm.newPassword,
        token
      );

      if (response?.message) {
        setStatus({
          loading: false,
          success: "Password changed successfully!",
          error: null,
        });
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        setStatus({
          loading: false,
          success: null,
          error: response?.message || "Failed to change password",
        });
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setStatus({
        loading: false,
        success: null,
        error: "Error changing password. Please try again.",
      });
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-8">
        <div className="container mx-auto px-4">
          <button
            onClick={() => setCurrentPage("partner-dashboard")}
            className="flex items-center gap-2 text-orange-100 hover:text-white mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Partner Settings</h1>
          <p className="text-orange-100 mt-2">
            Manage your account and security
          </p>
        </div>
      </div>

      {/* Settings Container */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl">
          {/* Partner Info Section */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800">
              Account Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Partner ID
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-gray-300 rounded-lg p-3 text-gray-800 font-mono text-sm break-all">
                    {partnerData?.partnerId || "Not available"}
                  </div>
                  <button
                    onClick={handleCopyPartnerId}
                    className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition flex items-center gap-1"
                    title="Copy Partner ID"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800">
                  {partnerData?.email || "Not available"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Restaurant Name
                </label>
                <div className="bg-white border border-gray-300 rounded-lg p-3 text-gray-800">
                  {partnerData?.restaurant?.name ||
                    partnerData?.restaurantName ||
                    "Not available"}
                </div>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Lock size={24} className="text-orange-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Change Password
              </h2>
            </div>

            {status.success && (
              <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-800">
                {status.success}
              </div>
            )}
            {status.error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                {status.error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your current password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter a new password (minimum 6 characters)"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm your new password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status.loading ? "Updating Password..." : "Update Password"}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong>Security Tip:</strong> Use a strong password with a mix
                of uppercase, lowercase, numbers, and special characters to keep
                your account safe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
