"use client";
import { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Home,
  Star,
  Image as ImageIcon,
  Globe,
  Users,
  Award,
  Plus,
  Trash2,
} from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";
import {
  EditBranchFormProps,
  TabType,
  BranchFormData,
  Attraction,
  Accommodation,
  Experience,
  ExperiencePackage,
} from "@/types";

// ===== MAIN COMPONENT =====
export default function EditBranchForm({
  branch,
  onCancel,
  onSuccess,
}: EditBranchFormProps) {
  console.log("🔍 BRANCH PROP - Full object:", JSON.stringify(branch, null, 2));
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<BranchFormData | null>(null);

  // Initialize form data from branch prop
  useEffect(() => {
    if (branch) {
      console.log("🔍 USEEFFECT - Raw branch data:", {
        attractions: branch.attractions,
        accommodations: branch.accommodations,
        experiences: branch.experiences,
      });

      setFormData({
        // Basic Info
        slug: branch.slug || "",
        branchName: branch.branchName || "",
        description: branch.description || "",
        starRating: branch.starRating || 4,
        published: branch.published || false,

        // Location
        location: {
          city: branch.location?.city || "",
          region: branch.location?.region || "",
          country: branch.location?.country || "Ethiopia",
        },

        // Media
        heroImage: branch.heroImage || "",
        directionsUrl: branch.directionsUrl || "",

        // Contact
        contact: {
          phone: branch.contact?.phone || "",
          email: branch.contact?.email || "",
          address: branch.contact?.address || "",
        },

        // ✅ FIX: Use raw arrays directly
        attractions: branch.attractions || [],
        accommodations: branch.accommodations || [],
        experiences: branch.experiences || [],
      });
      setLoading(false);
    }
  }, [branch]);

  // Handle form field changes
  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => {
      if (!prev) return prev;

      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        if (parent === "location" || parent === "contact") {
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

  // Handle array data changes
  const handleArrayChange = (
    type: "attractions" | "accommodations" | "experiences",
    items: Attraction[] | Accommodation[] | Experience[]
  ) => {
    console.log(`🔄 ARRAY CHANGE - ${type}:`, items);

    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [type]: items,
      };
    });
  };

  // Save all branch data to respective APIs
  const saveAllBranchData = async (formData: BranchFormData) => {
    try {
      console.log("🔄 SAVE ALL - Starting to save branch data...");

      // Save core branch data
      console.log("🔄 SAVE ALL - Saving core branch data...");
      const coreResponse = await fetch(`/api/admin/branches/${branch.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchName: formData.branchName,
          description: formData.description,
          heroImage: formData.heroImage,
          directionsUrl: formData.directionsUrl,
          starRating: formData.starRating,
          published: formData.published,
        }),
      });

      if (!coreResponse.ok) {
        throw new Error("Failed to save core branch data");
      }
      console.log("✅ SAVE ALL - Core data saved");

      // Save contact data
      console.log("🔄 SAVE ALL - Saving contact data...");
      const contactResponse = await fetch(
        `/api/admin/branches/${branch.slug}/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData.contact),
        }
      );

      if (!contactResponse.ok) {
        throw new Error("Failed to save contact data");
      }
      console.log("✅ SAVE ALL - Contact data saved");

      // Save attractions
      console.log("🔄 SAVE ALL - Saving attractions...", formData.attractions);
      const attractionsResponse = await fetch(
        `/api/admin/branches/${branch.slug}/attractions`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ attractions: formData.attractions }),
        }
      );

      if (!attractionsResponse.ok) {
        throw new Error("Failed to save attractions");
      }
      console.log("✅ SAVE ALL - Attractions saved");

      // Save accommodations
      console.log(
        "🔄 SAVE ALL - Saving accommodations...",
        formData.accommodations
      );
      const accommodationsResponse = await fetch(
        `/api/admin/branches/${branch.slug}/accommodations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accommodations: formData.accommodations }),
        }
      );

      if (!accommodationsResponse.ok) {
        throw new Error("Failed to save accommodations");
      }
      console.log("✅ SAVE ALL - Accommodations saved");

      // Save experiences
      console.log("🔄 SAVE ALL - Saving experiences...", formData.experiences);
      const experiencesResponse = await fetch(
        `/api/admin/branches/${branch.slug}/experiences`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ experiences: formData.experiences }),
        }
      );

      if (!experiencesResponse.ok) {
        throw new Error("Failed to save experiences");
      }
      console.log("✅ SAVE ALL - Experiences saved");

      console.log("🎉 SAVE ALL - All data saved successfully!");
      return { success: true };
    } catch (error) {
      console.error("❌ SAVE ALL - Error:", error);
      return { success: false, error: "Failed to save all data" };
    }
  };

  // Save form data to API
  const handleSave = async () => {
    console.log("🔄 HANDLE SAVE - Button clicked, formData:", formData);

    if (!formData) {
      console.log("❌ HANDLE SAVE - No formData");
      return;
    }

    setSaving(true);
    setErrors({});

    try {
      console.log("🔄 HANDLE SAVE - Calling saveAllBranchData...");
      const result = await saveAllBranchData(formData);

      console.log("🔄 HANDLE SAVE - saveAllBranchData result:", result);

      if (result.success) {
        console.log("✅ HANDLE SAVE - Success, calling onSuccess");
        onSuccess();
      } else {
        console.log("❌ HANDLE SAVE - Failed:", result.error);
        setErrors({
          submit: result.error || "Failed to save changes. Please try again.",
        });
      }
    } catch (error) {
      console.log("❌ HANDLE SAVE - Exception:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      console.log("🔄 HANDLE SAVE - Setting saving to false");
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
    <div className="max-h-[70vh] overflow-hidden flex flex-col">
      {/* Navigation Tabs */}
      <div className="flex border-b mb-6 bg-gray-50 rounded-t-lg">
        {(["basic", "contact", "content"] as TabType[]).map((tab) => (
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
            {tab === "contact" && "Contact Details"}
            {tab === "content" && "Branch Content"}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm font-semibold">
          {errors.submit}
        </div>
      )}

      {/* Tab Content Area */}
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
            onAttractionsChange={(items: Attraction[]) =>
              handleArrayChange("attractions", items)
            }
            onAccommodationsChange={(items: Accommodation[]) =>
              handleArrayChange("accommodations", items)
            }
            onExperiencesChange={(items: Experience[]) =>
              handleArrayChange("experiences", items)
            }
          />
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-6 border-t mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={() => {
            console.log("🔄 SAVE BUTTON - Clicked!");
            console.log("📝 Current formData:", formData);
            handleSave();
          }}
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

// ===== BASIC INFO TAB COMPONENT =====
interface BasicInfoTabProps {
  formData: BranchFormData;
  onChange: (field: string, value: string | number | boolean) => void;
}

function BasicInfoTab({ formData, onChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information Section */}
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
            placeholder="Describe your branch location, amenities, and unique features..."
          />
        </div>
      </div>

      {/* Location Details Section */}
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

      {/* Branch Settings Section */}
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

// ===== CONTACT TAB COMPONENT =====
function ContactTab({ formData, onChange }: BasicInfoTabProps) {
  return (
    <div className="space-y-6">
      {/* Contact Information Section */}
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
            placeholder="Complete physical address for this branch location"
          />
        </div>
      </div>

      {/* Media & Links Section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Media & Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary" />
              Hero Image
            </label>
            <ImageUpload
              value={formData.heroImage}
              onChange={(url) => onChange("heroImage", url)}
              subfolder="branches"
            />
            <p className="text-xs text-gray-500 mt-2">
              Upload the main image for your branch (recommended: 1920x1080px)
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
              Google Maps or other navigation service link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CONTENT TAB COMPONENT =====
interface ContentTabProps {
  formData: BranchFormData;
  onAttractionsChange: (items: Attraction[]) => void;
  onAccommodationsChange: (items: Accommodation[]) => void;
  onExperiencesChange: (items: Experience[]) => void;
}

interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

interface SimpleArrayEditorProps {
  title: string;
  items: Attraction[] | Accommodation[];
  onChange: (items: Attraction[] | Accommodation[]) => void;
  fields: FieldConfig[];
}

// Reusable component for editing arrays of data (attractions, accommodations)
function SimpleArrayEditor({
  title,
  items,
  onChange,
  fields,
}: SimpleArrayEditorProps) {
  const addItem = () => {
    const newItem = fields.reduce(
      (acc: Record<string, string>, field: FieldConfig) => {
        acc[field.name] = "";
        return acc;
      },
      {}
    );
    onChange([...items, newItem as Attraction | Accommodation]);
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
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <button
          type="button"
          onClick={addItem}
          className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* List of existing items */}
      {items.map((item, index) => (
        <div
          key={index}
          className="border-2 border-gray-200 rounded-xl p-5 bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {fields.map((field: FieldConfig) => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={
                      item[
                        field.name as keyof (Attraction | Accommodation)
                      ] as string
                    }
                    onChange={(e) =>
                      updateItem(index, field.name, e.target.value)
                    }
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium resize-none"
                    placeholder={field.placeholder}
                  />
                ) : field.name === "image" ? (
                  <ImageUpload
                    value={
                      item[
                        field.name as keyof (Attraction | Accommodation)
                      ] as string
                    }
                    onChange={(url) => updateItem(index, field.name, url)}
                    subfolder={title.toLowerCase()}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={
                      item[
                        field.name as keyof (Attraction | Accommodation)
                      ] as string
                    }
                    onChange={(e) =>
                      updateItem(index, field.name, e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
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

      {/* Empty state */}
      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No {title.toLowerCase()} added yet</p>
          <p className="text-sm mt-1">Click Add to create your first one</p>
        </div>
      )}
    </div>
  );
}

// ===== EXPERIENCES EDITOR COMPONENT =====
interface ExperiencesEditorProps {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
}

function ExperiencesEditor({ experiences, onChange }: ExperiencesEditorProps) {
  const addExperience = () => {
    const newExperience: Experience = {
      title: "",
      description: "",
      highlightImage: "",
      packages: [],
    };
    onChange([...experiences, newExperience]);
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperiences = experiences.map((exp, i) =>
      i === index ? { ...exp, [field]: value } : exp
    );
    onChange(newExperiences);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const addPackage = (expIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].packages.push({
      title: "",
      subtitle: "",
      description: "",
      price: 0,
      duration: "",
      inclusions: undefined,
      category: "CULTURAL",
      available: true,
      ctaLabel: "",
    });
    onChange(newExperiences);
  };

  const updatePackage = (
    expIndex: number,
    pkgIndex: number,
    field: string,
    value: string | number | boolean
  ) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].packages[pkgIndex] = {
      ...newExperiences[expIndex].packages[pkgIndex],
      [field]: value,
    };
    onChange(newExperiences);
  };

  const removePackage = (expIndex: number, pkgIndex: number) => {
    const newExperiences = [...experiences];
    newExperiences[expIndex].packages = newExperiences[
      expIndex
    ].packages.filter((_, i) => i !== pkgIndex);
    onChange(newExperiences);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Experiences</h3>
        <button
          type="button"
          onClick={addExperience}
          className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experience</span>
        </button>
      </div>

      {experiences.map((experience, expIndex) => (
        <div
          key={expIndex}
          className="border-2 border-gray-200 rounded-xl p-6 bg-white space-y-6"
        >
          {/* Experience Header */}
          <div className="flex justify-between items-start">
            <h4 className="text-md font-semibold text-gray-800">
              Experience #{expIndex + 1}
            </h4>
            <button
              type="button"
              onClick={() => removeExperience(expIndex)}
              className="text-red-600 text-sm font-semibold hover:text-red-800 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Remove Experience
            </button>
          </div>

          {/* Experience Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Experience Title *
              </label>
              <input
                type="text"
                value={experience.title}
                onChange={(e) =>
                  updateExperience(expIndex, "title", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium"
                placeholder="Sunset Safari Adventure"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Description *
              </label>
              <textarea
                value={experience.description}
                onChange={(e) =>
                  updateExperience(expIndex, "description", e.target.value)
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 font-medium resize-none"
                placeholder="Describe this amazing experience..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Highlight Image
              </label>
              <ImageUpload
                value={experience.highlightImage}
                onChange={(url) =>
                  updateExperience(expIndex, "highlightImage", url)
                }
                subfolder="experiences"
              />
            </div>
          </div>

          {/* Packages Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h5 className="text-md font-semibold text-gray-800">Packages</h5>
              <button
                type="button"
                onClick={() => addPackage(expIndex)}
                className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Add Package
              </button>
            </div>

            {experience.packages.map((pkg, pkgIndex) => (
              <div
                key={pkgIndex}
                className="border border-gray-200 rounded-lg p-4 mb-4 bg-gray-50"
              >
                <div className="flex justify-between items-start mb-3">
                  <h6 className="text-sm font-semibold text-gray-700">
                    Package #{pkgIndex + 1}
                  </h6>
                  <button
                    type="button"
                    onClick={() => removePackage(expIndex, pkgIndex)}
                    className="text-red-600 text-xs font-semibold hover:text-red-800 transition-colors flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Package Title *
                    </label>
                    <input
                      type="text"
                      value={pkg.title}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 text-sm"
                      placeholder="Basic Package"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Subtitle
                    </label>
                    <input
                      type="text"
                      value={pkg.subtitle || ""}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "subtitle",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 text-sm"
                      placeholder="All-inclusive experience"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      value={pkg.price || 0}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "price",
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 text-sm"
                      placeholder="99.99"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={pkg.duration || ""}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "duration",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 text-sm"
                      placeholder="2 hours"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Category
                    </label>
                    <select
                      value={pkg.category}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "category",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 text-sm"
                    >
                      <option value="CULTURAL">Cultural</option>
                      <option value="NATURE">Nature</option>
                      <option value="ADVENTURE">Adventure</option>
                      <option value="WELLNESS">Wellness</option>
                      <option value="ROMANTIC">Romantic</option>
                      <option value="FAMILY">Family</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`available-${expIndex}-${pkgIndex}`}
                      checked={pkg.available}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "available",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label
                      htmlFor={`available-${expIndex}-${pkgIndex}`}
                      className="ml-2 text-xs font-semibold text-gray-600"
                    >
                      Available
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      value={pkg.description || ""}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "description",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 text-sm resize-none"
                      placeholder="Describe what's included in this package..."
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      CTA Label
                    </label>
                    <input
                      type="text"
                      value={pkg.ctaLabel || ""}
                      onChange={(e) =>
                        updatePackage(
                          expIndex,
                          pkgIndex,
                          "ctaLabel",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary bg-white text-gray-900 text-sm"
                      placeholder="Book Now"
                    />
                  </div>
                </div>
              </div>
            ))}

            {experience.packages.length === 0 && (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-sm">No packages added yet</p>
                <p className="text-xs mt-1">Add packages to this experience</p>
              </div>
            )}
          </div>
        </div>
      ))}

      {experiences.length === 0 && (
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No experiences added yet</p>
          <p className="text-sm mt-1">
            Click Add Experience to create your first one
          </p>
        </div>
      )}
    </div>
  );
}

function ContentTab({
  formData,
  onAttractionsChange,
  onAccommodationsChange,
  onExperiencesChange,
}: ContentTabProps) {
  console.log("🔍 CONTENT TAB - Rendering with:", {
    attractions: formData.attractions,
    accommodations: formData.accommodations,
    experiences: formData.experiences,
  });
  return (
    <div className="space-y-8">
      {/* Attractions Section */}
      <SimpleArrayEditor
        title="Attractions"
        items={formData.attractions}
        onChange={onAttractionsChange}
        fields={[
          {
            name: "label",
            label: "Attraction Name",
            type: "text",
            placeholder: "Lagoon View",
          },
          {
            name: "image",
            label: "Attraction Image",
            type: "image",
            placeholder: "Upload attraction image",
          },
        ]}
      />

      {/* Experiences Section */}
      <div className="border-t pt-8">
        <ExperiencesEditor
          experiences={formData.experiences}
          onChange={onExperiencesChange}
        />
      </div>

      {/* Accommodations Section */}
      <div className="border-t pt-8">
        <SimpleArrayEditor
          title="Accommodations"
          items={formData.accommodations}
          onChange={onAccommodationsChange}
          fields={[
            {
              name: "title",
              label: "Room Title",
              type: "text",
              placeholder: "DELUXE OCEAN-VIEW ROOM",
            },
            {
              name: "description",
              label: "Description",
              type: "textarea",
              placeholder: "Relax in our deluxe ocean-view room...",
            },
            {
              name: "image",
              label: "Room Image",
              type: "image",
              placeholder: "Upload room image",
            },
          ]}
        />
      </div>
    </div>
  );
}
