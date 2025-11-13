// app/admin/8systemAdmin/user-role/components/UsersTab.tsx
"use client";
import { useState, useEffect } from "react";
import ViewUserModal from "./modals/ViewUseModal";
import EditUserModal from "./modals/EditUserModal";
import CreateUserModal from "./modals/CreateUserModal";

interface User {
  id: number;
  name: string | null;
  email: string;
  role?: {
    id: number;
    name: string;
    description: string | null;
  };
  branch?: {
    id: number;
    branchName: string;
    slug: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/system/users");
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    try {
      const response = await fetch("/api/admin/system/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setShowCreateModal(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to create user");
      }
    } catch (err) {
      alert("Failed to create user");
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `/api/admin/system/users/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        await fetchUsers(); // Refresh the list
        setShowEditModal(false);
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Failed to update user");
      }
    } catch (err) {
      alert("Failed to update user");
    }
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return <div className="p-8 text-center">Loading users...</div>;
  if (error)
    return <div className="p-8 text-center text-red-600">Error: {error}</div>;

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
              <th className="p-4 text-left text-black font-semibold">Branch</th>
              <th className="p-4 text-left text-black font-semibold">Status</th>
              <th className="p-4 text-left text-black font-semibold">
                Created
              </th>
              <th className="p-4 text-left text-black font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4">
                  <div>
                    <div className="font-medium text-black">
                      {user.name || "No Name"}
                    </div>
                    <div className="text-gray-600 text-sm">{user.email}</div>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role?.name || "")}`}
                  >
                    {user.role?.name || "No Role"}
                  </span>
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {user.branch?.branchName || "System"}
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : user.status === "SUSPENDED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status.toLowerCase()}
                  </span>
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {formatDate(user.createdAt)}
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
          onSave={handleCreateUser}
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
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
}
