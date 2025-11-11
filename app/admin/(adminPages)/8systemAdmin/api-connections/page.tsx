// D:\(adminPages)\8systemAdmin\api-connections\page.tsx
"use client";
import { useState } from "react";

const apiTemplates = {
  payment: ["Stripe", "PayPal", "Razorpay"],
  email: ["SendGrid", "Mailgun", "AWS SES"],
  pms: ["Cloudbeds", "SiteMinder", "Booking.com"],
  channels: ["Expedia", "Airbnb", "Agoda"],
};

const configuredApis = [
  {
    id: 1,
    name: "Stripe Payments",
    type: "payment",
    status: "active",
    lastSync: "2024-01-15",
    usage: "2,450 transactions",
  },
];

export default function ApiConnections() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showConfig, setShowConfig] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-accent">API Connections</h1>
        <button className="bg-accent text-white px-4 py-2 rounded">
          Add Integration
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "all" ? "bg-accent text-white" : "bg-gray-100"}`}
        >
          All
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "payment" ? "bg-accent text-white" : "bg-gray-100"}`}
        >
          Payment
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedCategory === "email" ? "bg-accent text-white" : "bg-gray-100"}`}
        >
          Email
        </button>
      </div>

      {/* Configured APIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {configuredApis.map((api) => (
          <div key={api.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-accent">{api.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs ${api.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {api.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Last sync: {api.lastSync}
            </p>
            <p className="text-sm text-gray-600 mb-4">Usage: {api.usage}</p>
            <div className="flex gap-2">
              <button className="text-sm text-accent hover:underline">
                Test
              </button>
              <button className="text-sm text-accent hover:underline">
                Logs
              </button>
              <button className="text-sm text-red-600 hover:underline">
                Disable
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Available Integrations */}
      <div>
        <h2 className="text-xl font-semibold text-accent mb-4">
          Available Integrations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {apiTemplates.payment.map((service) => (
            <div key={service} className="border rounded-lg p-4 text-center">
              <h3 className="font-semibold text-accent mb-2">{service}</h3>
              <p className="text-sm text-gray-600 mb-4">Payment Gateway</p>
              <button
                className="bg-accent text-white px-4 py-2 rounded text-sm"
                onClick={() => setShowConfig(true)}
              >
                Configure
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
