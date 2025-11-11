// D:\(adminPages)\8systemAdmin\user-role\components\UsersTab.tsx
"use client";
import { useState } from "react";
import ViewUserModal from "./modals/ViewUseModal";
import EditUserModal from "./modals/EditUserModal";
import CreateUserModal from "./modals/CreateUserModal";

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@hotel.com",
    role: "Hotel Manager",
    status: "active",
    lastActive: "2024-01-15 14:30",
    phone: "+1-555-0123",
    department: "Management",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@hotel.com",
    role: "Front Desk",
    status: "active",
    lastActive: "2024-01-15 13:15",
    phone: "+1-555-0124",
    department: "Reception",
  },
];

const mockRoles = [
  { id: 1, name: "Super Admin", color: "bg-red-100 text-red-800" },
  { id: 2, name: "Hotel Manager", color: "bg-blue-100 text-blue-800" },
  { id: 3, name: "Front Desk", color: "bg-green-100 text-green-800" },
];

export default function UsersTab() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-black">Staff Users</h2>
          <p className="text-gray-600 mt-1">
            Manage all staff members and their access
          </p>
        </div>
        <button
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          onClick={() => setShowCreateModal(true)}
        >
          <span>+ Create User</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 text-left text-black font-semibold">User</th>
              <th className="p-4 text-left text-black font-semibold">Role</th>
              <th className="p-4 text-left text-black font-semibold">
                Last Active
              </th>
              <th className="p-4 text-left text-black font-semibold">Status</th>
              <th className="p-4 text-left text-black font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <div className="font-medium text-black">{user.name}</div>
                    <div className="text-gray-600 text-sm">{user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${mockRoles.find((r) => r.name === user.role)?.color || "bg-gray-100 text-gray-800"}`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-gray-600 text-sm">{user.lastActive}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-3">
                    <button
                      className="text-black hover:text-gray-700 text-sm font-medium"
                      onClick={() => handleViewUser(user)}
                    >
                      View
                    </button>
                    <button
                      className="text-black hover:text-gray-700 text-sm font-medium"
                      onClick={() => handleEditUser(user)}
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onSave={(userData) => {
            console.log("Create user:", userData);
            setShowCreateModal(false);
          }}
        />
      )}

      {showViewModal && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
          onEdit={() => {
            setShowViewModal(false);
            handleEditUser(selectedUser);
          }}
        />
      )}

      {showEditModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditModal(false)}
          onSave={(userData) => {
            console.log("Update user:", userData);
            setShowEditModal(false);
          }}
        />
      )}
    </div>
  );
}
