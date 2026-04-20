"use client";

import { useState } from "react";
import { X, Eye, EyeOff, Loader2 } from "lucide-react";
import { validatePassword, checkPasswordStrength } from "@/lib/password-utils";

interface ChangePasswordModalProps {
  userId?: string;
  userEmail: string;
  onClose: () => void;
}

export default function ChangePasswordModal({
  userId,
  userEmail,
  onClose,
}: ChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const strength = checkPasswordStrength(newPassword);
  const getStrengthColor = () => {
    if (strength.score < 60) return "bg-red-500";
    if (strength.score < 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate new password
    const validation = validatePassword(newPassword);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/users/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email: userEmail,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Password changed successfully!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.error || "Failed to change password");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-black">Change Password</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded">
              <p className="text-sm">{success}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                required
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-black"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                required
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-black"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {newPassword && (
              <div className="mt-2 space-y-1">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <ul className="text-xs space-y-0.5">
                  <li
                    className={
                      strength.checks.length
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ At least 8 characters
                  </li>
                  <li
                    className={
                      strength.checks.uppercase
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Uppercase letter
                  </li>
                  <li
                    className={
                      strength.checks.lowercase
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Lowercase letter
                  </li>
                  <li
                    className={
                      strength.checks.number
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Number
                  </li>
                  <li
                    className={
                      strength.checks.special
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    ✓ Special character (!@#$%^&*)
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                required
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:border-black"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-black rounded-lg py-2 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin mx-auto h-5 w-5" />
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
