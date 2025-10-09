"use client";

import { useState, useEffect, useRef } from "react";
import {
  Bell,
  CheckCircle,
  Trash2,
  CreditCard,
  Calendar,
  Users,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";

// ----------------------------
// Types
// ----------------------------
type Notification = {
  id: string;
  category:
    | "Bookings"
    | "Payments"
    | "Reviews"
    | "Guests"
    | "Staff"
    | "System"
    | "Marketing";
  message: string;
  time: string;
  read: boolean;
  actions?: { label: string; callback: () => void }[];
};

// ----------------------------
// NotificationBell Component
// ----------------------------
export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "b1",
      category: "Bookings",
      message: "New booking created (Booking #4512)",
      time: "2m ago",
      read: false,
    },
    {
      id: "b2",
      category: "Bookings",
      message: "Booking canceled (#4513)",
      time: "10m ago",
      read: false,
    },
    {
      id: "p1",
      category: "Payments",
      message: "Payment received ($200, Guest A)",
      time: "15m ago",
      read: false,
    },
    {
      id: "r1",
      category: "Reviews",
      message: "New review pending approval (John D.)",
      time: "30m ago",
      read: false,
      actions: [
        { label: "Approve", callback: () => alert("Approved") },
        { label: "Reject", callback: () => alert("Rejected") },
      ],
    },
    {
      id: "s1",
      category: "System",
      message: "Low inventory: Projectors (2 left)",
      time: "1h ago",
      read: true,
    },
  ]);

  const bellRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Group notifications by category
  const grouped = notifications.reduce(
    (acc: any, n) => {
      if (!acc[n.category]) acc[n.category] = [];
      acc[n.category].push(n);
      return acc;
    },
    {} as Record<string, Notification[]>
  );

  // Get icon per category
  const getIcon = (category: Notification["category"]) => {
    switch (category) {
      case "Bookings":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "Payments":
        return <CreditCard className="w-5 h-5 text-green-500" />;
      case "Reviews":
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      case "Guests":
        return <Users className="w-5 h-5 text-yellow-500" />;
      case "Staff":
        return <Users className="w-5 h-5 text-pink-500" />;
      case "System":
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case "Marketing":
        return <CheckCircle className="w-5 h-5 text-teal-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50" ref={bellRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition"
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
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b bg-gray-50">
            <h3 className="font-semibold text-gray-700">Notifications</h3>
            <div className="flex gap-2">
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
                  className="text-xs text-red-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* Groups */}
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="border-b last:border-b-0">
                {/* Category Header */}
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold">
                  {getIcon(category as Notification["category"])}
                  <span>{category}</span>
                </div>

                {/* Notifications List */}
                {items.map((n: Notification) => (
                  <div
                    key={n.id}
                    className={`flex flex-col gap-1 px-6 py-2 border-b last:border-b-0 cursor-pointer ${
                      !n.read ? "bg-blue-50" : "bg-white"
                    } hover:bg-gray-50`}
                  >
                    <span className="text-sm text-gray-800">{n.message}</span>
                    <span className="text-xs text-gray-400">{n.time}</span>

                    {/* Actions */}
                    {n.actions && (
                      <div className="flex gap-2 mt-1">
                        {n.actions.map((a, i) => (
                          <button
                            key={i}
                            onClick={a.callback}
                            className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
