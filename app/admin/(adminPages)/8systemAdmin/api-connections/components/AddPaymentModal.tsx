// app/admin/8systemAdmin/api-connections/components/AddPaymentModal.tsx
"use client";
import { useState } from "react";

interface AddPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddPaymentModal({
  isOpen,
  onClose,
  onSuccess,
}: AddPaymentModalProps) {
  const [paymentType, setPaymentType] = useState<"bank" | "gateway">("bank");
  const [formData, setFormData] = useState({
    name: "",
    // Bank transfer fields
    bankName: "",
    accountNumber: "",
    accountName: "",
    swiftCode: "",
    branch: "",
    contactPhone: "",
    contactEmail: "",
    instructions: "",
    // Gateway fields
    apiKey: "",
    secretKey: "",
    webhookUrl: "",
    isTestMode: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config =
      paymentType === "bank"
        ? {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName,
            swiftCode: formData.swiftCode,
            branch: formData.branch,
            contactPhone: formData.contactPhone,
            contactEmail: formData.contactEmail,
            instructions: formData.instructions
              .split("\n")
              .filter((i) => i.trim()),
          }
        : {
            apiKey: formData.apiKey,
            secretKey: formData.secretKey,
            webhookUrl: formData.webhookUrl,
            isTestMode: formData.isTestMode,
          };

    try {
      const response = await fetch("/api/admin/api-connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          type: "payment",
          config,
          apiKey: paymentType === "gateway" ? formData.apiKey : null,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create payment connection:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Add Payment Provider</h2>

        {/* Payment Type Selection */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setPaymentType("bank")}
            className={`flex-1 py-2 rounded-md ${
              paymentType === "bank"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Bank Transfer
          </button>
          <button
            type="button"
            onClick={() => setPaymentType("gateway")}
            className={`flex-1 py-2 rounded-md ${
              paymentType === "gateway"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            Payment Gateway
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Provider Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Bank of Abyssinia, Chapa, Stripe"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {paymentType === "bank" ? (
            /* Bank Transfer Form */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.bankName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        bankName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Account Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.accountNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountNumber: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.accountName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      accountName: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SWIFT Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.swiftCode}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        swiftCode: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Branch
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.branch}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        branch: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contactPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactPhone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.contactEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instructions: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Use booking reference as description&#10;Email confirmation to finance@..."
                />
              </div>
            </div>
          ) : (
            /* Payment Gateway Form */
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  required
                  value={formData.apiKey}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, apiKey: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Secret Key
                </label>
                <input
                  type="password"
                  required
                  value={formData.secretKey}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secretKey: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Webhook URL
                </label>
                <input
                  type="url"
                  value={formData.webhookUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      webhookUrl: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://your-domain.com/api/webhooks/payment"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="testMode"
                  checked={formData.isTestMode}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isTestMode: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="testMode" className="text-sm text-gray-700">
                  Test Mode
                </label>
              </div>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add Provider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
