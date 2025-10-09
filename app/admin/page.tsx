"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  Calendar,
  CreditCard,
  MessageCircle,
  Users,
  CheckCircle,
  BarChart2,
  PlusCircle,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* -------------------------------------------
   Types (frontend models) - easy to reuse/expand
   ------------------------------------------- */
type BookingStatus =
  | "pending"
  | "confirmed"
  | "checked_in"
  | "checked_out"
  | "cancelled"
  | "no_show";

interface KPI {
  id: string;
  title: string;
  value: string | number;
  sparkline: number[];
  icon: LucideIcon;
  premium?: boolean;
}

interface ActivityItem {
  id: string;
  title: string;
  subtitle?: string;
  timeAgo: string;
  category?: string;
}

type NotificationCategory =
  | "Bookings"
  | "Payments"
  | "Reviews"
  | "Guests"
  | "Staff"
  | "System"
  | "Marketing";

interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  body?: string;
  timeAgo: string;
  read: boolean;
  actions?: { label: string; onClick: () => void }[];
}

/* -------------------------------------------
   Props for the dashboard
   permissions prop controls visibility of actions
   hasPremium toggles premium features
   ------------------------------------------- */
export default function AdminDashboard({
  permissions = {},
  hasPremium = false,
}: {
  permissions?: Record<string, boolean>;
  hasPremium?: boolean;
}) {
  /* -------------------------
     Mock Data (replace later)
     ------------------------- */
  const [kpis] = useState<KPI[]>([
    {
      id: "k1",
      title: "Total Bookings",
      value: 128,
      sparkline: [5, 10, 8, 12, 14, 20],
      icon: Calendar,
    },
    {
      id: "k2",
      title: "Revenue",
      value: "$12,400",
      sparkline: [2000, 3000, 2500, 4000, 3800, 4200],
      icon: CreditCard,
      premium: true,
    },
    {
      id: "k3",
      title: "Active Guests",
      value: 76,
      sparkline: [50, 60, 65, 70, 75, 76],
      icon: Users,
    },
    {
      id: "k4",
      title: "Tasks Completed",
      value: 320,
      sparkline: [50, 60, 70, 80, 90, 100],
      icon: CheckCircle,
      premium: true,
    },
  ]);

  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: "a1", title: "John created booking #4512", timeAgo: "2m ago" },
    { id: "a2", title: "Jane approved review", timeAgo: "10m ago" },
    { id: "a3", title: "Admin processed payment $200", timeAgo: "15m ago" },
  ]);

  /* Notifications grouped and with inline actions for reviews */
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n-b1",
      category: "Bookings",
      title: "New booking created (#4512)",
      timeAgo: "2m ago",
      read: false,
    },
    {
      id: "n-p1",
      category: "Payments",
      title: "Payment received ($200) - Guest A",
      timeAgo: "15m ago",
      read: false,
    },
    {
      id: "n-r1",
      category: "Reviews",
      title: "New review pending approval (John D.)",
      timeAgo: "30m ago",
      read: false,
      actions: [
        {
          label: "Approve",
          onClick: () => handleReviewAction("n-r1", "approve"),
        },
        {
          label: "Reject",
          onClick: () => handleReviewAction("n-r1", "reject"),
        },
      ],
    },
  ]);

  /* Quick actions - permission-aware */
  const quickActions = [
    {
      id: "q1",
      label: "Add Booking",
      icon: PlusCircle,
      permission: "bookings.create",
    },
    {
      id: "q2",
      label: "Send Invoice",
      icon: CreditCard,
      permission: "payments.create",
    },
    { id: "q3", label: "Add Guest", icon: Users, permission: "guests.create" },
  ];

  /* -------------------------
     Notification dropdown behavior
     - opens/closes on bell click
     - closes when clicking outside
     ------------------------- */
  const bellRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  /* -------------------------
     Helpers for actions (local-only now)
     ------------------------- */
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }
  function clearAll() {
    setNotifications([]);
  }

  /* Inline review action handler (approve/reject) */
  function handleReviewAction(id: string, action: "approve" | "reject") {
    // local-state update
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true, title: `${n.title} — ${action}` } : n
      )
    );

    // Example: later, call your API:
    // await fetch('/api/reviews/' + id + '/' + action, { method: 'POST' })
  }

  /* -------------------------
     Utility: group notifications by category
     ------------------------- */
  const grouped = notifications.reduce<Record<string, NotificationItem[]>>(
    (acc, n) => {
      if (!acc[n.category]) acc[n.category] = [];
      acc[n.category].push(n);
      return acc;
    },
    {}
  );

  /* -------------------------
     Sparkline SVG helper: minimal and dependency-free
     uses array of numbers -> small inline SVG
     ------------------------- */
  const Sparkline = ({ data }: { data: number[] }) => {
    // normalize
    const w = 80;
    const h = 28;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = Math.max(1, max - min);
    const points = data
      .map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        return `${x},${y}`;
      })
      .join(" ");
    return (
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        className="inline-block"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          points={points}
          className="text-gray-400"
        />
      </svg>
    );
  };

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navbar */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="font-bold text-lg" style={{ color: "rgb(50,57,6)" }}>
            Hotel Admin
          </div>
          <div className="text-sm text-gray-500">Property: Sunset Resort</div>
        </div>

        {/* Floating notification bell: fixed to top-right (always visible) */}
        <div className="fixed top-4 right-4 z-50" ref={bellRef}>
          <div className="relative">
            <button
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-full hover:bg-gray-100"
              aria-label="Open notifications"
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-96 bg-white border rounded-xl shadow-lg overflow-hidden">
                {/* header */}
                <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                  <div className="flex gap-3 items-center">
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAll}
                        className="text-xs text-red-600 hover:underline flex items-center gap-1"
                        title="Clear all notifications"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {Object.keys(grouped).length === 0 ? (
                    <div className="p-6 text-sm text-gray-500 text-center">
                      No notifications
                    </div>
                  ) : (
                    Object.entries(grouped).map(([category, items]) => (
                      <section
                        key={category}
                        className="border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold">
                          {/* category icon */}
                          {category === "Bookings" && (
                            <Calendar className="w-5 h-5 text-blue-500" />
                          )}
                          {category === "Payments" && (
                            <CreditCard className="w-5 h-5 text-green-500" />
                          )}
                          {category === "Reviews" && (
                            <MessageCircle className="w-5 h-5 text-purple-500" />
                          )}
                          {category === "Guests" && (
                            <Users className="w-5 h-5 text-yellow-500" />
                          )}
                          {category === "System" && (
                            <CheckCircle className="w-5 h-5 text-red-500" />
                          )}
                          <span>{category}</span>
                        </div>

                        {items.map((n) => (
                          <div
                            key={n.id}
                            className={`flex flex-col gap-1 px-6 py-3 border-b last:border-b-0 ${
                              n.read ? "bg-white" : "bg-blue-50"
                            } hover:bg-gray-50`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="text-sm text-gray-800">
                                  {n.title}
                                </div>
                                {n.body && (
                                  <div className="text-xs text-gray-500">
                                    {n.body}
                                  </div>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {n.timeAgo}
                              </div>
                            </div>

                            {/* inline actions (e.g., approve/reject) */}
                            {n.actions && (
                              <div className="flex gap-2 mt-2">
                                {n.actions.map((a, i) => (
                                  <button
                                    key={i}
                                    className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    onClick={(e) => {
                                      e.stopPropagation(); // avoid closing etc.
                                      a.onClick();
                                    }}
                                  >
                                    {a.label}
                                  </button>
                                ))}
                                {/* quick link to the review page */}
                                <a
                                  href="#/admin/reviews"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-xs px-2 py-1 border rounded text-gray-700 hover:bg-gray-100"
                                >
                                  View
                                </a>
                              </div>
                            )}
                          </div>
                        ))}
                      </section>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="p-6 space-y-6">
        {/* KPI Cards */}
        <section aria-labelledby="kpis">
          <h2 id="kpis" className="text-lg font-semibold mb-2">
            KPI Overview
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((k) => {
              const Icon = k.icon;
              const locked = k.premium && !hasPremium;
              return (
                <div
                  key={k.id}
                  className={`p-4 rounded-lg shadow transition cursor-default ${locked ? "opacity-70" : "bg-white hover:shadow-lg"}`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className="w-6 h-6 text-gray-600" />
                    <div className="text-xl font-bold">{k.value}</div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                    <span>{k.title}</span>
                    <span className="ml-auto">
                      {k.premium && (
                        <span className="text-xs text-indigo-600">Premium</span>
                      )}
                    </span>
                  </div>

                  <div className="mt-3">
                    {/* inline mini sparkline */}
                    <SparklineSVG
                      data={k.sparkline}
                      premium={k.premium && hasPremium}
                    />
                  </div>

                  {locked && (
                    <div className="mt-3 text-xs text-gray-500">
                      Premium feature —{" "}
                      <a className="text-indigo-600 underline" href="#/pricing">
                        Upgrade
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Recent Activity + Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Recent Activity</h3>
              <div className="text-xs text-gray-500">Live feed</div>
            </div>
            <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
              {activities.map((a) => (
                <li
                  key={a.id}
                  className="py-3 flex justify-between items-start"
                >
                  <div>
                    <div className="text-sm">
                      <span className="font-medium">{a.title}</span>
                    </div>
                    {a.subtitle && (
                      <div className="text-xs text-gray-400">{a.subtitle}</div>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{a.timeAgo}</div>
                </li>
              ))}
            </ul>
          </section>

          <aside className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2">Quick Actions</h3>
            <div className="flex flex-col gap-2">
              {quickActions.map((q) => {
                if (!permissions[q.permission]) return null;
                const Icon = q.icon;
                return (
                  <button
                    key={q.id}
                    className="flex items-center gap-2 px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                    onClick={() => {
                      // TODO: open modal / route to page
                      alert(`Action: ${q.label}`);
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{q.label}</span>
                  </button>
                );
              })}
              {/* info when no actions */}
              {quickActions.every((a) => !permissions[a.permission]) && (
                <div className="text-sm text-gray-500">
                  You have no quick actions available.
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Analytics snapshot */}
        <section className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Analytics Snapshot</h3>
            <div className="text-xs text-gray-400">
              Interactive charts (placeholder)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm font-medium mb-2">Revenue Trend</div>
              <BarChart2 className="w-full h-44 text-blue-500" />
              <div className="text-xs text-gray-400 mt-2">
                Use realtime feed for live updates
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded">
              <div className="text-sm font-medium mb-2">Bookings by Status</div>
              <BarChart2 className="w-full h-44 text-green-500" />
              <div className="text-xs text-gray-400 mt-2">
                Replace with Recharts/ApexCharts
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* -------------------------------------------
   Small inline sparkline implementation
   - dependency-free, tiny svg
   ------------------------------------------- */
function SparklineSVG({
  data,
  premium = false,
}: {
  data: number[];
  premium?: boolean;
}) {
  const w = 100;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const path = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  const stroke = premium ? "rgb(139 92 246)" : "rgb(59 130 246)"; // purple for premium
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      <path
        d={path}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
