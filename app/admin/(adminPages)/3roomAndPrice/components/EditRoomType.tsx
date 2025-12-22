"use client";
import React, { useState, useEffect } from "react";

interface RoomTypeForEdit {
  id: number;
  name: string;
  description: string;
  adultCapacity: number;
  childCapacity: number;
  basePrice: number;
  totalRooms: number;
  amenities: string[];
  images: string[];
}

interface EditRoomTypeProps {
  roomType: RoomTypeForEdit;
  branchSlug: string;
  onClose: () => void;
  onSuccess: () => void;
}

const COMMON_AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Bathrobe",
  "Private bathroom & WC",
  "Mini Bar",
  "TV",
  "Laundry Service",
  "Telephone with External line",
  "Hair Dryer",
  "Coffee Maker",
];

export default function EditRoomType({
  roomType,
  branchSlug,
  onClose,
  onSuccess,
}: EditRoomTypeProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"price" | "details">("price");
  const [formData, setFormData] = useState<RoomTypeForEdit>(roomType);
  const [newAmenity, setNewAmenity] = useState("");
  const [showCommonAmenities, setShowCommonAmenities] = useState(false);

  useEffect(() => {
    setFormData(roomType);
  }, [roomType]);

  const handlePriceUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/rooms-prices/room-types?branchSlug=${encodeURIComponent(branchSlug)}&roomTypeId=${roomType.id}`,
        {
          method: "PATCH", // or "PUT"
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            basePrice: formData.basePrice,
          }),
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update price");
      }
    } catch (error) {
      console.error("Error updating price:", error);
      alert(error instanceof Error ? error.message : "Failed to update price");
    } finally {
      setLoading(false);
    }
  };

  const handleFullUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/rooms-prices/room-types/${roomType.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            branchSlug,
          }),
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update room type");
      }
    } catch (error) {
      console.error("Error updating room type:", error);
      alert(
        error instanceof Error ? error.message : "Failed to update room type"
      );
    } finally {
      setLoading(false);
    }
  };

  // Amenities functions
  const addAmenity = (amenity: string) => {
    if (amenity.trim() && !formData.amenities.includes(amenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity.trim()],
      }));
    }
    setNewAmenity("");
    setShowCommonAmenities(false);
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Room Type: {roomType.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Update room type details and pricing
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab("price")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "price"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Edit Price
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === "details"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Edit Other Details
            </button>
          </div>
        </div>

        <div className="p-6">
          {activeTab === "price" && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Base Price ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      basePrice: Number(e.target.value),
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePriceUpdate}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Price"}
                </button>
              </div>
            </div>
          )}

          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Room Type Name */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *{" "}
                  <span className="text-gray-500 font-normal">
                    (Include special features, views, room experience) -{" "}
                    {formData.description.length}/500
                  </span>
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                />
                {/* Description Templates */}
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quick Templates:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Spacious room with comfortable king-sized bed, modern amenities, and beautiful garden views",
                      "Luxury suite featuring stunning lake views, premium furnishings, and a private balcony",
                      "Family-friendly room with extra space, convenient amenities, and child-safe features",
                      "Executive room designed for business travelers with dedicated work desk and high-speed WiFi",
                      "Romantic getaway with special touches, beautiful mountain scenery, and premium bathroom amenities",
                    ].map((template, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            description: template,
                          }))
                        }
                        className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 border border-gray-300 text-left"
                      >
                        <div className="font-medium">Template {index + 1}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {template.substring(0, 40)}...
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Capacity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adults Capacity *
                  </label>
                  <select
                    value={formData.adultCapacity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        adultCapacity: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
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
                    Children Capacity
                  </label>
                  <select
                    value={formData.childCapacity}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        childCapacity: Number(e.target.value),
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "child" : "children"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Total Rooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                  />
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                  />
                </div>
              </div>

              {/* Amenities Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities
                </label>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Add amenity (e.g., WiFi, AC, TV, Mini Bar)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addAmenity(newAmenity))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => addAmenity(newAmenity)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setShowCommonAmenities(!showCommonAmenities)
                      }
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                    >
                      Common
                    </button>
                  </div>

                  {showCommonAmenities && (
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Common Amenities:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {COMMON_AMENITIES.map((amenity) => (
                          <button
                            key={amenity}
                            type="button"
                            onClick={() => addAmenity(amenity)}
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                          >
                            + {amenity}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.amenities.length > 0 && (
                    <div className="border border-gray-200 rounded-lg p-3">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Current Amenities:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.amenities.map((amenity, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                          >
                            <span>{amenity}</span>
                            <button
                              type="button"
                              onClick={() => removeAmenity(amenity)}
                              className="text-blue-800 hover:text-blue-600 font-bold"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFullUpdate}
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Room Type"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
