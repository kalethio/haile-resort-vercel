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
  onDelete?: () => void;
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
  "High-speed Wi-Fi",
  "Air Conditioning / Central Cooling & Heating",
  "Flat-screen TV (42–43 inch)",
  "Private Bathroom with Shower",
  "Mini Bar / Mini Refrigerator",
  "Tea & Coffee Maker",
  "Hair Dryer",
  "Iron & Ironing Board",
  "Digital Safe Box",
  "Private Balcony",
  "Wake-up / Room Service",
  "Smoke Detector",
  "Wireless Charger",
  "Gym Access",
  "Outdoor Swimming Pool",
  "Car Parking",
  "24-hour Doctor on Call",
  "Round-trip Airport Transfer",
  "Buffet Breakfast",
  "Steam & Sauna Facilities",
  "Children Playground",
  "Football Field",
  "Running Track",
];

export default function EditRoomType({
  roomType,
  branchSlug,
  onClose,
  onSuccess,
  onDelete,
}: EditRoomTypeProps) {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<"price" | "details">("price");
  const [formData, setFormData] = useState<RoomTypeForEdit>(roomType);
  const [newAmenity, setNewAmenity] = useState("");
  const [showCommonAmenities, setShowCommonAmenities] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [existingImages, setExistingImages] = useState<string[]>(
    roomType.images
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newImageUrls, setNewImageUrls] = useState<string[]>([]);

  useEffect(() => {
    setFormData(roomType);
    setExistingImages(roomType.images);
  }, [roomType]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    const totalImages =
      existingImages.length + newImageUrls.length + files.length;

    if (totalImages > 10) {
      alert("Maximum 10 images allowed");
      return;
    }

    setUploading(true);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        continue;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("subfolder", "rooms");

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (result.success && result.url) {
          setNewImageUrls((prev) => [...prev, result.url]);
        } else {
          alert("Upload failed: " + (result.error || "Unknown error"));
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("Upload failed");
      }
    }

    setUploading(false);
    e.target.value = "";
  };

  const removeExistingImage = (imageUrl: string) => {
    setExistingImages((prev) => prev.filter((img) => img !== imageUrl));
    setImagesToDelete((prev) => [...prev, imageUrl]);
  };

  const removeNewImage = (index: number) => {
    setNewImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFullUpdate = async () => {
    setLoading(true);
    try {
      const allImages = [...existingImages, ...newImageUrls];

      const response = await fetch(
        `/api/admin/rooms-prices/room-types/${roomType.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            // Only send what the API expects
            name: formData.name,
            description: formData.description,
            adultCapacity: formData.adultCapacity,
            childCapacity: formData.childCapacity,
            basePrice: formData.basePrice,
            totalRooms: formData.totalRooms,
            amenities: formData.amenities,
            images: allImages,
            imagesToDelete: imagesToDelete,
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

  const handlePriceUpdate = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/admin/rooms-prices/room-types?branchSlug=${encodeURIComponent(branchSlug)}&roomTypeId=${roomType.id}`,
        {
          method: "PATCH",
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

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(
        `/api/admin/rooms-prices/room-types/${roomType.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        if (onDelete) {
          onDelete();
        } else {
          onSuccess();
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete room type");
      }
    } catch (error) {
      console.error("Error deleting room type:", error);
      alert(
        error instanceof Error ? error.message : "Failed to delete room type"
      );
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const addAmenity = (amenity: string) => {
    if (amenity.trim() && !formData.amenities.includes(amenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, amenity.trim()],
      }));
    }
    setNewAmenity("");
  };

  const removeAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== amenity),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    if (formData.amenities.includes(amenity)) {
      removeAmenity(amenity);
    } else {
      addAmenity(amenity);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Room Type: {roomType.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Update room type details and pricing
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                disabled={deleting}
                className="text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-300 hover:bg-red-50 text-sm font-medium disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
          </div>

          {/* Tabs */}
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
                    Description * ({formData.description.length}/500)
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

                {/* Image Upload Section - Like Accommodations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Photos ({existingImages.length + newImageUrls.length}
                    /10)
                  </label>

                  {/* Upload Button */}
                  <div className="mb-4">
                    <label className="bg-primary text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors cursor-pointer inline-block">
                      {uploading ? "Uploading..." : "+ Add Images"}
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      PNG, JPG, JPEG up to 5MB each (max 10 images)
                    </p>
                  </div>

                  {/* Images Grid */}
                  {(existingImages.length > 0 || newImageUrls.length > 0) && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Existing Images */}
                      {existingImages.map((imageUrl, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
                        >
                          <div className="relative w-full h-40 bg-gray-100">
                            <img
                              src={imageUrl}
                              alt={`Room ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <button
                              type="button"
                              onClick={() => removeExistingImage(imageUrl)}
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* New Images */}
                      {newImageUrls.map((imageUrl, index) => (
                        <div
                          key={`new-${index}`}
                          className="relative border-2 border-green-300 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
                        >
                          <div className="relative w-full h-40 bg-gray-100">
                            <img
                              src={imageUrl}
                              alt={`New ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="w-full px-3 py-2 border border-red-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty State */}
                  {existingImages.length === 0 && newImageUrls.length === 0 && (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <div className="text-3xl mb-3">🖼️</div>
                      <p className="font-medium">No images added yet</p>
                      <p className="text-sm mt-1">
                        Click "Add Images" to upload
                      </p>
                    </div>
                  )}
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
                          Common Amenities (click to select):
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {COMMON_AMENITIES.map((amenity) => (
                            <button
                              key={amenity}
                              type="button"
                              onClick={() => toggleAmenity(amenity)}
                              className={`px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                                formData.amenities.includes(amenity)
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>
                                  {formData.amenities.includes(amenity)
                                    ? "✓"
                                    : "□"}
                                </span>
                                <span>{amenity}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {formData.amenities.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Selected Amenities:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                            >
                              <span>✓ {amenity}</span>
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
                    disabled={loading || uploading}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Room Type
            </h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to delete "{roomType.name}"? This action
              cannot be undone and will also delete all associated rooms and
              bookings.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
