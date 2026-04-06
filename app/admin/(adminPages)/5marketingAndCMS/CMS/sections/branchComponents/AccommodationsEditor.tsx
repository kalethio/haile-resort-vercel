"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, X } from "lucide-react";
import ImageUpload from "@/app/components/ImageUpload";

interface Accommodation {
  id?: number;
  title: string;
  description: string;
  image: string;
}

interface AccommodationsEditorProps {
  items: Accommodation[];
  onChange: (items: Accommodation[]) => void;
}

// Helper to generate unique temporary ID for new items
const generateTempId = () =>
  `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export default function AccommodationsEditor({
  items,
  onChange,
}: AccommodationsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Accommodation>({
    title: "",
    description: "",
    image: "",
  });

  const handleAdd = () => {
    setEditForm({ title: "", description: "", image: "" });
    setEditingIndex(-1);
  };

  const handleEdit = (index: number) => {
    setEditForm(items[index]);
    setEditingIndex(index);
  };

  const handleSave = () => {
    if (!editForm.title.trim()) {
      alert("Title is required");
      return;
    }

    if (editingIndex === -1) {
      // Add new - use temp ID
      onChange([
        ...items,
        { ...editForm, id: undefined, _tempId: generateTempId() } as any,
      ]);
    } else {
      // Edit existing
      const newItems = [...items];
      newItems[editingIndex] = editForm;
      onChange(newItems);
    }
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    if (confirm("Delete this accommodation?")) {
      const newItems = items.filter((_, i) => i !== index);
      onChange(newItems);
    }
  };

  const handleCancel = () => {
    setEditingIndex(null);
  };

  // Get unique key for each item
  const getItemKey = (item: Accommodation, index: number) => {
    if (item.id) return `id-${item.id}`;
    if ((item as any)._tempId) return (item as any)._tempId;
    return `index-${index}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Accommodations & Services
          </h3>
          <p className="text-gray-600 text-sm mt-1">
            Manage services displayed in the carousel (Restaurant, Spa,
            Conference Room, etc.)
          </p>
        </div>
        {editingIndex === null && (
          <button
            onClick={handleAdd}
            className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Service
          </button>
        )}
      </div>

      {/* Edit Form Modal */}
      {editingIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingIndex === -1 ? "Add Service" : "Edit Service"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full text-black px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary"
                  placeholder="Restaurant, Spa, Conference Room..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={3}
                  className="w-full text-black px-4 py-2 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
                  placeholder="Describe this service..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Image
                </label>
                <ImageUpload
                  value={editForm.image}
                  onChange={(url) => setEditForm({ ...editForm, image: url })}
                  subfolder="accommodations"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      {items.length > 0 && editingIndex === null && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, index) => (
            <div
              key={getItemKey(item, index)}
              className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h4 className="font-semibold text-gray-900 text-lg mb-2">
                  {item.title}
                </h4>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {item.description}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="px-3 py-2 border border-red-300 rounded-lg text-red-600 font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {items.length === 0 && editingIndex === null && (
        <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-3xl mb-3">🏨</div>
          <p className="font-medium">No services added yet</p>
          <p className="text-sm mt-1">Click Add Service to get started</p>
        </div>
      )}
    </div>
  );
}
