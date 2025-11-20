"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import UsersTab from "./components/UsersTab";
import RolesTab from "./components/RolesTab";

export default function UserRole() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("users");

  // Check if user is SUPER_ADMIN for role management
  const isSuperAdmin = session?.user.role === "SUPER_ADMIN";

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">
            User Role Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage staff access and permissions
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          className={`px-4 py-2 rounded-md transition-all ${activeTab === "users" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"}`}
          onClick={() => setActiveTab("users")}
        >
          Users
        </button>
        {isSuperAdmin && (
          <button
            className={`px-4 py-2 rounded-md transition-all ${activeTab === "roles" ? "bg-white text-black shadow-sm" : "text-gray-600 hover:text-black"}`}
            onClick={() => setActiveTab("roles")}
          >
            Roles
          </button>
        )}
      </div>

      {/* Render Active Tab */}
      {activeTab === "users" && <UsersTab />}
      {activeTab === "roles" && isSuperAdmin && <RolesTab />}
    </div>
  );
}
