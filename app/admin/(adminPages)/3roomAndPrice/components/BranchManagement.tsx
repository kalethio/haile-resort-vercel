"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfDay,
  endOfDay,
} from "date-fns";
import AddRoomType from "./AddRoomType";
import EditRoomType from "./EditRoomType";

interface RoomTypeReport {
  id: number;
  name: string;
  roomCount: number;
  basePrice: number;
  features: string[];
  occupancyRate: number;
  revenue: number;
  availableRooms: number;
}

interface RoomTypeForEdit {
  id: number;
  name: string;
  description: string;
  adultCapacity: number;
  childCapacity: number;
  basePrice: number;
  totalRooms: number;
  amenities: string[];
  features: string[];
  images: string[];
}

interface BranchMetrics {
  totalRooms: number;
  availableRooms: number;
  avgOccupancy: number;
  totalRevenue: number;
  avgDailyRate: number;
  revPAR: number;
}

interface Branch {
  id: string;
  branchName: string;
}

// API Service Functions
const apiService = {
  async fetchBranch(slug: string): Promise<Branch> {
    const res = await fetch(`/api/branches/${slug}`);
    if (!res.ok) throw new Error(`Failed to fetch branch: ${res.status}`);
    return res.json();
  },

  async fetchBranchReports(slug: string, startDate: Date, endDate: Date) {
    const params = new URLSearchParams({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
    const res = await fetch(
      `/api/admin/rooms-prices/branch-reports/${slug}?${params}`
    );
    if (!res.ok) throw new Error(`Failed to fetch reports: ${res.status}`);
    return res.json();
  },

  async fetchRoomTypeDetails(id: number): Promise<RoomTypeForEdit> {
    const res = await fetch(`/api/admin/rooms-prices/room-types/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch room type: ${res.status}`);
    return res.json();
  },
};

export default function BranchManagement({
  branchSlug,
}: {
  branchSlug: string;
}) {
  const [branch, setBranch] = useState<Branch | null>(null);
  const [reports, setReports] = useState<RoomTypeReport[]>([]);
  const [metrics, setMetrics] = useState<BranchMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [branchLoading, setBranchLoading] = useState(true);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoomType, setEditingRoomType] =
    useState<RoomTypeForEdit | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
  });

  const fetchBranchData = useCallback(async () => {
    setLoading(true);
    setBranchLoading(true);
    setError(null);

    try {
      const [branchData, reportData] = await Promise.all([
        apiService.fetchBranch(branchSlug),
        apiService.fetchBranchReports(
          branchSlug,
          dateRange.startDate,
          dateRange.endDate
        ),
      ]);

      setBranch(branchData);
      setReports(reportData.roomTypes || []);
      setMetrics(reportData.metrics || null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load branch data"
      );
      console.error("Failed to fetch branch data:", err);
    } finally {
      setLoading(false);
      setBranchLoading(false);
    }
  }, [branchSlug, dateRange]);

  useEffect(() => {
    fetchBranchData();
  }, [fetchBranchData]);

  const handleEditRoomType = async (roomType: RoomTypeReport) => {
    setActionLoading(true);
    setError(null);

    try {
      const roomTypeData = await apiService.fetchRoomTypeDetails(roomType.id);
      setEditingRoomType(roomTypeData);
    } catch (err) {
      console.error("Failed to fetch room type details:", err);
      // Fallback to basic data
      const basicRoomType: RoomTypeForEdit = {
        id: roomType.id,
        name: roomType.name,
        description: "",
        adultCapacity: 2,
        childCapacity: 0,
        basePrice: roomType.basePrice,
        totalRooms: roomType.roomCount,
        amenities: [],
        features: roomType.features,
        images: [],
      };
      setEditingRoomType(basicRoomType);
    } finally {
      setActionLoading(false);
    }
  };

  const exportToCSV = () => {
    if (reports.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Room Type",
      "Total Rooms",
      "Base Price ($)",
      "Occupancy Rate (%)",
      "Revenue ($)",
      "Available Rooms",
      "Period",
    ];

    const period = `${format(dateRange.startDate, "MMM d, yyyy")} to ${format(dateRange.endDate, "MMM d, yyyy")}`;

    const csvData = reports.map((roomType) => [
      `"${roomType.name}"`,
      roomType.totalRooms || roomType.roomCount,
      roomType.basePrice,
      roomType.occupancyRate,
      roomType.revenue || 0,
      roomType.availableRooms,
      `"${period}"`,
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `room-report-${branchSlug}-${format(dateRange.startDate, "yyyy-MM-dd")}-to-${format(dateRange.endDate, "yyyy-MM-dd")}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 rounded-lg p-4 h-20 animate-pulse"
            ></div>
          ))}
        </div>
        <div className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
      </div>
    );
  }

  if (!branch) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600 text-lg">Branch not found</div>
        <button
          onClick={fetchBranchData}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {branch.branchName} - Room Management
          </h1>
          <p className="text-gray-600">
            Manage room types, pricing, and view performance reports
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAddRoom(true)}
            disabled={branchLoading}
            className={`px-4 py-2 rounded-lg font-medium ${
              branchLoading
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90"
            }`}
          >
            {branchLoading ? "Loading..." : "+ Add Room Type"}
          </button>
          <button
            onClick={exportToCSV}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Key Metrics - MOVED BELOW HEADER */}
      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            title="Total Rooms"
            value={metrics.totalRooms.toString()}
            description="All room types"
          />
          <MetricCard
            title="Available"
            value={metrics.availableRooms.toString()}
            description="Ready for booking"
          />
          <MetricCard
            title="Avg Occupancy"
            value={`${metrics.avgOccupancy}%`}
            description="Utilization rate"
          />
          <MetricCard
            title="Total Revenue"
            value={`$${metrics.totalRevenue.toLocaleString()}`}
            description="Period total"
          />
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-600 font-medium">Error</div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
          <div className="text-red-600 text-sm mt-1">{error}</div>
        </div>
      )}

      {/* Date Range Selector - WITH BUTTONS AND DIRECT INPUTS */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Period
            </label>
            <div className="flex gap-2 items-center mb-3">
              <button
                onClick={() => {
                  const today = new Date();
                  setDateRange({
                    startDate: startOfDay(today),
                    endDate: endOfDay(today),
                  });
                }}
                className="px-3 py-1 text-sm rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const today = new Date();
                  setDateRange({
                    startDate: startOfMonth(today),
                    endDate: endOfMonth(today),
                  });
                }}
                className="px-3 py-1 text-sm rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              >
                This Month
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="date"
                value={format(dateRange.startDate, "yyyy-MM-dd")}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    startDate: new Date(e.target.value),
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
              <span className="text-gray-600">to</span>
              <input
                type="date"
                value={format(dateRange.endDate, "yyyy-MM-dd")}
                onChange={(e) =>
                  setDateRange((prev) => ({
                    ...prev,
                    endDate: new Date(e.target.value),
                  }))
                }
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-600">
          Showing data from{" "}
          <strong className="text-gray-900">
            {format(dateRange.startDate, "MMM d, yyyy")}
          </strong>{" "}
          to{" "}
          <strong className="text-gray-900">
            {format(dateRange.endDate, "MMM d, yyyy")}
          </strong>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Room Type Report ({format(dateRange.startDate, "MMM d")} -{" "}
            {format(dateRange.endDate, "MMM d, yyyy")})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Room Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Rooms
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Occupancy
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Revenue
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No room types found for the selected period
                  </td>
                </tr>
              ) : (
                reports.map((roomType) => (
                  <tr key={roomType.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {roomType.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {roomType.totalRooms || roomType.roomCount}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      ${roomType.basePrice}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${
                            roomType.occupancyRate > 70
                              ? "text-green-600"
                              : roomType.occupancyRate > 50
                                ? "text-yellow-600"
                                : "text-red-600"
                          }`}
                        >
                          {roomType.occupancyRate}%
                        </span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              roomType.occupancyRate > 70
                                ? "bg-green-500"
                                : roomType.occupancyRate > 50
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{
                              width: `${Math.min(roomType.occupancyRate, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {roomType.availableRooms} of{" "}
                        {roomType.totalRooms || roomType.roomCount} available
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${(roomType.revenue || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleEditRoomType(roomType)}
                        disabled={actionLoading}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          actionLoading
                            ? "bg-gray-400 text-white cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {actionLoading ? "Loading..." : "Edit"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Room Type Modal */}
      {showAddRoom && (
        <AddRoomType
          branchSlug={branchSlug} // Change from branchId to branchSlug
          onClose={() => setShowAddRoom(false)}
          onSuccess={() => {
            setShowAddRoom(false);
            fetchBranchData();
          }}
        />
      )}

      {/* Edit Room Type Modal */}
      {editingRoomType && (
        <EditRoomType
          roomType={editingRoomType}
          branchSlug={branchSlug}
          onClose={() => setEditingRoomType(null)}
          onSuccess={() => {
            setEditingRoomType(null);
            fetchBranchData();
          }}
        />
      )}
    </div>
  );
}

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="font-medium text-gray-900">{title}</div>
      <div className="text-sm text-gray-600">{description}</div>
    </div>
  );
}
