"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Home,
  Star,
  Plus,
  MapPin,
  Eye,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
  guestSatisfaction: number;
}

interface Booking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "pending";
  amount: number;
  branch: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalBookings: 847,
        revenue: 125400,
        occupancyRate: 82,
        guestSatisfaction: 4.7,
      });

      setRecentBookings([
        {
          id: "1",
          guestName: "Kalkidan Belachew",
          checkIn: "2024-01-20",
          checkOut: "2024-01-22",
          status: "confirmed",
          amount: 450,
          branch: "Hawassa",
        },
        {
          id: "2",
          guestName: "John Smith",
          checkIn: "2024-01-21",
          checkOut: "2024-01-23",
          status: "confirmed",
          amount: 320,
          branch: "Addis Ababa",
        },
        {
          id: "3",
          guestName: "Meron Tekle",
          checkIn: "2024-01-19",
          checkOut: "2024-01-25",
          status: "pending",
          amount: 890,
          branch: "Bahir Dar",
        },
      ]);
    }, 500);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Hotel performance overview</p>
        </div>
        <Link
          href="/admin/reservations/new"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          New Booking
        </Link>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          change="+12.5%"
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          change="+5.2%"
          icon={Home}
          color="blue"
        />
        <MetricCard
          title="Bookings"
          value={stats.totalBookings}
          change="+8%"
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Guest Rating"
          value={stats.guestSatisfaction}
          change="+0.3"
          icon={Star}
          color="orange"
        />
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/admin/reservations"
                className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Calendar size={18} className="text-blue-600" />
                <span>Manage Bookings</span>
              </Link>
              <Link
                href="/admin/guests"
                className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Users size={18} className="text-green-600" />
                <span>Guest Management</span>
              </Link>
              <Link
                href="/admin/housekeeping"
                className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <Home size={18} className="text-orange-600" />
                <span>Housekeeping</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
                <Link
                  href="/admin/reservations"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          booking.status === "confirmed"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {booking.guestName}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin size={12} />
                          {booking.branch}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${booking.amount}
                      </div>
                      <div className="text-sm text-gray-600">
                        {booking.checkIn} - {booking.checkOut}
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye size={16} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, change, icon: Icon, color }: any) {
  const colorClasses = {
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    orange: "text-orange-600",
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]} bg-gray-50`}>
          <Icon size={20} />
        </div>
        <div className="text-sm text-gray-600">{title}</div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="flex items-center gap-1 text-sm text-green-600">
          <TrendingUp size={14} />
          {change}
        </div>
      </div>
    </div>
  );
}
