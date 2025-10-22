"use client";
import { useState, useEffect } from "react";

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  revenue: number;
  occupancyRate: number;
  todayCheckIns: number;
  todayCheckOuts: number;
}

interface Booking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: string;
  amount: number;
  branch: string;
  roomType: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Mock data - will connect to your actual APIs
      setStats({
        totalBookings: 156,
        pendingBookings: 12,
        revenue: 45200,
        occupancyRate: 78,
        todayCheckIns: 8,
        todayCheckOuts: 5,
      });

      setRecentBookings([
        {
          id: "1",
          guestName: "Kalkidan Belachew",
          checkIn: "2025-10-20",
          checkOut: "2025-10-22",
          status: "PENDING",
          amount: 450,
          branch: "Hawassa Resort",
          roomType: "Deluxe King Room",
        },
        {
          id: "2",
          guestName: "John Smith",
          checkIn: "2025-10-21",
          checkOut: "2025-10-23",
          status: "CONFIRMED",
          amount: 320,
          branch: "Addis Ababa Resort",
          roomType: "Executive Suite",
        },
      ]);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  if (!stats)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Welcome back! 👋</h1>
        <p className="text-blue-100">
          Here's what's happening with your resorts today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon="📊"
          color="blue"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingBookings}
          icon="⏳"
          color="yellow"
        />
        <StatCard
          title="Revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          icon="💰"
          color="green"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          icon="🏨"
          color="purple"
        />
      </div>

      {/* Today's Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Activity
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Check-ins</span>
              <span className="font-semibold text-green-600">
                {stats.todayCheckIns}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Check-outs</span>
              <span className="font-semibold text-blue-600">
                {stats.todayCheckOuts}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              📝 Create New Booking
            </button>
            <button className="w-full text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              👥 Manage Guests
            </button>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Bookings
          </h2>
        </div>
        <div className="p-6">
          <RecentBookingsTable bookings={recentBookings} />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    yellow: "bg-yellow-50 border-yellow-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`p-6 rounded-lg border-2 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );
}

// ✅ FIXED: RecentBookingsTable component is now properly defined
function RecentBookingsTable({ bookings }: { bookings: Booking[] }) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No recent bookings</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 font-semibold text-gray-900">
              Guest
            </th>
            <th className="text-left py-3 font-semibold text-gray-900">
              Dates
            </th>
            <th className="text-left py-3 font-semibold text-gray-900">Room</th>
            <th className="text-left py-3 font-semibold text-gray-900">
              Amount
            </th>
            <th className="text-left py-3 font-semibold text-gray-900">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-4">
                <div className="font-medium text-gray-900">
                  {booking.guestName}
                </div>
              </td>
              <td className="py-4">
                <div className="text-sm text-gray-600">
                  {booking.checkIn} to {booking.checkOut}
                </div>
              </td>
              <td className="py-4">
                <div className="text-sm text-gray-900">{booking.roomType}</div>
                <div className="text-xs text-gray-600">{booking.branch}</div>
              </td>
              <td className="py-4">
                <div className="font-semibold text-gray-900">
                  ${booking.amount}
                </div>
              </td>
              <td className="py-4">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === "PENDING"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
