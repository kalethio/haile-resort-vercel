// app/admin/8systemAdmin/user-role/components/modals/CreateUserModal.tsx
"use client";
import { useState, useEffect } from "react";

interface CreateUserModalProps {
  onClose: () => void;
  onSave: (userData: any) => void;
}

interface Role {
  id: number;
  name: string;
}

interface Branch {
  id: number;
  branchName: string;
}

export default function CreateUserModal({
  onClose,
  onSave,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    branchId: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SUSPENDED",
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [rolesRes, branchesRes] = await Promise.all([
        fetch("/api/admin/system/roles"),
        fetch("/api/admin/branches-list"),
      ]);

      const rolesData = await rolesRes.json();
      const branchesData = await branchesRes.json();

      if (rolesRes.ok) setRoles(rolesData);
      if (branchesRes.ok) setBranches(branchesData.branches || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      alert("Name, email, and password are required");
      return;
    }
    onSave(formData);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-accent/30 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-accent/30 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-md mx-4 shadow-lg">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-black">Create New User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Password *
            </label>
            <input
              type="password"
              required
              placeholder="Set temporary password"
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Role
            </label>
            <select
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.roleId}
              onChange={(e) =>
                setFormData({ ...formData, roleId: e.target.value })
              }
            >
              <option value="">No Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Branch
            </label>
            <select
              className="w-full text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-black"
              value={formData.branchId}
              onChange={(e) =>
                setFormData({ ...formData, branchId: e.target.value })
              }
            >
              <option value="">System (No Branch)</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branchName}
                </option>
              ))}
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
                setFormData({ ...formData, status: e.target.value as any })
              }
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
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
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
