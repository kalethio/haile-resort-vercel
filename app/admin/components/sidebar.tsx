"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Calendar,
  Users,
  FileText,
  Settings,
  BarChart,
  Briefcase,
  Package,
  DollarSign,
  LucideIcon,
} from "lucide-react";

// ------------------------------
// Types
// ------------------------------
interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon; // ✅ Instead of "any"
  permission?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}
// ------------------------------
// Menu Config (all lists included)
// ------------------------------
const menuGroups: MenuGroup[] = [
  {
    title: "Operations",
    items: [
      { label: "Dashboard", icon: Home, href: "/admin" },
      {
        label: "Reservations",
        icon: Calendar,
        href: "../admin/2reservations",
        permission: "reservations.view",
      },
      {
        label: "Guests",
        icon: Users,
        href: "/admin/3guests",
        permission: "guests.view",
      },
      {
        label: "Staff",
        icon: Briefcase,
        href: "/admin/4staff",
        permission: "staff.view",
      },
    ],
  },
  {
    title: "Marketing & Website",
    items: [
      {
        label: "CMS",
        icon: FileText,
        href: "/admin/5CMS",
        permission: "cms.access",
      },
      {
        label: "Email Campaigns",
        icon: FileText,
        href: "/admin/6emailMarketing",
        permission: "marketing.email",
      },
    ],
  },
  {
    title: "Finance & Inventory",
    items: [
      {
        label: "Finance Overview",
        icon: DollarSign,
        href: "/admin/7finance",
        permission: "finance.access",
      },
      {
        label: "Billing & Transactions",
        icon: DollarSign,
        href: "/admin/7finance/billing",
        permission: "finance.billing",
      },
      {
        label: "Services & Inventory",
        icon: Package,
        href: "/admin/7finance/inventory",
        permission: "finance.services",
      },
    ],
  },
  {
    title: "Inventory Management",
    items: [
      {
        label: "Inventory",
        icon: BarChart,
        href: "/admin/8inventory",
        permission: "reports.view",
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        label: "System Settings",
        icon: Settings,
        href: "/admin/10systemSetting",
        permission: "settings.access",
      },
      {
        label: "User Permissions",
        icon: Users,
        href: "/admin/11userRole",
        permission: "user.manage",
      },
    ],
  },
];

// ------------------------------
// Helper
// ------------------------------
function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

// ------------------------------
// Sidebar Component
// ------------------------------
export default function Sidebar({
  permissions = {},
}: {
  permissions?: Record<string, boolean>;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-64 bg-white border-r shadow-sm flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="h-16 flex items-center justify-center border-b">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Haile Hotel and Resorts
        </Link>
      </div>

      {/* Menu Groups */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-4">
        {menuGroups.map(({ title, items }) => {
          // Filter by permissions
          const visibleItems = items.filter(
            (item) => !item.permission || permissions[item.permission]
          );
          if (!visibleItems.length) return null;

          const isOpen = openGroups[title] ?? true;

          return (
            <div key={title}>
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(title)}
                className="flex w-full justify-between items-center px-2 py-1 text-xs font-semibold text-gray-500 uppercase hover:text-gray-700"
              >
                {title}
                <span className="text-gray-400">{isOpen ? "▾" : "▸"}</span>
              </button>

              {/* Group Items */}
              {isOpen && (
                <div className="mt-1 space-y-1">
                  {visibleItems.map(({ label, icon: Icon, href }) => {
                    const active = pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <Icon size={18} />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
