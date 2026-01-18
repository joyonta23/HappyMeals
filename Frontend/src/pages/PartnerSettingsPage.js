import React, { useState } from "react";
import { Lock, ArrowLeft, Copy, Check, Upload } from "lucide-react";
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

  const [imageStatus, setImageStatus] = useState({
    loading: false,
    success: null,
    error: null,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setImageStatus({
          loading: false,
          success: null,
          error: "Image must be less than 2MB",
        });
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImageStatus({ loading: false, success: null, error: null });
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setImageStatus({
        loading: false,
        success: null,
        error: "Please select an image first",
      });
      return;
    }

    setImageStatus({ loading: true, success: null, error: null });

    try {
      const token = localStorage.getItem("partnerToken");
      const formData = new FormData();
      formData.append("image", selectedImage);

      const response = await apiClient.updateRestaurantImage(formData, token);

      if (response?.message && response?.image) {
        setImageStatus({
          loading: false,
          success: "Restaurant image updated successfully!",
          error: null,
        });
        // Update partnerData if needed
        if (partnerData?.restaurant) {
          partnerData.restaurant.image = response.image;
        }
        // Clear selection after successful upload
        setTimeout(() => {
          setSelectedImage(null);
          setImagePreview(null);
        }, 2000);
      } else {
        setImageStatus({
          loading: false,
          success: null,
          error: response?.message || "Failed to update image",
        });
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setImageStatus({
        loading: false,
        success: null,
        error: "Error uploading image. Please try again.",
      });
    }
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
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Restaurant Image
                </label>
                <div className="space-y-3">
                  {/* Current Image */}
                  {partnerData?.restaurant?.image && (
                    <div className="bg-white border border-gray-300 rounded-lg p-3">
                      <img
                        src={partnerData.restaurant.image}
                        alt="Restaurant"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="bg-white border border-orange-300 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Upload Controls */}
                  <div className="flex items-center gap-2">
                    <label className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition border border-gray-300">
                        <Upload size={18} />
                        <span className="text-sm">
                          {selectedImage ? selectedImage.name : "Choose Image"}
                        </span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    {selectedImage && (
                      <button
                        onClick={handleImageUpload}
                        disabled={imageStatus.loading}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {imageStatus.loading ? "Uploading..." : "Upload"}
                      </button>
                    )}
                  </div>

                  {/* Image Status Messages */}
                  {imageStatus.success && (
                    <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-2">
                      {imageStatus.success}
                    </div>
                  )}
                  {imageStatus.error && (
                    <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                      {imageStatus.error}
                    </div>
                  )}
                  <p className="text-xs text-gray-500">
                    Maximum file size: 2MB. Supported formats: JPG, PNG, GIF
                  </p>
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
