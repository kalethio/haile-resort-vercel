// /app/admin/layout.tsx
"use client";
import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./components/sidebar";
import { PERMISSION_MODULES } from "@/app/admin/lib/permissions";

// Inner component that handles auth protection
function AdminContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      if (!window.location.pathname.includes("/login")) {
        router.push("/login");
      }
      return;
    }

    // Check if user has ANY admin permissions (allow any role with permissions)
    const hasAnyPermission =
      session.user.permissions && session.user.permissions.length > 0;

    if (!hasAnyPermission) {
      router.push("/unauthorized");
      return;
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex-1 ml-64 flex flex-col">
          <main className="flex-1 p-6 overflow-y-auto flex items-center justify-center">
            <div className="text-lg">Loading...</div>
          </main>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Build permissions object from user's actual permissions
  const buildPermissions = () => {
    const permissions: { [key: string]: boolean } = {};

    if (session.user.role === "SUPER_ADMIN") {
      // Super admin has all module permissions
      Object.values(PERMISSION_MODULES).forEach((module) => {
        permissions[module] = true;
      });
      return permissions;
    }

    // Build permissions based on actual module permissions
    session.user.permissions.forEach((permission) => {
      // Use just the module name (ignore actions in simplified system)
      const module = permission.module;
      permissions[module] = true;
    });

    return permissions;
  };

  const userPermissions = buildPermissions();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r shadow-sm fixed top-0 left-0 h-screen z-20">
        <Sidebar user={session.user} permissions={userPermissions} />
      </aside>

      <div className="flex-1 ml-64 flex flex-col">
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminContent>{children}</AdminContent>
    </SessionProvider>
  );
}
