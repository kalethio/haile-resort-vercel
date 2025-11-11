// D:\(adminPages)\8systemAdmin\user-role\components\modals\CreateRoleModal.tsx
"use client";
import { useState } from "react";

interface CreateRoleModalProps {
  onClose: () => void;
  onSave: (roleData: any) => void;
}

const availablePermissions = [
  "User Management",
  "Room Management",
  "Reservations",
  "Billing",
  "Reports",
  "Staff Management",
  "Inventory",
  "Guest Services",
];

export default function CreateRoleModal({
  onClose,
  onSave,
}: CreateRoleModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: Date.now(),
      userCount: 0,
      color: "bg-gray-100 text-gray-800",
    });
  };

  return (
    <div className="fixed inset-0 bg-accent/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-black">Create New Role</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Role Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Front Desk Manager"
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Description
            </label>
            <textarea
              placeholder="Describe this role's responsibilities..."
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black h-20"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-3">
              Permissions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availablePermissions.map((permission) => (
                <label key={permission} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.permissions.includes(permission)}
                    onChange={() => handlePermissionToggle(permission)}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-black">{permission}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-black rounded py-2 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white rounded py-2 hover:bg-gray-800 transition-colors"
            >
              Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
