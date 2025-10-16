"use client";
import { useState, useEffect } from "react";

interface EditBranchFormProps {
  branch: any;
  onCancel: () => void;
  onSuccess: () => void;
}

type TabType =
  | "basic"
  | "contact"
  | "attractions"
  | "accommodations"
  | "experiences";

export default function EditBranchForm({
  branch,
  onCancel,
  onSuccess,
}: EditBranchFormProps) {
  const [activeTab, setActiveTab] = useState<TabType>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<any>(null);
  const [nestedData, setNestedData] = useState({
    contact: null,
    attractions: [],
    accommodations: [],
    experiences: [],
  });

  useEffect(() => {
    if (branch) {
      // Load basic branch data
      setFormData({
        slug: branch.slug,
        branchName: branch.branchName,
        description: branch.description,
        heroImage: branch.heroImage || "",
        directionsUrl: branch.directionsUrl || "",
        starRating: branch.starRating,
        published: branch.published,
        location: {
          city: branch.location?.city || "",
          region: branch.location?.region || "",
          country: branch.location?.country || "Ethiopia",
        },
        seo: {
          title: branch.seo?.title || "",
          description: branch.seo?.description || "",
          keywords: branch.seo?.keywords || [],
        },
      });

      // Load nested data
      setNestedData({
        contact: branch.contact,
        attractions: branch.attractions || [],
        accommodations: branch.accommodations || [],
        experiences: branch.experiences || [],
      });

      setLoading(false);
    }
  }, [branch]);

  const handleBasicChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (field.includes(".")) {
        const [parent, child] = field.split(".");
        return {
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const handleNestedChange = (type: keyof typeof nestedData, data: any) => {
    setNestedData((prev) => ({
      ...prev,
      [type]: data,
    }));
  };

  const saveBasicInfo = async () => {
    if (!formData) return false;

    try {
      const response = await fetch(`/api/admin/branches/${branch.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      return response.ok;
    } catch (error) {
      console.error("Save basic info error:", error);
      return false;
    }
  };

  const saveNestedData = async (type: keyof typeof nestedData) => {
    try {
      const response = await fetch(
        `/api/admin/branches/${branch.slug}/${type}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nestedData[type]),
        }
      );

      return response.ok;
    } catch (error) {
      console.error(`Save ${type} error:`, error);
      return false;
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Save basic info
      const basicSaved = await saveBasicInfo();
      if (!basicSaved) {
        setErrors({ submit: "Failed to save basic information" });
        return;
      }

      // Save all nested data
      const types: (keyof typeof nestedData)[] = [
        "contact",
        "attractions",
        "accommodations",
        "experiences",
      ];
      for (const type of types) {
        if (nestedData[type] !== null) {
          const saved = await saveNestedData(type);
          if (!saved) {
            setErrors({ submit: `Failed to save ${type}` });
            return;
          }
        }
      }

      onSuccess();
    } catch (error) {
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !formData) {
    return <div className="text-center py-8">Loading branch data...</div>;
  }

  return (
    <div className="max-h-[70vh] overflow-hidden flex flex-col">
      {/* Tabs */}
      <div className="flex border-b mb-6">
        {(
          [
            "basic",
            "contact",
            "attractions",
            "accommodations",
            "experiences",
          ] as TabType[]
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {errors.submit}
        </div>
      )}

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "basic" && (
          <BasicInfoTab formData={formData} onChange={handleBasicChange} />
        )}

        {activeTab === "contact" && (
          <ContactTab
            contact={nestedData.contact}
            onChange={(data) => handleNestedChange("contact", data)}
          />
        )}

        {activeTab === "attractions" && (
          <AttractionsTab
            attractions={nestedData.attractions}
            onChange={(data) => handleNestedChange("attractions", data)}
          />
        )}

        {activeTab === "accommodations" && (
          <AccommodationsTab
            accommodations={nestedData.accommodations}
            onChange={(data) => handleNestedChange("accommodations", data)}
          />
        )}

        {activeTab === "experiences" && (
          <ExperiencesTab
            experiences={nestedData.experiences}
            onChange={(data) => handleNestedChange("experiences", data)}
          />
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:bg-primary/70"
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}

// Basic Info Tab Component
function BasicInfoTab({
  formData,
  onChange,
}: {
  formData: any;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug
          </label>
          <input
            type="text"
            value={formData.slug}
            disabled
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Branch Name
          </label>
          <input
            type="text"
            value={formData.branchName}
            onChange={(e) => onChange("branchName", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onChange("description", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => onChange("location.city", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Region
          </label>
          <input
            type="text"
            value={formData.location.region}
            onChange={(e) => onChange("location.region", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <input
            type="text"
            value={formData.location.country}
            onChange={(e) => onChange("location.country", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hero Image URL
          </label>
          <input
            type="url"
            value={formData.heroImage}
            onChange={(e) => onChange("heroImage", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Directions URL
          </label>
          <input
            type="url"
            value={formData.directionsUrl}
            onChange={(e) => onChange("directionsUrl", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Star Rating
          </label>
          <select
            value={formData.starRating}
            onChange={(e) => onChange("starRating", parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          >
            {[3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} Stars
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => onChange("published", e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 text-sm text-gray-700">
            Published
          </label>
        </div>
      </div>
    </div>
  );
}

// Contact Tab Component
function ContactTab({
  contact,
  onChange,
}: {
  contact: any;
  onChange: (data: any) => void;
}) {
  const [form, setForm] = useState({
    phone: contact?.phone || "",
    email: contact?.email || "",
    address: contact?.address || "",
  });

  useEffect(() => {
    onChange(form);
  }, [form]);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, phone: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          placeholder="+251 911 000 111"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          type="email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          placeholder="addis@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          value={form.address}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, address: e.target.value }))
          }
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50"
          placeholder="Full address for this branch"
        />
      </div>
    </div>
  );
}

// Attractions Tab Component
function AttractionsTab({
  attractions,
  onChange,
}: {
  attractions: any[];
  onChange: (data: any[]) => void;
}) {
  const [items, setItems] = useState(attractions);

  const addAttraction = () => {
    const newItem = { id: `temp-${Date.now()}`, label: "", image: "" };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onChange(items);
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Attractions</h3>
        <button
          type="button"
          onClick={addAttraction}
          className="bg-primary text-white px-3 py-1 rounded text-sm"
        >
          + Add Attraction
        </button>
      </div>

      {items.map((item, index) => (
        <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label
              </label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => updateItem(index, "label", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Lagoon View"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={item.image}
                onChange={(e) => updateItem(index, "image", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="/images/attraction.jpg"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-600 text-sm hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No attractions added yet
        </div>
      )}
    </div>
  );
}

// Accommodations Tab Component
function AccommodationsTab({
  accommodations,
  onChange,
}: {
  accommodations: any[];
  onChange: (data: any[]) => void;
}) {
  const [items, setItems] = useState(accommodations);

  const addAccommodation = () => {
    const newItem = { title: "", description: "", image: "" };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onChange(items);
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Accommodations</h3>
        <button
          type="button"
          onClick={addAccommodation}
          className="bg-primary text-white px-3 py-1 rounded text-sm"
        >
          + Add Accommodation
        </button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="DELUXE OCEAN-VIEW ROOM"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={item.description}
                onChange={(e) =>
                  updateItem(index, "description", e.target.value)
                }
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Relax in our deluxe ocean-view room..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={item.image}
                onChange={(e) => updateItem(index, "image", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="/images/accommodation.jpg"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-600 text-sm hover:text-red-800 mt-2"
          >
            Remove
          </button>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No accommodations added yet
        </div>
      )}
    </div>
  );
}

// Experiences Tab Component (Simplified version)
function ExperiencesTab({
  experiences,
  onChange,
}: {
  experiences: any[];
  onChange: (data: any[]) => void;
}) {
  const [items, setItems] = useState(experiences);

  const addExperience = () => {
    const newItem = {
      title: "",
      highlightImage: "",
      packages: [],
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (index: number, field: string, value: string) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onChange(items);
  }, [items]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Experiences</h3>
        <button
          type="button"
          onClick={addExperience}
          className="bg-primary text-white px-3 py-1 rounded text-sm"
        >
          + Add Experience
        </button>
      </div>

      {items.map((item, index) => (
        <div key={index} className="border rounded-lg p-4 bg-gray-50">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Family Vacation Experience"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Highlight Image URL
              </label>
              <input
                type="url"
                value={item.highlightImage}
                onChange={(e) =>
                  updateItem(index, "highlightImage", e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="/images/experience.jpg"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="text-red-600 text-sm hover:text-red-800 mt-2"
          >
            Remove
          </button>
        </div>
      ))}

      {items.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No experiences added yet
        </div>
      )}
    </div>
  );
}
