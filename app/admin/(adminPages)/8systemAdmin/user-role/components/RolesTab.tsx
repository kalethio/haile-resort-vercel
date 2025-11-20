// app/admin/8systemAdmin/user-role/components/RolesTab.tsx
"use client";
import { useState, useEffect } from "react";
import CreateRoleModal from "./modals/CreateRoleModal";
import EditRoleModal from "./modals/EditRoleModal";

interface Role {
  id: number;
  name: string;
  description: string | null;
  isSystem: boolean;
  createdAt: string;
  permissions: Array<{
    id: number;
    module: string;
    action: string;
  }>;
  _count: {
    users: number;
  };
}

export default function RolesTab() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/system/roles");
      const data = await response.json();

      if (response.ok) {
        setRoles(data);
      } else {
        setError(data.error || "Failed to fetch roles");
      }
    } catch (err) {
      setError("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = async (roleData: any) => {
    try {
      const response = await fetch("/api/admin/system/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roleData),
      });

      if (response.ok) {
        await fetchRoles(); // Refresh the list
        setShowCreateModal(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create role");
      }
    } catch (err) {
      alert("Failed to create role");
    }
  };

  const handleUpdateRole = async (roleData: any) => {
    if (!selectedRole) return;

    try {
      const response = await fetch(
        `/api/admin/system/roles/${selectedRole.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(roleData),
        }
      );

      if (response.ok) {
        await fetchRoles(); // Refresh the list
        setShowEditModal(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update role");
      }
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteRole = async (role: Role) => {
    if (role.isSystem) {
      alert("System roles cannot be deleted");
      return;
    }

    if (role._count.users > 0) {
      alert("Cannot delete role that has users assigned");
      return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      try {
        const response = await fetch(`/api/admin/system/roles/${role.id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          await fetchRoles(); // Refresh the list
        } else {
          const errorData = await response.json();
          alert(errorData.error || "Failed to delete role");
        }
      } catch (err) {
        alert("Failed to delete role");
      }
    }
  };

  const getRoleColor = (roleName: string) => {
    const colors: { [key: string]: string } = {
      SUPER_ADMIN: "bg-red-100 text-red-800",
      ADMIN: "bg-purple-100 text-purple-800",
      MANAGER: "bg-blue-100 text-blue-800",
      STAFF: "bg-green-100 text-green-800",
    };
    return colors[roleName] || "bg-gray-100 text-gray-800";
  };

  const formatPermissions = (
    permissions: Array<{ module: string; action: string }>
  ) => {
    const grouped = permissions.reduce(
      (acc: { [key: string]: string[] }, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm.action);
        return acc;
      },
      {}
    );

    return Object.entries(grouped).map(
      ([module, actions]) => `${module}: ${actions.join(", ")}`
    );
  };

  if (loading) return <div className="p-8 text-center">Loading roles...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">User Roles</h2>
          <p className="text-gray-600 mt-1">
            Manage roles and their permissions
          </p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <span>+ Create Role</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-black text-lg">
                  {role.name}
                </h3>
                {role.description && (
                  <p className="text-gray-600 text-sm mt-1">
                    {role.description}
                  </p>
                )}
                {role.isSystem && (
                  <span className="text-xs text-orange-600 font-medium mt-1 block">
                    System Role
                  </span>
                )}
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role.name)}`}
              >
                {role._count.users} users
              </span>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Permissions:</div>
              <div className="flex flex-wrap gap-1">
                {formatPermissions(role.permissions).map(
                  (permission, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-black rounded text-xs"
                    >
                      {permission}
                    </span>
                  )
                )}
                {role.permissions.length === 0 && (
                  <span className="text-gray-400 text-xs">No permissions</span>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                className="text-black hover:text-gray-700 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                onClick={() => handleEditRole(role)}
                disabled={role.isSystem}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handleDeleteRole(role)}
                disabled={role.isSystem || role._count.users > 0}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRoleModal
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateRole}
        />
      )}

      {showEditModal && selectedRole && (
        <EditRoleModal
          role={selectedRole}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateRole}
        />
      )}
    </div>
  );
}
