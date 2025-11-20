// app/admin/8systemAdmin/api-connections/components/OtherConnectionsTab.tsx
"use client";
import { useState, useEffect } from "react";

export default function OtherConnectionsTab() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/api-connections?type=other")
      .then((res) => res.json())
      .then(setConnections)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-black">Other Integrations</h2>
        <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          Add Integration
        </button>
      </div>

      {connections.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">🔌</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Integrations
          </h3>
          <p className="text-gray-600">
            Configure other services like PMS or analytics.
          </p>
        </div>
      )}
    </div>
  );
}
