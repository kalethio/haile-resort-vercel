// app/admin/8systemAdmin/api-connections/components/PaymentConnectionsTab.tsx - COMPLETE REWRITE
"use client";
import { useState, useEffect } from "react";
import AddPaymentModal from "./AddPaymentModal";

interface ApiConnection {
  id: number;
  name: string;
  type: string;
  status: string;
  config: any;
  lastTest: string | null;
  createdAt: string;
}

export default function PaymentConnectionsTab() {
  const [connections, setConnections] = useState<ApiConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/api-connections?type=payment");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      setConnections(data);
    } catch (error) {
      console.error("Failed to fetch connections:", error);
      setError("Unable to load payment connections. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  // Add this function in the PaymentConnectionsTab component:
  const deleteConnection = async (id: number) => {
    if (!confirm("Are you sure you want to delete this payment provider?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/api-connections/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchConnections();
      } else {
        throw new Error("Failed to delete");
      }
    } catch (error) {
      console.error("Failed to delete connection:", error);
      setError("Failed to delete payment provider.");
    }
  };
  useEffect(() => {
    fetchConnections();
  }, []);

  const toggleStatus = async (id: number, currentStatus: string) => {
    try {
      const response = await fetch(`/api/admin/api-connections/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus === "active" ? "inactive" : "active",
        }),
      });

      if (response.ok) {
        fetchConnections(); // Refresh list
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
      setError("Failed to update payment provider status.");
    }
  };

  const handleSuccess = () => {
    fetchConnections();
    setShowAddModal(false);
  };

  const getConnectionType = (config: any) => {
    return config?.bankName ? "Bank Transfer" : "Payment Gateway";
  };

  const getConnectionDetails = (config: any) => {
    if (config?.bankName) {
      return `${config.bankName} • ${config.accountNumber}`;
    }
    return config?.isTestMode ? "Test Mode" : "Live Mode";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading payment connections...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">
            Payment Providers
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure payment methods for guest bookings
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Add Payment Provider
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-red-500">⚠️</div>
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {connections.length === 0 && !error && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <div className="text-gray-400 text-6xl mb-6">💳</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            No Payment Providers
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
            Set up payment providers to accept bookings. You can configure bank
            transfers or payment gateways like Chapa and Stripe.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
            >
              Add Bank Transfer
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
            >
              Add Payment Gateway
            </button>
          </div>
        </div>
      )}

      {/* Connections List */}
      {connections.length > 0 && (
        <div className="space-y-4">
          {connections.map((connection) => (
            <div
              key={connection.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start">
                {/* Connection Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        connection.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      }`}
                    ></div>
                    <h3 className="font-semibold text-black text-lg">
                      {connection.name}
                    </h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {getConnectionType(connection.config)}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <p>{getConnectionDetails(connection.config)}</p>

                    {/* Bank Specific Details */}
                    {connection.config?.bankName && (
                      <div className="flex gap-4 text-xs">
                        <span>SWIFT: {connection.config.swiftCode}</span>
                        <span>Branch: {connection.config.branch}</span>
                      </div>
                    )}

                    {/* Status and Date */}
                    <div className="flex gap-4 text-xs text-gray-500">
                      <span>
                        Status:{" "}
                        <span
                          className={
                            connection.status === "active"
                              ? "text-green-600 font-medium"
                              : "text-gray-600"
                          }
                        >
                          {connection.status}
                        </span>
                      </span>
                      <span>
                        Added:{" "}
                        {new Date(connection.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Instructions Preview */}
                  {connection.config?.instructions &&
                    connection.config.instructions.length > 0 && (
                      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-blue-800 mb-2">
                          Payment Instructions:
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1">
                          {connection.config.instructions
                            .slice(0, 3)
                            .map((instruction: string, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <span>•</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          {connection.config.instructions.length > 3 && (
                            <li className="text-blue-600 text-xs">
                              +{connection.config.instructions.length - 3} more
                              instructions
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() =>
                      toggleStatus(connection.id, connection.status)
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      connection.status === "active"
                        ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    {connection.status === "active" ? "Deactivate" : "Activate"}
                  </button>

                  {/* Add this delete button */}
                  <button
                    onClick={() => deleteConnection(connection.id)}
                    className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Active Provider Badge */}
              {connection.status === "active" && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium">Active Provider</span>
                    <span className="text-gray-500">
                      • This provider is currently accepting payments
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddPaymentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleSuccess}
      />

      {/* Help Text */}
      {connections.length > 0 && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-start gap-3">
            <div className="text-gray-500 mt-0.5">💡</div>
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                Payment Provider Tips
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Only one provider can be active at a time</li>
                <li>
                  • Bank transfers are recommended for local Ethiopian bookings
                </li>
                <li>
                  • Payment gateways like Chapa work better for international
                  guests
                </li>
                <li>• Test your configuration before activating</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
