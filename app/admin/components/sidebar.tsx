"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  Home,
  Bed,
  Users,
  Star,
  TrendingUp,
  Briefcase,
  Package,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Key,
  LucideIcon,
} from "lucide-react";
import ChangePasswordModal from "./ChangePasswordModal";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: string;
  requiredRole?: string[];
}

interface SidebarProps {
  user: {
    id?: string;
    name: string;
    email: string;
    role: string;
    branch?: {
      name: string;
      slug: string;
    };
  };
  permissions: {
    [key: string]: boolean;
  };
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  {
    label: "Reservations",
    icon: Star,
    href: "/admin/2reservations",
    requiredPermission: "reservations",
  },
  {
    label: "Room & Price",
    icon: Bed,
    href: "/admin/3roomAndPrice",
    requiredPermission: "room_price",
  },
  {
    label: "Guest Experience",
    icon: Users,
    href: "/admin/4guestExperience",
    requiredPermission: "guest_experience",
  },
  {
    label: "Marketing & Website CMS",
    icon: TrendingUp,
    href: "/admin/5marketingAndCMS",
    requiredPermission: "cms_branch_manager",
  },
  {
    label: "HR Management",
    icon: Briefcase,
    href: "/admin/6HR",
    requiredPermission: "hr",
  },
  {
    label: "Inventory Management",
    icon: Package,
    href: "/admin/7Inventory",
    requiredPermission: "inventory",
  },
  {
    label: "System Admin",
    icon: Settings,
    href: "/admin/8systemAdmin",
    requiredPermission: "system_permissions",
  },
];

export default function Sidebar({ user, permissions }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (item.href === "/admin") return true;
    if (item.requiredRole) {
      if (!item.requiredRole.includes(user.role)) return false;
      return true;
    }
    if (item.requiredPermission) {
      if (user.role === "SUPER_ADMIN") return true;
      if (!permissions[item.requiredPermission]) return false;
    }
    return true;
  });

  return (
    <>
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-100 flex flex-col transition-all duration-300 z-30
          ${isCollapsed ? "w-20" : "w-64"}`}
      >
        {/* Toggle Button on the edge */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors z-40"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Header */}
        <div
          className={`h-20 flex items-center ${isCollapsed ? "justify-center px-2" : "px-6"} bg-gray-100`}
        >
          {!isCollapsed && (
            <Link
              href="/"
              className="font-light text-xl text-gray-900 tracking-tight"
            >
              Haile Hotels
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="font-bold text-xl text-gray-900">
              H
            </Link>
          )}
        </div>

        {/* User Info */}
        <div
          className={`px-3 py-3 my-2 border-b border-gray-100 ${isCollapsed ? "text-center" : ""}`}
        >
          <div
            className={`flex items-center ${isCollapsed ? "flex-col" : "justify-between"}`}
          >
            <div
              className={`flex items-center ${isCollapsed ? "flex-col gap-2" : "gap-3"} flex-1 min-w-0`}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-gray-600">
                  {user.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 truncate capitalize">
                    {user.role.toLowerCase().replace("_", " ")}
                  </p>
                </div>
              )}
            </div>

            {!isCollapsed && (
              <button
                onClick={handleSignOut}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>

          {!isCollapsed && user.branch && (
            <p className="text-xs text-gray-400 mt-2 truncate">
              {user.branch.name}
            </p>
          )}

          {isCollapsed && (
            <button
              onClick={handleSignOut}
              className="mt-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors w-full flex justify-center"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map(({ label, icon: Icon, href }) => {
            const active =
              href === "/admin"
                ? pathname === "/admin"
                : pathname === href || pathname.startsWith(href + "/");

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  active
                    ? "bg-gray-900 text-white"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? label : ""}
              >
                <Icon
                  size={20}
                  className={active ? "text-white" : "text-gray-400"}
                  strokeWidth={1.5}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm tracking-wide">
                    {label}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Change Password & Status */}
        <div className="border-t border-gray-100">
          {/* Change Password Button */}
          <button
            onClick={() => setShowChangePassword(true)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Change Password" : ""}
          >
            <Key size={18} className="text-gray-400" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Change Password</span>
            )}
          </button>

          {/* Status */}
          <div className={`p-4 ${isCollapsed ? "text-center" : ""}`}>
            <div
              className={`flex items-center gap-2 text-xs text-gray-500 ${isCollapsed ? "justify-center" : ""}`}
            >
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              {!isCollapsed && <span>System Online</span>}
            </div>
            {!isCollapsed && (
              <div className="mt-1 text-xs text-gray-400">
                {user.role === "SUPER_ADMIN" ? "Full Access" : "Limited Access"}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Content margin */}
      <div
        className={`transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}
      />

      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal
          userId={user.id}
          userEmail={user.email}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </>
  );
}
