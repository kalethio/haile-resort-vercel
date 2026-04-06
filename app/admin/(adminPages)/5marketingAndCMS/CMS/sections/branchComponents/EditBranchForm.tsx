"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Home,
  Star,
  Image as ImageIcon,
  VideoIcon,
  TagIcon,
  Globe,
  Users,
  Award,
  Plus,
  Trash2,
  Search,
} from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";
import {
  EditBranchFormProps,
  TabType,
  BranchFormData,
  Attraction,
  Accommodation,
} from "@/types";
import AccommodationsEditor from "./AccommodationsEditor";

export default function EditBranchForm({
  branch,
  onCancel,
  onSuccess,
}: EditBranchFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<BranchFormData | null>(null);

  useEffect(() => {
    const fetchBranchContent = async () => {
      if (!branch) return;

      try {
        const attractionsRes = await fetch(
          `/api/admin/branches/${branch.slug}/attractions`
        );
        const contactRes = await fetch(
          `/api/admin/branches/${branch.slug}/contact`
        );
        const seoRes = await fetch(`/api/admin/branches/${branch.slug}/seo`);
        const accommodationsRes = await fetch(
          `/api/admin/branches/${branch.slug}/accommodations`
        );

        const attractions = attractionsRes.ok
          ? await attractionsRes.json()
          : [];
        const contact = contactRes.ok ? await contactRes.json() : {};
        const seo = seoRes.ok ? await seoRes.json() : {};
        const accommodations = accommodationsRes.ok
          ? await accommodationsRes.json()
          : [];

        setFormData({
          slug: branch.slug || "",
          branchName: branch.branchName || "",
          description: branch.description || "",
          heroVideoUrl: branch.heroVideoUrl || "",
          heroTagline: branch.heroTagline || "",
          starRating: branch.starRating || 4,
          published: branch.published || false,
          location: {
            city: branch.location?.city || "",
            region: branch.location?.region || "",
            country: branch.location?.country || "Ethiopia",
          },
          heroImage: branch.heroImage || "",
          directionsUrl: branch.directionsUrl || "",
          contact: {
            phone: contact.phone || branch.contact?.phone || "",
            email: contact.email || branch.contact?.email || "",
            address: contact.address || branch.contact?.address || "",
          },
          attractions: Array.isArray(attractions) ? attractions : [],
          accommodations: Array.isArray(accommodations) ? accommodations : [],
          seo: {
            title: seo.title || branch.seo?.title || "",
            description: seo.description || branch.seo?.description || "",
            keywords: seo.keywords || branch.seo?.keywords || [],
          },
        });
      } catch (error) {
        console.error("❌ FETCH ERROR:", error);
        setFormData({
          slug: branch.slug || "",
          branchName: branch.branchName || "",
          description: branch.description || "",
          heroVideoUrl: branch.heroVideoUrl || "",
          heroTagline: branch.heroTagline || "",
          starRating: branch.starRating || 4,
          published: branch.published || false,
          location: {
            city: branch.location?.city || "",
            region: branch.location?.region || "",
            country: branch.location?.country || "Ethiopia",
          },
          heroImage: branch.heroImage || "",
          directionsUrl: branch.directionsUrl || "",
          contact: {
            phone: branch.contact?.phone || "",
            email: branch.contact?.email || "",
            address: branch.contact?.address || "",
          },
          attractions: branch.attractions || [],
          accommodations: branch.accommodations || [],
          seo: {
            title: branch.seo?.title || "",
            description: branch.seo?.description || "",
            keywords: branch.seo?.keywords || [],
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBranchContent();
  }, [branch]);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => {
      if (!prev) return prev;

      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        if (parent === "location" || parent === "contact" || parent === "seo") {
          return {
            ...prev,
            [parent]: {
              ...prev[parent],
              [child]: value,
            },
          };
        }
      }

      return { ...prev, [field]: value };
    });
  };

  const handleArrayChange = (items: Attraction[]) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, attractions: items };
    });
  };

  const handleAccommodationsChange = (items: Accommodation[]) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, accommodations: items };
    });
  };

  const saveAllBranchData = async (formData: BranchFormData) => {
    try {
      const coreResponse = await fetch(`/api/admin/branches/${branch.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchName: formData.branchName,
          description: formData.description,
          heroImage: formData.heroImage,
          heroVideoUrl: formData.heroVideoUrl,
          heroTagline: formData.heroTagline,
          directionsUrl: formData.directionsUrl,
          starRating: formData.starRating,
          published: formData.published,
        }),
      });

      if (!coreResponse.ok) throw new Error("Failed to save core branch data");

      const contactResponse = await fetch(
        `/api/admin/branches/${branch.slug}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData.contact),
        }
      );
      if (!contactResponse.ok) throw new Error("Failed to save contact data");

      const attractionsResponse = await fetch(
        `/api/admin/branches/${branch.slug}/attractions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attractions: formData.attractions }),
        }
      );
      if (!attractionsResponse.ok)
        throw new Error("Failed to save attractions");

      const accommodationsResponse = await fetch(
        `/api/admin/branches/${branch.slug}/accommodations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accommodations: formData.accommodations }),
        }
      );
      if (!accommodationsResponse.ok)
        throw new Error("Failed to save accommodations");

      const seoResponse = await fetch(
        `/api/admin/branches/${branch.slug}/seo`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData.seo),
        }
      );
      if (!seoResponse.ok) throw new Error("Failed to save SEO data");

      return { success: true };
    } catch (error) {
      console.error("❌ SAVE ALL - Error:", error);
      return { success: false, error: "Failed to save all data" };
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    setSaving(true);
    setErrors({});

    try {
      const result = await saveAllBranchData(formData);
      if (result.success) {
        onSuccess();
      } else {
        setErrors({ submit: result.error || "Failed to save changes" });
      }
    } catch (error) {
      setErrors({ submit: "Network error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <div className="text-gray-600 font-medium">
            Loading branch data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden flex flex-col">
      <div className="flex border-b mb-6 bg-gray-50 rounded-t-lg">
        {(["basic", "contact", "content", "seo"] as TabType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-6 py-4 font-semibold text-sm border-b-2 transition-all ${
              activeTab === tab
                ? "border-primary text-primary bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "basic" && "Basic Info"}
            {tab === "contact" && "Contact & Media"}
            {tab === "content" && "Content"}
            {tab === "seo" && "SEO"}
          </button>
        ))}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-semibold">
          {errors.submit}
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-1">
        {activeTab === "basic" && (
          <BasicInfoTab formData={formData} onChange={handleChange} />
        )}
        {activeTab === "contact" && (
          <ContactTab formData={formData} onChange={handleChange} />
        )}
        {activeTab === "content" && (
          <ContentTab
            formData={formData}
            onAttractionsChange={handleArrayChange}
            onAccommodationsChange={handleAccommodationsChange}
          />
        )}
        {activeTab === "seo" && (
          <SEOTab formData={formData} onChange={handleChange} />
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:bg-primary/70 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </button>
      </div>
    </div>
  );
}

interface BasicInfoTabProps {
  formData: BranchFormData;
  onChange: (field: string, value: string | number | boolean) => void;
}

function BasicInfoTab({ formData, onChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Branch Name *
          </label>
          <input
            type="text"
            value={formData.branchName}
            onChange={(e) => onChange("branchName", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
            placeholder="Addis Ababa Resort"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            disabled
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl bg-gray-100 text-gray-600 font-medium"
          />
          <p className="text-xs text-gray-500 mt-1">Slug cannot be changed</p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium resize-none"
            placeholder="Describe your branch..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <TagIcon className="w-4 h-4 text-primary" />
            Hero Tagline
          </label>
          <input
            type="text"
            value={formData.heroTagline || ""}
            onChange={(e) => onChange("heroTagline", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
            placeholder="Turn Your Vacation Dream Into Reality"
          />
          <p className="text-xs text-gray-500 mt-2">
            Appears below the branch name in the hero section
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              City *
            </label>
            <input
              type="text"
              value={formData.location.city}
              onChange={(e) => onChange("location.city", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
              placeholder="Addis Ababa"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Region
            </label>
            <input
              type="text"
              value={formData.location.region}
              onChange={(e) => onChange("location.region", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
              placeholder="Addis Ababa"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Country
            </label>
            <input
              type="text"
              value={formData.location.country}
              onChange={(e) => onChange("location.country", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
              placeholder="Ethiopia"
            />
          </div>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Branch Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Star Rating
            </label>
            <select
              value={formData.starRating}
              onChange={(e) => onChange("starRating", parseInt(e.target.value))}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
            >
              {[3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-start md:justify-end">
            <div className="flex items-center h-14 bg-gray-50 rounded-xl px-4 border-2 border-gray-200">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => onChange("published", e.target.checked)}
                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="published"
                className="ml-3 text-sm font-semibold text-gray-800"
              >
                Publish Branch
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactTab({ formData, onChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            Phone Number
          </label>
          <input
            type="tel"
            value={formData.contact.phone}
            onChange={(e) => onChange("contact.phone", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
            placeholder="+251 911 000 111"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4 text-primary" />
            Email Address
          </label>
          <input
            type="email"
            value={formData.contact.email}
            onChange={(e) => onChange("contact.email", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
            placeholder="addis@example.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Home className="w-4 h-4 text-primary" />
            Full Address
          </label>
          <textarea
            value={formData.contact.address}
            onChange={(e) => onChange("contact.address", e.target.value)}
            rows={2}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium resize-none"
            placeholder="Complete physical address"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Media & Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Hero Image (Fallback)
            </label>
            <ImageUpload
              value={formData.heroImage}
              onChange={(url) => onChange("heroImage", url)}
              subfolder="branches"
            />
            <p className="text-xs text-gray-500 mt-2">
              Used as fallback if video is not available
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <VideoIcon className="w-4 h-4 text-primary" />
              Hero Video (YouTube ID)
            </label>
            <input
              type="text"
              value={formData.heroVideoUrl || ""}
              onChange={(e) => onChange("heroVideoUrl", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
              placeholder="iCS0YIJx3Ek"
            />
            <p className="text-xs text-gray-500 mt-2">
              YouTube Video ID (e.g., iCS0YIJx3Ek)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Directions URL
            </label>
            <input
              type="url"
              value={formData.directionsUrl}
              onChange={(e) => onChange("directionsUrl", e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
              placeholder="https://maps.app.goo.gl/..."
            />
            <p className="text-xs text-gray-500 mt-2">
              Google Maps navigation link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleArrayEditor({
  items,
  onChange,
}: {
  items: Attraction[];
  onChange: (items: Attraction[]) => void;
}) {
  const addItem = () => {
    onChange([...items, { label: "", order: 0 }]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(newItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Attractions</h3>
          <p className="text-gray-600 text-sm mt-1">
            Add attractions that will appear in the grid on your branch page
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Attraction</span>
        </button>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="border-2 border-gray-200 rounded-xl p-5 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Attraction Name *
              </label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(index, "label", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
                placeholder="Lagoon View"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Order
              </label>
              <input
                type="number"
                value={item.order || 0}
                onChange={(e) => updateItem(index, "order", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
                placeholder="0"
                min="0"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-600 text-sm font-semibold hover:text-red-800 transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-3xl mb-3">🏞️</div>
          <p className="font-medium">No attractions added yet</p>
          <p className="text-sm mt-1">Click "Add Attraction" to get started</p>
        </div>
      )}
    </div>
  );
}

interface ContentTabProps {
  formData: BranchFormData;
  onAttractionsChange: (items: Attraction[]) => void;
  onAccommodationsChange: (items: Accommodation[]) => void;
}

function ContentTab({
  formData,
  onAttractionsChange,
  onAccommodationsChange,
}: ContentTabProps) {
  return (
    <div className="space-y-10">
      {/* Attractions Section */}
      <div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Attractions Management
          </h3>
          <p className="text-gray-600 text-sm">
            Add and manage attractions that will appear in the attractions
            section of your branch page. These will be displayed in a clean grid
            layout.
          </p>
        </div>
        <SimpleArrayEditor
          items={formData.attractions}
          onChange={onAttractionsChange}
        />
      </div>

      {/* Accommodations Section */}
      <div className="border-t pt-6">
        <AccommodationsEditor
          items={formData.accommodations || []}
          onChange={onAccommodationsChange}
        />
      </div>
    </div>
  );
}

function SEOTab({ formData, onChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            SEO Title
          </label>
          <input
            type="text"
            value={formData.seo?.title || ""}
            onChange={(e) => onChange("seo.title", e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
            placeholder="Haile Resort Addis Ababa - Luxury Stay"
          />
          <p className="text-xs text-gray-500 mt-2">
            Title tag for search engines (50-60 characters recommended)
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Meta Description
          </label>
          <textarea
            value={formData.seo?.description || ""}
            onChange={(e) => onChange("seo.description", e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium resize-none"
            placeholder="Experience luxury at Haile Resort Addis Ababa..."
          />
          <p className="text-xs text-gray-500 mt-2">
            Description for search results (150-160 characters recommended)
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Search className="w-4 h-4 text-primary" />
            Keywords (comma separated)
          </label>
          <input
            type="text"
            value={
              Array.isArray(formData.seo?.keywords)
                ? formData.seo.keywords.join(", ")
                : ""
            }
            onChange={(e) =>
              onChange(
                "seo.keywords",
                e.target.value.split(",").map((k) => k.trim())
              )
            }
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
            placeholder="luxury hotel, addis ababa, ethiopia, resort, vacation"
          />
          <p className="text-xs text-gray-500 mt-2">
            Separate keywords with commas
          </p>
        </div>
      </div>
    </div>
  );
}
