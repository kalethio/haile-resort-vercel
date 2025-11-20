// app/admin/8systemAdmin/api-connections/components/EmailConnectionsTab.tsx - COMPLETE REWRITE
"use client";
import { useState, useEffect } from "react";
import AddEmailModal from "./AddEmailModal";

interface EmailConnection {
  id: number;
  name: string;
  type: string;
  status: string;
  config: any;
  lastTest: string | null;
  createdAt: string;
}

export default function EmailConnectionsTab() {
  const [connections, setConnections] = useState<EmailConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConnections = async () => {
    try {
      setError(null);
      const response = await fetch("/api/admin/api-connections?type=email");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();
      setConnections(data);
    } catch (error) {
      console.error("Failed to fetch email connections:", error);
      setError("Unable to load email services. Please try again.");
    } finally {
      setLoading(false);
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
        fetchConnections();
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
      setError("Failed to update email service status.");
    }
  };

  const deleteConnection = async (id: number) => {
    if (!confirm("Are you sure you want to delete this email service?")) {
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
      setError("Failed to delete email service.");
    }
  };

  const testConnection = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/api-connections/${id}/test`, {
        method: "POST",
      });

      if (response.ok) {
        alert("Test email sent successfully!");
        fetchConnections(); // Refresh to update lastTest timestamp
      } else {
        throw new Error("Test failed");
      }
    } catch (error) {
      console.error("Failed to test connection:", error);
      alert("Failed to send test email. Please check your configuration.");
    }
  };

  const handleSuccess = () => {
    fetchConnections();
    setShowAddModal(false);
  };

  const getConnectionType = (config: any) => {
    return config?.host ? "SMTP" : "SendGrid";
  };

  const getConnectionDetails = (config: any) => {
    if (config?.host) {
      return `${config.host}:${config.port}`;
    }
    return config?.apiKey ? "API Key configured" : "Not configured";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading email services...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">Email Services</h2>
          <p className="text-sm text-gray-600 mt-1">
            Configure email providers for sending booking confirmations and
            payment instructions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors font-medium"
        >
          Add Email Service
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
          <div className="text-gray-400 text-6xl mb-6">✉️</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-3">
            No Email Services
          </h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6 leading-relaxed">
            Set up email services to send booking confirmations and payment
            instructions to guests. You can configure SMTP or SendGrid.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium transition-colors"
          >
            Add Email Service
          </button>
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

                    {/* SMTP Specific Details */}
                    {connection.config?.host && (
                      <div className="flex gap-4 text-xs">
                        <span>From: {connection.config.fromEmail}</span>
                        <span>
                          Secure: {connection.config.secure ? "Yes" : "No"}
                        </span>
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
                      {connection.lastTest && (
                        <span>
                          Last Test:{" "}
                          {new Date(connection.lastTest).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => testConnection(connection.id)}
                    className="px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Test
                  </button>

                  <button
                    onClick={() =>
                      toggleStatus(connection.id, connection.status)
                    }
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      connection.status === "active"
                        ? "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                        : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    {connection.status === "active" ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => deleteConnection(connection.id)}
                    className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Active Service Badge */}
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
                    <span className="font-medium">Active Service</span>
                    <span className="text-gray-500">
                      • This service is currently sending emails
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <AddEmailModal
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
                Email Service Tips
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Only one service can be active at a time</li>
                <li>• Test your configuration before activating</li>
                <li>• SMTP is recommended for most hosting providers</li>
                <li>• SendGrid works better for high-volume sending</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
