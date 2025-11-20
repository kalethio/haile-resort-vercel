"use client";
import { useSession } from "next-auth/react";

export default function SystemAdmin() {
  const { data: session } = useSession();

  const cards = [
    {
      title: "User Admin",
      description: "Manage roles and permissions",
      href: "/admin/8systemAdmin/user-role",
      requiredRole: ["SUPER_ADMIN", "ADMIN"],
      requiredPermission: "system_users",
    },
    {
      title: "Audit Logs",
      description: "View system activity and changes",
      href: "/admin/8systemAdmin/audit-logs",
      requiredRole: ["SUPER_ADMIN", "ADMIN"],
      requiredPermission: "system_audit",
    },
    {
      title: "API Connections",
      description: "Configure external integrations",
      href: "/admin/8systemAdmin/api-connections",
      requiredRole: ["SUPER_ADMIN"],
      requiredPermission: "system_api",
    },
  ];

  // Filter cards based on user role and permissions
  const filteredCards = cards.filter((card) => {
    // SUPER_ADMIN can access everything
    if (session?.user.role === "SUPER_ADMIN") return true;

    // Check role requirement
    if (card.requiredRole && !card.requiredRole.includes(session?.user.role)) {
      return false;
    }

    // Check permission requirement
    if (card.requiredPermission) {
      const hasPermission = session?.user.permissions?.some(
        (p) => `${p.module}.${p.action}` === card.requiredPermission
      );
      if (!hasPermission) return false;
    }

    return true;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-accent mb-6">
        System Administration
      </h1>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Access Restricted
          </h3>
          <p className="text-gray-600">
            You do not have permission to access any system administration
            features.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-w-md">
          {filteredCards.map((card) => (
            <a key={card.title} href={card.href} className="block">
              <div className="bg-gray-100 border-l-4 my-4 border-accent pl-4 py-3 hover:scale-[1.02] transition-transform rounded-md">
                <h2 className="text-lg font-medium text-accent">
                  {card.title}
                </h2>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
