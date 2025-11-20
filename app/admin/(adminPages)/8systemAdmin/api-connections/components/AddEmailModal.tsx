"use client";
import { useState } from "react";

interface AddEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddEmailModal({
  isOpen,
  onClose,
  onSuccess,
}: AddEmailModalProps) {
  const [emailType, setEmailType] = useState<"smtp" | "sendgrid">("smtp");
  const [formData, setFormData] = useState({
    name: "",
    // SMTP fields
    host: "",
    port: "587",
    secure: false,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "",
    // SendGrid fields
    apiKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const config =
      emailType === "smtp"
        ? {
            host: formData.host,
            port: parseInt(formData.port),
            secure: formData.secure,
            username: formData.username,
            password: formData.password,
            fromEmail: formData.fromEmail,
            fromName: formData.fromName,
          }
        : {
            apiKey: formData.apiKey,
            fromEmail: formData.fromEmail,
            fromName: formData.fromName,
          };

    try {
      const response = await fetch("/api/admin/api-connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          type: "email",
          config,
          apiKey: emailType === "sendgrid" ? formData.apiKey : null,
        }),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Failed to create email connection:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Add Email Service</h2>

        {/* Email Type Selection */}
        <div className="flex gap-2 mb-6">
          <button
            type="button"
            onClick={() => setEmailType("smtp")}
            className={`flex-1 py-2 rounded-md ${
              emailType === "smtp"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            SMTP
          </button>
          <button
            type="button"
            onClick={() => setEmailType("sendgrid")}
            className={`flex-1 py-2 rounded-md ${
              emailType === "sendgrid"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            SendGrid
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="e.g., Company SMTP, SendGrid Production"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {emailType === "smtp" ? (
            /* SMTP Form */
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.host}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, host: e.target.value }))
                    }
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Port
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.port}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, port: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.fromEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromEmail: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fromName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromName: e.target.value,
                      }))
                    }
                    placeholder="Haile Resorts"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="secure"
                  checked={formData.secure}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      secure: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded"
                />
                <label htmlFor="secure" className="text-sm text-gray-700">
                  Use SSL/TLS
                </label>
              </div>
            </div>
          ) : (
            /* SendGrid Form */
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.fromEmail}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromEmail: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fromName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fromName: e.target.value,
                      }))
                    }
                    placeholder="Haile Resorts"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
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
              Add Email Service
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
