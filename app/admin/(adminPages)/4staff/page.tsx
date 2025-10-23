// /app/admin/(adminPages)/inventory/page.tsx
"use client";
import React, { useState, useEffect } from "react";

interface RoomInventory {
  id: number;
  name: string;
  basePrice: number;
  capacity: number;
  branch: {
    branchName: string;
    slug: string;
  };
  inventory: {
    total: number;
    occupied: number;
    available: number;
    occupancyRate: number;
  };
  status: string;
}

interface Branch {
  id: number;
  branchName: string;
  slug: string;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<RoomInventory[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
    fetchInventory();
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches-list");
      if (response.ok) {
        const data = await response.json();
        setBranches(data.branches || []);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBranch !== "all") params.append("branch", selectedBranch);

      const response = await fetch(`/api/admin/inventory?${params}`);
      if (response.ok) {
        const data = await response.json();
        setInventory(data.inventory || []);
      }
    } catch (error) {
      console.error("Failed to fetch inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-green-100 text-green-800";
      case "SOLD_OUT":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return "text-red-600";
    if (rate >= 60) return "text-orange-600";
    return "text-green-600";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Room Inventory</h1>
          <p className="text-gray-600">
            Manage room availability and occupancy
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.slug}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Cards */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {room.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {room.branch.branchName}
                  </p>
                </div>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    room.status
                  )}`}
                >
                  {room.status.replace("_", " ")}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{room.capacity} guests</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">${room.basePrice}/night</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Rooms:</span>
                    <span className="font-medium">
                      {room.inventory.available}/{room.inventory.total}{" "}
                      available
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${getOccupancyColor(
                        room.inventory.occupancyRate
                      )}`}
                      style={{ width: `${room.inventory.occupancyRate}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Occupancy</span>
                    <span
                      className={getOccupancyColor(
                        room.inventory.occupancyRate
                      )}
                    >
                      {room.inventory.occupancyRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && inventory.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🏨</div>
          <h3 className="text-xl font-light text-gray-900 mb-2">
            No Rooms Found
          </h3>
          <p className="text-gray-600">
            No room inventory available for the selected branch.
          </p>
        </div>
      )}
    </div>
  );
}
