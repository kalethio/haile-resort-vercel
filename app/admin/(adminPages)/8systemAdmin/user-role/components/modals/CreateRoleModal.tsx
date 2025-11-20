"use client";
import { useState } from "react";
import { PERMISSION_MODULES } from "@/app/admin/lib/permissions";

interface CreateRoleModalProps {
  onClose: () => void;
  onSave: (roleData: any) => void;
}

// Use the new permission system - just modules, no actions
const availableModules = Object.entries(PERMISSION_MODULES).map(
  ([key, value]) => ({
    key: value,
    label: key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" "),
  })
);

export default function CreateRoleModal({
  onClose,
  onSave,
}: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isSystem: false,
    permissions: [] as string[], // Now just module names
  });
  const [loading, setLoading] = useState(false);

  const handlePermissionToggle = (module: string) => {
    setFormData((prev) => {
      const isSelected = prev.permissions.includes(module);

      if (isSelected) {
        return {
          ...prev,
          permissions: prev.permissions.filter((m) => m !== module),
        };
      } else {
        return {
          ...prev,
          permissions: [...prev.permissions, module],
        };
      }
    });
  };

  const isPermissionSelected = (module: string) => {
    return formData.permissions.includes(module);
  };

  const handleSelectAll = () => {
    const allModules = availableModules.map((module) => module.key);
    const allSelected = formData.permissions.length === allModules.length;

    if (allSelected) {
      setFormData((prev) => ({ ...prev, permissions: [] }));
    } else {
      setFormData((prev) => ({ ...prev, permissions: allModules }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert("Role name is required");
      return;
    }

    if (formData.permissions.length === 0) {
      alert("Please select at least one permission");
      return;
    }

    setLoading(true);
    onSave(formData);
    setLoading(false);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const totalSelected = formData.permissions.length;
  const totalPossible = availableModules.length;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-xl font-semibold text-black">
              Create New Role
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Define role permissions and access levels
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="lg:col-span-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Role Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Front Desk Manager"
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe this role's responsibilities and access level..."
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black focus:ring-1 focus:ring-black h-32 resize-none"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  id="system-role"
                  checked={formData.isSystem}
                  onChange={(e) =>
                    setFormData({ ...formData, isSystem: e.target.checked })
                  }
                  className="rounded border-gray-300 text-black focus:ring-black"
                />
                <label
                  htmlFor="system-role"
                  className="ml-2 text-sm text-gray-700"
                >
                  This is a system role (cannot be deleted)
                </label>
              </div>

              {/* Permissions Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  Permissions Summary
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Selected Modules:</span>
                    <span className="font-medium text-blue-900">
                      {totalSelected}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Available:</span>
                    <span className="text-blue-900">{totalPossible}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions List */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-black">
                  Module Access *
                </label>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {totalSelected === totalPossible
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 border-b p-3">
                  <div className="text-sm font-medium text-gray-900">
                    Available Modules
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {availableModules.map((module) => (
                    <div
                      key={module.key}
                      className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {module.label}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          Full access to {module.label.toLowerCase()} module
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={isPermissionSelected(module.key)}
                        onChange={() => handlePermissionToggle(module.key)}
                        className="rounded border-gray-300 text-black focus:ring-black h-5 w-5"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-3 text-xs text-gray-500">
                💡 <strong>Note:</strong> Users will have full access to all
                features within selected modules.
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-black rounded-lg py-3 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading ||
                !formData.name.trim() ||
                formData.permissions.length === 0
              }
              className="flex-1 bg-black text-white rounded-lg py-3 hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
