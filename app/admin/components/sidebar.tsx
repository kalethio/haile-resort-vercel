"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  Bed,
  Users,
  Star,
  TrendingUp,
  Briefcase,
  Package,
  Settings,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  { label: "Reservations", icon: Star, href: "/admin/2reservations" },
  { label: "Room & Price", icon: Bed, href: "/admin/3roomAndPrice" },
  { label: "Guest Experience", icon: Users, href: "/admin/4guestExperience" },
  {
    label: "Marketing & Website CMS",
    icon: TrendingUp,
    href: "/admin/5marketingAndCMS",
  },
  { label: "HR Management", icon: Briefcase, href: "/admin/6HR" },
  { label: "Inventory Management", icon: Package, href: "/admin/7Inventory" },
  { label: "System Admin", icon: Settings, href: "/admin/8system" },
];

export default function Sidebar() {
  const pathname = usePathname();

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

      {/* Elegant Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {menuItems.map(({ label, icon: Icon, href }) => {
          // Fixed: Dashboard only active on exact match, others use startsWith
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
      </div>
    </aside>
  );
}
