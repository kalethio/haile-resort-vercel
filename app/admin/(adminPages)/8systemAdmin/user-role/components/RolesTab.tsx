// D:\(adminPages)\8systemAdmin\user-role\components\RolesTab.tsx
"use client";
import { useState } from "react";
import CreateRoleModal from "./modals/CreateRoleModal";
import EditRoleModal from "./modals/EditRoleModal";

const mockRoles = [
  {
    id: 1,
    name: "Super Admin",
    userCount: 3,
    permissions: ["All Access"],
    color: "bg-red-100 text-red-800",
  },
  {
    id: 2,
    name: "Hotel Manager",
    userCount: 12,
    permissions: ["Reports", "Staff", "Inventory"],
    color: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    name: "Front Desk",
    userCount: 8,
    permissions: ["Check-in", "Bookings", "Guests"],
    color: "bg-green-100 text-green-800",
  },
];

export default function RolesTab() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleEditRole = (role: any) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteRole = (role: any) => {
    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      console.log("Delete role:", role.id);
      // Add actual delete logic here
    }
  };

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
        {mockRoles.map((role) => (
          <div
            key={role.id}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-black text-lg">{role.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${role.color}`}
              >
                {role.userCount} users
              </span>
            </div>

            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Permissions:</div>
              <div className="flex flex-wrap gap-1">
                {role.permissions.map((permission, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-black rounded text-xs"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button
                className="text-black hover:text-gray-700 text-sm font-medium px-3 py-1 rounded border border-gray-300 hover:border-gray-400 transition-colors"
                onClick={() => handleEditRole(role)}
              >
                Edit
              </button>
              <button
                className="text-red-600 hover:text-red-700 text-sm font-medium px-3 py-1 rounded border border-red-200 hover:border-red-300 transition-colors"
                onClick={() => handleDeleteRole(role)}
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
          onSave={(roleData) => {
            console.log("Create role:", roleData);
            setShowCreateModal(false);
          }}
        />
      )}

      {showEditModal && selectedRole && (
        <EditRoleModal
          role={selectedRole}
          onClose={() => setShowEditModal(false)}
          onSave={(roleData) => {
            console.log("Update role:", roleData);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}
