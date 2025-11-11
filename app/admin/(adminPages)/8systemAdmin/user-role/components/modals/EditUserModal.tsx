"use client";
import { useState, useEffect } from "react";

interface EditUserModalProps {
  user: any;
  onClose: () => void;
  onSave: (userData: any) => void;
}

export default function EditUserModal({
  user,
  onClose,
  onSave,
}: EditUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    department: "",
    status: "active",
  });

  useEffect(() => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      department: user.department || "",
      status: user.status,
    });
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData,
    });
  };

  // Close modal when clicking outside content
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-accent/30 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-black">Edit User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {["name", "email", "phone", "department"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-black mb-1 capitalize">
                {field === "name" ? "Full Name" : field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                required={field === "name" || field === "email"}
                className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData({ ...formData, [field]: e.target.value })
                }
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Role
            </label>
            <select
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="Front Desk">Front Desk</option>
              <option value="Hotel Manager">Hotel Manager</option>
              <option value="Housekeeping">Housekeeping</option>
              <option value="Super Admin">Super Admin</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Status
            </label>
            <select
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
