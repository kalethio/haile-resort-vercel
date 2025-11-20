"use client";
import React, { useState, useEffect, useCallback } from "react";

interface AddRoomTypeProps {
  branchSlug: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  description: string;
  adultCapacity: number;
  childCapacity: number;
  basePrice: number;
  totalRooms: number;
  amenities: string[];
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
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

export default function AddRoomType({
  branchSlug,
  onClose,
  onSuccess,
}: AddRoomTypeProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    adultCapacity: 2,
    childCapacity: 0,
    basePrice: 0,
    totalRooms: 1,
    amenities: [],
  });

  const [formErrors, setFormErrors] = useState<Partial<FormData>>({});
  const [newAmenity, setNewAmenity] = useState("");
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [showCommonAmenities, setShowCommonAmenities] = useState(false);

  // Load draft from localStorage
  useEffect(() => {
    const draft = localStorage.getItem(`roomTypeDraft_${branchSlug}`);
    if (draft) {
      setFormData(JSON.parse(draft));
    }
  }, [branchSlug]);

  // Save draft to localStorage
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem(
        `roomTypeDraft_${branchSlug}`,
        JSON.stringify(formData)
      );
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData, branchSlug]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      uploadProgress.forEach((item) => {
        if (item.file) {
          URL.revokeObjectURL(URL.createObjectURL(item.file));
        }
      });
    };
  }, [uploadProgress]);

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {};

    if (!formData.name.trim()) errors.name = "Room type name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (formData.basePrice <= 0)
      errors.basePrice = "Base price must be greater than 0";
    if (formData.totalRooms < 1)
      errors.totalRooms = "Total rooms must be at least 1";
    if (formData.description.length > 500)
      errors.description = "Description must be less than 500 characters";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    // Initialize progress tracking
    const progressItems: UploadProgress[] = files.map((file) => ({
      file,
      progress: 0,
      status: "uploading",
    }));
    setUploadProgress(progressItems);

    // Upload files in parallel with progress tracking
    const uploadPromises = files.map(async (file, index) => {
      // Validate file
      if (!file.type.startsWith("image/")) {
        setUploadProgress((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, status: "error", error: "Invalid file type" }
              : item
          )
        );
        return null;
      }

      if (file.size > 5 * 1024 * 1024) {
        setUploadProgress((prev) =>
          prev.map((item, i) =>
            i === index
              ? { ...item, status: "error", error: "File too large (max 5MB)" }
              : item
          )
        );
        return null;
      }

      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("subfolder", "rooms");

      try {
        const xhr = new XMLHttpRequest();

        const promise = new Promise<string>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (e) => {
            if (e.lengthComputable) {
              const progress = (e.loaded / e.total) * 100;
              setUploadProgress((prev) =>
                prev.map((item, i) =>
                  i === index ? { ...item, progress } : item
                )
              );
            }
          });

          xhr.addEventListener("load", () => {
            console.log(`Upload response for file ${index}:`, {
              status: xhr.status,
              statusText: xhr.statusText,
              response: xhr.responseText,
            });

            if (xhr.status === 200) {
              try {
                const data = JSON.parse(xhr.responseText);
                console.log("Parsed upload response:", data);

                setUploadProgress((prev) =>
                  prev.map((item, i) =>
                    i === index
                      ? { ...item, status: "completed", progress: 100 }
                      : item
                  )
                );

                // Handle different response formats
                if (data.url) {
                  resolve(data.url);
                } else if (data.success && data.url) {
                  resolve(data.url);
                } else if (data.data && data.data.url) {
                  resolve(data.data.url);
                } else {
                  console.error("No URL in upload response:", data);
                  reject(new Error("Upload failed - no URL returned"));
                }
              } catch (parseError) {
                console.error("Failed to parse upload response:", parseError);
                reject(new Error("Upload failed - invalid response"));
              }
            } else {
              reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
          });

          xhr.addEventListener("error", () => {
            console.error(`Upload error for file ${index}`);
            reject(new Error("Upload failed - network error"));
          });

          xhr.addEventListener("abort", () => {
            console.log(`Upload aborted for file ${index}`);
            reject(new Error("Upload aborted"));
          });
        });

        xhr.open("POST", "/api/upload");
        xhr.send(uploadFormData);

        const url = await promise;
        console.log(`Successfully uploaded file ${index}:`, url);
        return url;
      } catch (error) {
        console.error(`Upload failed for file ${index}:`, error);
        setUploadProgress((prev) =>
          prev.map((item, i) =>
            i === index
              ? {
                  ...item,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : item
          )
        );
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(
      (url): url is string => url !== null
    );

    console.log(
      `Upload completed: ${successfulUploads.length}/${files.length} successful`
    );
    return successfulUploads;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const files = uploadProgress.map((item) => item.file);
      const uploadedImageUrls = await uploadImages(files);

      const response = await fetch(
        `/api/admin/rooms-prices/room-types?branchSlug=${encodeURIComponent(branchSlug)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            images: uploadedImageUrls,
          }),
        }
      );

      if (response.ok) {
        localStorage.removeItem(`roomTypeDraft_${branchSlug}`);
        onSuccess();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create room type");
      }
    } catch (error) {
      console.error("Error creating room type:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create room type"
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);

      // Validate total files
      if (uploadProgress.length + newImages.length > 10) {
        alert("Maximum 10 images allowed");
        return;
      }

      // Validate total size
      const totalSize = [...uploadProgress, ...newImages].reduce(
        (acc, file) => acc + (file instanceof File ? file.size : 0),
        0
      );
      if (totalSize > 50 * 1024 * 1024) {
        alert("Total file size exceeds 50MB limit");
        return;
      }

      setUploadProgress((prev) => [
        ...prev,
        ...newImages.map((file) => ({
          file,
          progress: 0,
          status: "uploading" as const,
        })),
      ]);
    }
  };

  const removeImage = (index: number) => {
    setUploadProgress((prev) => {
      const newProgress = prev.filter((_, i) => i !== index);
      return newProgress;
    });
  };

  const retryUpload = async (index: number) => {
    const file = uploadProgress[index].file;
    setUploadProgress((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, status: "uploading", progress: 0, error: undefined }
          : item
      )
    );

    const urls = await uploadImages([file]);
    if (urls.length > 0) {
      // Success - URL will be used in final submission
    }
  };

  const clearDraft = () => {
    localStorage.removeItem(`roomTypeDraft_${branchSlug}`);
    setFormData({
      name: "",
      description: "",
      adultCapacity: 2,
      childCapacity: 0,
      basePrice: 0,
      totalRooms: 1,
      amenities: [],
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header with Close Button */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Add New Room Type
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Create a new room type for your property
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={clearDraft}
              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-300"
            >
              Clear Draft
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Room Type Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Type Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData((prev) => ({ ...prev, name: e.target.value }));
                if (formErrors.name)
                  setFormErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder="e.g., King Size, Queen Suite, Family Room"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 ${
                formErrors.name ? "border-red-300" : "border-gray-300"
              }`}
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
            )}
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
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }));
                if (formErrors.description)
                  setFormErrors((prev) => ({
                    ...prev,
                    description: undefined,
                  }));
              }}
              rows={3}
              placeholder="Describe the room type, bed configuration, views, special features, and overall experience..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 ${
                formErrors.description ? "border-red-300" : "border-gray-300"
              }`}
            />
            {/* Description Templates */}
            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Templates:
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  "Classic room with a Queen sized bed, free transfer & free WIFI 29.5 sqm",
                  "Classic Room with Twin Beds, Free Transfer, Free Parking 30.2 sqm",
                  "Premium Room with King Sized Bed, Free Transfer, Free WIFI 39.5 sqm",
                  "Premium Suite with King Sized Bed, Free Transfer, Free WIFI 58.9 sqm",
                  "Premium Suite with King Sized Beds, Free Transfer, Free WIFI 95.9 sqm",
                  "Family Suite with King Sized Beds, Free Transfer, Free WIFI 89 sqm",
                  "Presidential Suite with a King sized bed, free transfer 149 sqm",
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
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600">
                {formErrors.description}
              </p>
            )}
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
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    basePrice: Number(e.target.value),
                  }));
                  if (formErrors.basePrice)
                    setFormErrors((prev) => ({
                      ...prev,
                      basePrice: undefined,
                    }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 ${
                  formErrors.basePrice ? "border-red-300" : "border-gray-300"
                }`}
              />
              {formErrors.basePrice && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.basePrice}
                </p>
              )}
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
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    totalRooms: Number(e.target.value),
                  }));
                  if (formErrors.totalRooms)
                    setFormErrors((prev) => ({
                      ...prev,
                      totalRooms: undefined,
                    }));
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 ${
                  formErrors.totalRooms ? "border-red-300" : "border-gray-300"
                }`}
              />
              {formErrors.totalRooms && (
                <p className="mt-1 text-sm text-red-600">
                  {formErrors.totalRooms}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload Component */}
          <ImageUploadSection
            uploadProgress={uploadProgress}
            onImageUpload={handleImageUpload}
            onRemoveImage={removeImage}
            onRetryUpload={retryUpload}
          />

          {/* Amenities Section */}
          <AmenitiesManager
            amenities={formData.amenities}
            newAmenity={newAmenity}
            onNewAmenityChange={setNewAmenity}
            onAddAmenity={addAmenity}
            onRemoveAmenity={removeAmenity}
            showCommonAmenities={showCommonAmenities}
            onToggleCommonAmenities={() =>
              setShowCommonAmenities(!showCommonAmenities)
            }
            commonAmenities={COMMON_AMENITIES}
          />

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
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Room Type"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Extracted Image Upload Component
function ImageUploadSection({
  uploadProgress,
  onImageUpload,
  onRemoveImage,
  onRetryUpload,
}: {
  uploadProgress: UploadProgress[];
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRetryUpload: (index: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Room Photos{" "}
        <span className="text-gray-500 font-normal">
          ({uploadProgress.length}/5)
        </span>
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={onImageUpload}
          className="hidden"
          id="room-images"
        />
        <label
          htmlFor="room-images"
          className="cursor-pointer block text-center"
        >
          <div className="text-4xl mb-2">📷</div>
          <div className="text-gray-600">Click to upload room photos</div>
          <div className="text-sm text-gray-500">
            PNG, JPG, JPEG up to 5MB each (max 5 images, 50MB total)
          </div>
        </label>

        {/* Upload Progress and Previews */}
        {uploadProgress.length > 0 && (
          <div className="mt-4 space-y-3">
            <div className="text-sm font-medium text-gray-700">
              Uploaded Photos (
              {
                uploadProgress.filter((item) => item.status === "completed")
                  .length
              }
              /{uploadProgress.length})
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {uploadProgress.map((item, index) => (
                <div key={index} className="relative border rounded-lg p-2">
                  <img
                    src={URL.createObjectURL(item.file)}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-20 object-cover rounded"
                  />
                  <div className="mt-2">
                    {item.status === "uploading" && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${item.progress}%` }}
                        ></div>
                      </div>
                    )}
                    {item.status === "error" && (
                      <div className="text-xs text-red-600">
                        {item.error}
                        <button
                          type="button"
                          onClick={() => onRetryUpload(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                    {item.status === "completed" && (
                      <div className="text-xs text-green-600">✓ Uploaded</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
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
  );
}

// Extracted Amenities Manager Component
function AmenitiesManager({
  amenities,
  newAmenity,
  onNewAmenityChange,
  onAddAmenity,
  onRemoveAmenity,
  showCommonAmenities,
  onToggleCommonAmenities,
  commonAmenities,
}: {
  amenities: string[];
  newAmenity: string;
  onNewAmenityChange: (value: string) => void;
  onAddAmenity: (amenity: string) => void;
  onRemoveAmenity: (amenity: string) => void;
  showCommonAmenities: boolean;
  onToggleCommonAmenities: () => void;
  commonAmenities: string[];
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-3">
        Amenities
      </label>
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={newAmenity}
            onChange={(e) => onNewAmenityChange(e.target.value)}
            placeholder="Add amenity (e.g., WiFi, AC, TV, Mini Bar)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900"
            onKeyPress={(e) =>
              e.key === "Enter" &&
              (e.preventDefault(), onAddAmenity(newAmenity))
            }
          />
          <button
            type="button"
            onClick={() => onAddAmenity(newAmenity)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            +
          </button>
          <button
            type="button"
            onClick={onToggleCommonAmenities}
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
              {commonAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => onAddAmenity(amenity)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                >
                  + {amenity}
                </button>
              ))}
            </div>
          </div>
        )}

        {amenities.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-3">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Added Amenities:
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  <span>{amenity}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveAmenity(amenity)}
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
  );
}
