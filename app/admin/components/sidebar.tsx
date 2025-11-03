"use client";

import { useState, useEffect } from "react";
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
  Building,
  Star,
  TrendingUp,
  Shield,
  Mail,
  ClipboardList,
  Bed,
  Wifi,
  ChevronDown,
  Hotel,
  CreditCard,
  MessageSquare,
  Smartphone,
  Globe,
  Target,
  FileBarChart,
  UserCheck,
  Clock,
  Database,
  Network,
  LucideIcon,
} from "lucide-react";

interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "Core Operations",
    items: [
      { label: "Dashboard", icon: Home, href: "/admin" },
      {
        label: "Reservations",
        icon: Calendar,
        href: "/admin/2reservations",
        permission: "reservations.view",
      },
      {
        label: "Guest Management",
        icon: Users,
        href: "/admin/guests",
        permission: "guests.view",
      },
      {
        label: "Housekeeping",
        icon: Bed,
        href: "/admin/housekeeping",
        permission: "operations.view",
      },
      {
        label: "Check-in/Out",
        icon: UserCheck,
        href: "/admin/checkin-out",
        permission: "operations.view",
      },
    ],
  },
  {
    title: "Revenue & Distribution",
    items: [
      {
        label: "Finance Overview",
        icon: DollarSign,
        href: "/admin/finance",
        permission: "finance.access",
      },
      {
        label: "Rate Intelligence",
        icon: TrendingUp,
        href: "/admin/rates",
        permission: "revenue.access",
      },
      {
        label: "Channel Manager",
        icon: Globe,
        href: "/admin/channels",
        permission: "revenue.access",
      },
      {
        label: "Business Intelligence",
        icon: BarChart,
        href: "/admin/analytics",
        permission: "analytics.view",
      },
      {
        label: "Billing & Invoices",
        icon: CreditCard,
        href: "/admin/billing",
        permission: "finance.access",
      },
    ],
  },
  {
    title: "HR & Talent",
    items: [
      {
        label: "Job Applications",
        icon: Briefcase,
        href: "/admin/jobs",
        permission: "staff.view",
      },
      {
        label: "Team Management",
        icon: Users,
        href: "/admin/team",
        permission: "staff.manage",
      },
      {
        label: "Staff Scheduling",
        icon: Clock,
        href: "/admin/scheduling",
        permission: "staff.schedule",
      },
      {
        label: "Performance Reviews",
        icon: FileBarChart,
        href: "/admin/reviews",
        permission: "staff.manage",
      },
    ],
  },
  {
    title: "Guest Experience",
    items: [
      {
        label: "Digital Check-in",
        icon: Smartphone,
        href: "/admin/digital-checkin",
        permission: "guests.manage",
      },
      {
        label: "Service Requests",
        icon: ClipboardList,
        href: "/admin/services",
        permission: "services.view",
      },
      {
        label: "Loyalty Program",
        icon: Star,
        href: "/admin/loyalty",
        permission: "loyalty.manage",
      },
      {
        label: "Reviews & Feedback",
        icon: MessageSquare,
        href: "/admin/feedback",
        permission: "reviews.view",
      },
      {
        label: "Concierge Services",
        icon: Hotel,
        href: "/admin/concierge",
        permission: "services.manage",
      },
    ],
  },
  {
    title: "Marketing & Content",
    items: [
      {
        label: "Website CMS",
        icon: FileText,
        href: "/admin/cms",
        permission: "cms.access",
      },
      {
        label: "Email Campaigns",
        icon: Mail,
        href: "/admin/email",
        permission: "marketing.email",
      },
      {
        label: "Promotions",
        icon: TrendingUp,
        href: "/admin/promotions",
        permission: "marketing.manage",
      },
      {
        label: "Social Media",
        icon: Users,
        href: "/admin/social",
        permission: "marketing.social",
      },
      {
        label: "SEO & Analytics",
        icon: Target,
        href: "/admin/seo",
        permission: "marketing.manage",
      },
    ],
  },
  {
    title: "Multi-Branch Control",
    items: [
      {
        label: "Branch Overview",
        icon: Building,
        href: "/admin/branches",
        permission: "branches.view",
      },
      {
        label: "Addis Ababa",
        icon: Building,
        href: "/admin/branches/addis",
        permission: "branches.manage",
      },
      {
        label: "Hawassa",
        icon: Building,
        href: "/admin/branches/hawassa",
        permission: "branches.manage",
      },
      {
        label: "Awassa",
        icon: Building,
        href: "/admin/branches/awassa",
        permission: "branches.manage",
      },
      {
        label: "Bahir Dar",
        icon: Building,
        href: "/admin/branches/bahirdar",
        permission: "branches.manage",
      },
    ],
  },
  {
    title: "Inventory & Services",
    items: [
      {
        label: "Room Management",
        icon: Package,
        href: "/admin/rooms",
        permission: "inventory.manage",
      },
      {
        label: "Price Management",
        icon: DollarSign,
        href: "/admin/pricing",
        permission: "finance.services",
      },
      {
        label: "Amenities",
        icon: Wifi,
        href: "/admin/amenities",
        permission: "inventory.manage",
      },
      {
        label: "Maintenance",
        icon: Settings,
        href: "/admin/maintenance",
        permission: "operations.manage",
      },
      {
        label: "Inventory Tracking",
        icon: Package,
        href: "/admin/inventory",
        permission: "inventory.manage",
      },
    ],
  },
  {
    title: "System Administration",
    items: [
      {
        label: "System Settings",
        icon: Settings,
        href: "/admin/settings",
        permission: "settings.access",
      },
      {
        label: "User Permissions",
        icon: Users,
        href: "/admin/users",
        permission: "user.manage",
      },
      {
        label: "Audit Logs",
        icon: Shield,
        href: "/admin/audit",
        permission: "audit.view",
      },
      {
        label: "API Connections",
        icon: Network,
        href: "/admin/api",
        permission: "system.manage",
      },
      {
        label: "Database Management",
        icon: Database,
        href: "/admin/database",
        permission: "system.manage",
      },
      {
        label: "Backup & Recovery",
        icon: Shield,
        href: "/admin/backup",
        permission: "system.manage",
      },
    ],
  },
];

export default function Sidebar({
  permissions = {},
}: {
  permissions?: Record<string, boolean>;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  // Show all items during development
  const shouldShowItem = () => true;

  // Simple toggle function - only one group open at a time
  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => {
      const newState: Record<string, boolean> = {};

      // If this group is already open, close it (collapse all)
      if (prev[title]) {
        return newState; // All groups closed
      }

      // Otherwise, open this group and close others
      newState[title] = true;
      return newState;
    });
  };

  // Auto-open the group containing the current active page
  useEffect(() => {
    const currentGroup = menuGroups.find((group) =>
      group.items.some((item) => pathname.startsWith(item.href))
    );

    if (currentGroup) {
      setOpenGroups({ [currentGroup.title]: true });
    }
  }, [pathname]);

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-full select-none">
      {/* Simple Header */}
      <div className="h-16 flex items-center px-4 border-b border-gray-200">
        <Link
          href="/"
          className="font-semibold text-gray-900 text-lg hover:text-blue-600 transition-colors"
        >
          Haile Hotels & Resorts
        </Link>
      </div>

      {/* Clean Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuGroups.map(({ title, items }) => {
          const visibleItems = items.filter(shouldShowItem);

          if (!visibleItems.length) return null;

          const isOpen = openGroups[title] || false;

          return (
            <div key={title} className="space-y-1">
              {/* Interactive Group Header */}
              <button
                onClick={() => toggleGroup(title)}
                className={`flex w-full justify-between items-center p-3 text-sm font-semibold rounded-lg transition-all duration-200 hover:bg-gray-75 border ${
                  isOpen
                    ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{title}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`}
                />
              </button>

              {/* Animated Items */}
              {isOpen && (
                <div className="ml-2 space-y-1 animate-in fade-in duration-200">
                  {visibleItems.map(({ label, icon: Icon, href }) => {
                    const active =
                      pathname === href || pathname.startsWith(href + "/");
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 p-2 text-sm rounded-lg transition-all duration-150 group ${
                          active
                            ? "bg-blue-100 text-blue-700 font-semibold shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                        }`}
                      >
                        <Icon
                          size={16}
                          className={
                            active
                              ? "text-blue-700"
                              : "text-gray-400 group-hover:text-gray-600"
                          }
                        />
                        <span className="flex-1">{label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Simple Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">System Online</div>
      </div>
    </aside>
  );
}
