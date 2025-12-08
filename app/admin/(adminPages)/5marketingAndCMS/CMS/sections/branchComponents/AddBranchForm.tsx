"use client";
import { useState } from "react";
import ImageUpload from "@/app/components/ImageUpload";
import { ImageIcon, VideoIcon, TagIcon } from "lucide-react";

interface AddBranchFormProps {
  onCancel: () => void;
  onSuccess: () => void;
}

interface FormData {
  slug: string;
  branchName: string;
  description: string;
  heroImage: string;
  heroVideoUrl: string;
  heroTagline: string;
  directionsUrl: string;
  starRating: number;
  published: boolean;
  location: {
    city: string;
    region: string;
    country: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export default function AddBranchForm({
  onCancel,
  onSuccess,
}: AddBranchFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    slug: "",
    branchName: "",
    description: "",
    heroImage: "",
    heroVideoUrl: "",
    heroTagline: "",
    directionsUrl: "",
    starRating: 4,
    published: false,
    location: {
      city: "",
      region: "",
      country: "Ethiopia",
    },
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        if (parent === "location") {
          return {
            ...prev,
            location: {
              ...prev.location,
              [child]: value,
            },
          };
        } else if (parent === "seo") {
          return {
            ...prev,
            seo: {
              ...prev.seo,
              [child]: value,
            },
          };
        }
      }
      return { ...prev, [field]: value };
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (!formData.branchName.trim()) {
      newErrors.branchName = "Branch name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.location.city.trim()) {
      newErrors["location.city"] = "City is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/branches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setErrors({ submit: data.error || "Failed to create branch" });
      }
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-1">
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-medium">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange("slug", e.target.value)}
                className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary/50 bg-white text-gray-900 placeholder-gray-500 ${
                  errors.slug
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="addis-ababa"
              />
              {errors.slug && (
                <p className="text-red-600 text-sm font-medium mt-2">
                  {errors.slug}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                value={formData.branchName}
                onChange={(e) => handleChange("branchName", e.target.value)}
                className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary/50 bg-white text-gray-900 placeholder-gray-500 ${
                  errors.branchName
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Addis Ababa"
              />
              {errors.branchName && (
                <p className="text-red-600 text-sm font-medium mt-2">
                  {errors.branchName}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary/50 bg-white text-gray-900 placeholder-gray-500 resize-none ${
                  errors.description
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Luxury stay in the heart of Ethiopia's capital..."
              />
              {errors.description && (
                <p className="text-red-600 text-sm font-medium mt-2">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-primary" />
                Hero Tagline
              </label>
              <input
                type="text"
                value={formData.heroTagline}
                onChange={(e) => handleChange("heroTagline", e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500"
                placeholder="Turn Your Vacation Dream Into Reality"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Hero Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-primary" />
                Hero Image (Fallback)
              </label>
              <ImageUpload
                value={formData.heroImage}
                onChange={(url) => handleChange("heroImage", url)}
                subfolder="branches"
              />
              {formData.heroImage && (
                <p className="text-xs text-gray-500 mt-2">
                  Current image: {formData.heroImage}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-primary" />
                Hero Video URL (YouTube ID)
              </label>
              <input
                type="text"
                value={formData.heroVideoUrl}
                onChange={(e) => handleChange("heroVideoUrl", e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500"
                placeholder="iCS0YIJx3Ek"
              />
              <p className="text-xs text-gray-500 mt-2">
                YouTube Video ID (e.g., iCS0YIJx3Ek from
                youtube.com/watch?v=iCS0YIJx3Ek)
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Location Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                City *
              </label>
              <input
                type="text"
                value={formData.location.city}
                onChange={(e) => handleChange("location.city", e.target.value)}
                className={`w-full px-3 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary/50 bg-white text-gray-900 placeholder-gray-500 ${
                  errors["location.city"]
                    ? "border-red-500"
                    : "border-gray-300 focus:border-primary"
                }`}
                placeholder="Addis Ababa"
              />
              {errors["location.city"] && (
                <p className="text-red-600 text-sm font-medium mt-2">
                  {errors["location.city"]}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Region
              </label>
              <input
                type="text"
                value={formData.location.region}
                onChange={(e) =>
                  handleChange("location.region", e.target.value)
                }
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500"
                placeholder="Addis Ababa"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.location.country}
                onChange={(e) =>
                  handleChange("location.country", e.target.value)
                }
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500"
                placeholder="Ethiopia"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            SEO Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={formData.seo.title}
                onChange={(e) => handleChange("seo.title", e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500"
                placeholder="Haile Resort Addis Ababa - Luxury Stay"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                SEO Description
              </label>
              <textarea
                value={formData.seo.description}
                onChange={(e) =>
                  handleChange("seo.description", e.target.value)
                }
                rows={2}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500 resize-none"
                placeholder="Experience luxury at Haile Resort Addis Ababa..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                SEO Keywords (comma separated)
              </label>
              <input
                type="text"
                value={formData.seo.keywords.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "seo.keywords",
                    e.target.value.split(",").map((k) => k.trim())
                  )
                }
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500"
                placeholder="luxury hotel, addis ababa, ethiopia, resort"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            Additional Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Directions URL
              </label>
              <input
                type="url"
                value={formData.directionsUrl}
                onChange={(e) => handleChange("directionsUrl", e.target.value)}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 placeholder-gray-500"
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Star Rating
              </label>
              <select
                value={formData.starRating}
                onChange={(e) =>
                  handleChange("starRating", parseInt(e.target.value))
                }
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900"
              >
                {[3, 4, 5].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center justify-start md:justify-end">
              <div className="flex items-center h-14 bg-gray-50 rounded-lg px-4 border-2 border-gray-200">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleChange("published", e.target.checked)}
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="published"
                  className="ml-3 text-sm font-semibold text-gray-800"
                >
                  Publish immediately
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            {loading ? "Creating Branch..." : "Create Branch"}
          </button>
        </div>
      </form>
    </div>
  );
}
