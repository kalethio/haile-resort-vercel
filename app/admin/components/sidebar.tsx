"use client";

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
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: string;
  requiredRole?: string[];
}

interface SidebarProps {
  user: {
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
    requiredPermission: "system_permissions", // Changed to use permissions
  },
];

export default function Sidebar({ user, permissions }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // Filter menu items based on user permissions and role
  const filteredMenuItems = menuItems.filter((item) => {
    // Dashboard is always visible
    if (item.href === "/admin") return true;

    // Check role-based access (System Admin requires specific roles)
    if (item.requiredRole) {
      if (!item.requiredRole.includes(user.role)) {
        return false;
      }
      return true;
    }

    // Check permission-based access
    if (item.requiredPermission) {
      // For SUPER_ADMIN, show all items regardless of permissions
      if (user.role === "SUPER_ADMIN") {
        return true;
      }

      // For other roles, check the specific permission
      if (!permissions[item.requiredPermission]) {
        return false;
      }
    }

    return true;
  });

  return (
    <aside className="w-fit p-2 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Minimal Header */}
      <div className="h-20 flex bg-gray-100 items-center px-6">
        <Link
          href="/"
          className="font-light text-xl text-gray-900 tracking-tight"
        >
          Haile Hotel and Resorts
        </Link>
      </div>
      {/* User Info & Sign Out */}
      <div className="px-4 py-3 my-2 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("") || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate capitalize">
                {user.role.toLowerCase().replace("_", " ")}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>

        {user.branch && (
          <p className="text-xs text-gray-400 mt-2 truncate">
            {user.branch.name}
          </p>
        )}
      </div>
      {/* Elegant Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
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
              }`}
            >
              <Icon
                size={20}
                className={active ? "text-white" : "text-gray-400"}
                strokeWidth={1.5}
              />
              <span className="font-medium text-sm tracking-wide">{label}</span>
            </Link>
          );
        })}
      </nav>
      {/* Subtle Status */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
          <span>System Online</span>
        </div>
        <div className="mt-1 text-xs text-gray-400">
          {user.role === "SUPER_ADMIN" ? "Full Access" : "Limited Access"}
        </div>
      </div>
    </aside>
  );
}
