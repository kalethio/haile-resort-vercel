"use client";
import { useState, useEffect } from "react";
import PasswordInput from "../PasswordInput";
import { validatePassword } from "@/lib/password-utils";

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
  slug: string;
}

export default function CreateUserModal({
  onClose,
  onSave,
}: CreateUserModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    roleId: "",
    branchSlug: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SUSPENDED",
  });
  const [roles, setRoles] = useState<Role[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [passwordError, setPasswordError] = useState("");

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

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      alert(passwordValidation.message);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    onSave(submitData);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg w-full max-w-2xl mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black">Create User</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
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
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Role
              </label>
              <select
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
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
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
                value={formData.branchSlug}
                onChange={(e) =>
                  setFormData({ ...formData, branchSlug: e.target.value })
                }
              >
                <option value="">System (No Branch)</option>
                {branches.map((branch) => (
                  <option key={branch.slug} value={branch.slug}>
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
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
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
          </div>

          <PasswordInput
            label="Password"
            value={formData.password}
            onChange={(val) => setFormData({ ...formData, password: val })}
            required
            showStrength
          />

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Confirm Password *
            </label>
            <input
              type="password"
              required
              className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-black"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4 sticky bottom-0 bg-white py-4 border-t mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-black rounded-lg py-2 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-black text-white rounded-lg py-2 hover:bg-gray-800 transition-colors"
            >
              Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
