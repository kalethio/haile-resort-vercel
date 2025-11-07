// app/admin/inventory/page.tsx
"use client";
import React, { useState, useEffect } from "react";

interface Branch {
  id: number;
  slug: string;
  branchName: string;
}

interface RoomFeature {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  available: boolean;
  totalRooms: number;
  availableRooms: number;
  amenities: string[];
  branchId: number;
  roomFeatures: RoomFeature[];
}

export default function RoomManagement() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch branches on component mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch room types when branch changes
  useEffect(() => {
    if (selectedBranch) {
      fetchRoomTypes(selectedBranch);
    } else {
      setRoomTypes([]);
    }
  }, [selectedBranch]);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/branches");
      const data = await res.json();
      setBranches(data);
      if (data.length > 0) {
        setSelectedBranch(data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchRoomTypes = async (branchId: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/inventory/rooms?branchId=${branchId}`
      );
      const data = await res.json();
      setRoomTypes(data);
    } catch (error) {
      console.error("Failed to fetch room types:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedBranchData = branches.find((b) => b.id === selectedBranch);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Room & Price Management
          </h1>
          <p className="text-gray-600">
            Manage room types and pricing by branch
          </p>
        </div>

        {/* Branch Selector */}
        <div className="flex gap-4 items-center">
          <select
            value={selectedBranch || ""}
            onChange={(e) => setSelectedBranch(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="">Select Branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.branchName}
              </option>
            ))}
          </select>

          {selectedBranch && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
            >
              + Add Room Type
            </button>
          )}
        </div>
      </div>

      {/* Branch Info */}
      {selectedBranchData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900">
            Managing: {selectedBranchData.branchName}
          </h3>
          <p className="text-sm text-blue-700">
            {roomTypes.length} room types •{" "}
            {roomTypes.reduce((sum, room) => sum + room.totalRooms, 0)} total
            rooms
          </p>
        </div>
      )}

      {/* Add Room Form */}
      {showAddForm && selectedBranch && (
        <AddRoomForm
          branchId={selectedBranch}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            setShowAddForm(false);
            fetchRoomTypes(selectedBranch);
          }}
        />
      )}

      {/* Room Types List */}
      {selectedBranch ? (
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : roomTypes.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-4xl mb-4">🏨</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Room Types Yet
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first room type
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium"
              >
                Add First Room Type
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {roomTypes.map((roomType) => (
                <RoomTypeCard
                  key={roomType.id}
                  roomType={roomType}
                  onUpdate={() => fetchRoomTypes(selectedBranch)}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🏨</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Select a Branch
          </h3>
          <p className="text-gray-600">
            Choose a branch to manage its room types and pricing
          </p>
        </div>
      )}

      {/* Reports Section */}
      {selectedBranch && roomTypes.length > 0 && (
        <ReportsSection branchId={selectedBranch} roomTypes={roomTypes} />
      )}
    </div>
  );
}

// Room Type Card Component
function RoomTypeCard({
  roomType,
  onUpdate,
}: {
  roomType: RoomType;
  onUpdate: () => void;
}) {
  const totalPrice =
    roomType.basePrice +
    roomType.roomFeatures.reduce((sum, feature) => sum + feature.price, 0);

  return (
    <div className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">{roomType.name}</h4>
            <p className="text-sm text-gray-600">Sleeps {roomType.capacity}</p>
          </div>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              roomType.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {roomType.available ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Pricing */}
      <div className="p-4 border-b border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-medium">${roomType.basePrice}</span>
          </div>

          {/* Features with Prices */}
          {roomType.roomFeatures.map((feature) => (
            <div key={feature.id} className="flex justify-between text-sm">
              <span className="text-gray-600">+ {feature.name}:</span>
              <span className="text-green-600 font-medium">
                +${feature.price}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-semibold border-t border-gray-200 pt-2">
            <span>Total Price:</span>
            <span className="text-primary">${totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Inventory:</span>
          <span className="font-medium">
            {roomType.availableRooms}/{roomType.totalRooms} rooms
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className={`h-2 rounded-full ${
              roomType.availableRooms / roomType.totalRooms > 0.3
                ? "bg-green-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${(roomType.availableRooms / roomType.totalRooms) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex justify-between">
        <button className="text-primary hover:text-primary/80 font-medium text-sm">
          Edit
        </button>
        <div className="flex gap-3">
          <button className="text-gray-600 hover:text-gray-900 text-sm">
            View Bookings
          </button>
          <button className="text-red-600 hover:text-red-900 text-sm">
            {roomType.available ? "Disable" : "Enable"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Room Form Component
function AddRoomForm({
  branchId,
  onClose,
  onSuccess,
}: {
  branchId: number;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: 2,
    basePrice: 0,
    totalRooms: 1,
    selectedFeatures: [] as number[],
  });

  const [features, setFeatures] = useState<RoomFeature[]>([]);

  // Fetch available features for this branch
  useEffect(() => {
    fetchFeatures();
  }, [branchId]);

  const fetchFeatures = async () => {
    try {
      const res = await fetch(
        `/api/admin/inventory/features?branchId=${branchId}`
      );
      const data = await res.json();
      setFeatures(data);
    } catch (error) {
      console.error("Failed to fetch features:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/inventory/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          branchId,
          featureIds: formData.selectedFeatures,
        }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        throw new Error("Failed to create room type");
      }
    } catch (error) {
      console.error("Error creating room type:", error);
      alert("Failed to create room type");
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (featureId: number) => {
    setFormData((prev) => ({
      ...prev,
      selectedFeatures: prev.selectedFeatures.includes(featureId)
        ? prev.selectedFeatures.filter((id) => id !== featureId)
        : [...prev.selectedFeatures, featureId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Add New Room Type</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., King Bed Room, Lakeside Suite"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price ($) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity (Adults) *
              </label>
              <select
                value={formData.capacity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    capacity: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? "adult" : "adults"}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Rooms *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.totalRooms}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    totalRooms: Number(e.target.value),
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              placeholder="Describe the room type, amenities, and special features..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          {/* Features */}
          {features.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Features (Price Add-ons)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature) => (
                  <label
                    key={feature.id}
                    className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.selectedFeatures.includes(feature.id)}
                      onChange={() => toggleFeature(feature.id)}
                      className="mt-1 text-primary focus:ring-primary/20"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {feature.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {feature.description}
                      </div>
                      <div className="text-sm text-green-600 font-medium">
                        +${feature.price}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Room Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Reports Section Component
function ReportsSection({
  branchId,
  roomTypes,
}: {
  branchId: number;
  roomTypes: RoomType[];
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Branch Performance Report</h3>
      </div>

      <div className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Room Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Base Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Features
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Total Price
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Available
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Occupancy
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {roomTypes.map((roomType) => {
                const totalPrice =
                  roomType.basePrice +
                  roomType.roomFeatures.reduce((sum, f) => sum + f.price, 0);
                const occupancy =
                  ((roomType.totalRooms - roomType.availableRooms) /
                    roomType.totalRooms) *
                  100;

                return (
                  <tr key={roomType.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {roomType.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      ${roomType.basePrice}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {roomType.roomFeatures.map((f) => f.name).join(", ") ||
                        "None"}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      ${totalPrice}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {roomType.availableRooms}/{roomType.totalRooms}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-sm font-medium ${
                          occupancy > 80
                            ? "text-green-600"
                            : occupancy > 50
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {occupancy.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
