// app/admin/8systemAdmin/api-connections/page.tsx
"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import PaymentConnectionsTab from "./components/PaymentConnectionsTab";
import EmailConnectionsTab from "./components/EmailConnectionsTab";
import OtherConnectionsTab from "./components/OtherConnectionsTab";

export default function ApiConnections() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("payment");

  const tabs = [
    { id: "payment", label: "Payment", requiredRole: ["SUPER_ADMIN"] },
    { id: "email", label: "Email", requiredRole: ["SUPER_ADMIN", "ADMIN"] },
    { id: "other", label: "Other", requiredRole: ["SUPER_ADMIN"] },
  ];

  const filteredTabs = tabs.filter((tab) =>
    tab.requiredRole.includes(session?.user.role)
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">API Connections</h1>
        <p className="text-gray-600 mt-1">
          Configure external integrations and services
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1 w-fit">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Render Active Tab */}
      {activeTab === "payment" && <PaymentConnectionsTab />}
      {activeTab === "email" && <EmailConnectionsTab />}
      {activeTab === "other" && <OtherConnectionsTab />}
    </div>
  );
}
