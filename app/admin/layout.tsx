"use client";
import React from "react";
import Sidebar from "./components/sidebar";
import NotificationBell from "./components/notification";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* 🧭 Left Sidebar (Fixed Navigation) */}
      <aside className="w-64 bg-white border-r shadow-sm fixed top-0 left-0 h-screen z-20">
        <Sidebar
          permissions={{
            "reservations.view": true,
            "guests.view": true,
            "staff.view": true,
            "cms.access": true,
            "marketing.email": true,
            "finance.access": true,
            "finance.billing": true,
            "finance.services": true,
            "reports.view": true,
            "settings.access": true,
            "user.manage": true,
          }}
        />
      </aside>

      {/* 🧠 Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* 🔝 Top Navigation Bar */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
          <div className="font-semibold text-lg">🏨 Admin Dashboard</div>
          <div className="flex items-center space-x-4">
            <NotificationBell />
          </div>
        </header>

        {/* 📝 Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
