"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardHeader() {
  const { data: session, status } = useSession();

  const user = session?.user;
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userRole = user?.role || "Staff";
  const userBranch = user?.branch?.name || user?.branch?.branchName || "System";

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (status === "loading") {
    return (
      <section>
        <div className="flex justify-between items-start">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-48 mt-2 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome back, {userName}
          </h1>
          <p className="text-gray-600 mt-1">
            {userRole} • {userBranch} Branch • {currentDate}
          </p>
        </div>
        <Link
          href="/admin/support"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Help & Support
        </Link>
      </div>
    </section>
  );
}
