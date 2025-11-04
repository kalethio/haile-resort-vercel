// app/admin/guests/components/GuestDashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface GuestStats {
  total: number;
  vipCount: number;
  arrivingToday: number;
  departingToday: number;
  inHouse: number;
}

interface Guest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  guestType: string;
  totalStays: number;
  lifetimeValue: number;
  lastStayAt: string | null;
  lastBooking: any;
  phone?: string;
}

export default function GuestDashboard() {
  const [stats, setStats] = useState<GuestStats>({
    total: 0,
    vipCount: 0,
    arrivingToday: 0,
    departingToday: 0,
    inHouse: 0,
  });
  const [recentGuests, setRecentGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchGuestData();
  }, []);

  const fetchGuestData = async () => {
    try {
      const [statsRes, guestsRes] = await Promise.all([
        fetch("/api/admin/guests/stats"),
        fetch("/api/admin/guests/recent?limit=10"),
      ]);

      if (!statsRes.ok || !guestsRes.ok) {
        throw new Error("Failed to fetch guest data");
      }

      const statsData = await statsRes.json();
      const guestsData = await guestsRes.json();

      setStats(statsData);
      setRecentGuests(guestsData);
    } catch (error) {
      console.error("Failed to fetch guest data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = recentGuests.filter((guest) =>
    `${guest.firstName} ${guest.lastName} ${guest.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Guest Management</h1>
          <p className="text-gray-600">
            Manage guest profiles and relationships
          </p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 font-medium">
            + Add Guest
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <StatCard
          title="Total Guests"
          value={stats.total}
          icon="👥"
          color="blue"
          description="All registered guests"
        />
        <StatCard
          title="VIP Guests"
          value={stats.vipCount}
          icon="💎"
          color="purple"
          description="VIP status guests"
        />
        <StatCard
          title="In House"
          value={stats.inHouse}
          icon="🏨"
          color="green"
          description="Currently staying"
        />
        <StatCard
          title="Arriving Today"
          value={stats.arrivingToday}
          icon="📅"
          color="orange"
          description="Check-ins today"
        />
        <StatCard
          title="Departing Today"
          value={stats.departingToday}
          icon="🚗"
          color="red"
          description="Check-outs today"
        />
      </div>

      {/* Recent Guests Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-semibold">Recent Guests</h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Export
            </button>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Guest
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Last Stay
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Total Stays
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  LTV
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No guests found
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <GuestRow key={guest.id} guest={guest} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Actions Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {filteredGuests.length} of {recentGuests.length} guests
          </div>
          <Link
            href="/admin/guests/all"
            className="text-primary hover:text-primary/80 font-medium text-sm"
          >
            View All Guests →
          </Link>
        </div>
      </div>

      {/* Guest Segments Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SegmentCard
          title="VIP Guests"
          count={stats.vipCount}
          description="High-value guests requiring special attention"
          color="purple"
          action="Send Welcome Gift"
        />
        <SegmentCard
          title="Frequent Guests"
          count={recentGuests.filter((g) => g.totalStays >= 3).length}
          description="3+ stays in the last year"
          color="blue"
          action="Loyalty Offer"
        />
        <SegmentCard
          title="New Guests"
          count={recentGuests.filter((g) => g.totalStays === 0).length}
          description="First-time visitors"
          color="green"
          action="Welcome Email"
        />
      </div>
    </div>
  );
}

// Supporting Components
function StatCard({ title, value, icon, color, description }) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-xs opacity-75">{description}</p>
    </div>
  );
}

function GuestRow({ guest }: { guest: Guest }) {
  const lastStay = guest.lastStayAt
    ? new Date(guest.lastStayAt).toLocaleDateString()
    : "Never";

  const getGuestTypeBadge = (type: string) => {
    const styles = {
      VIP: "bg-purple-100 text-purple-800",
      CORPORATE: "bg-blue-100 text-blue-800",
      FREQUENT: "bg-green-100 text-green-800",
      REGULAR: "bg-gray-100 text-gray-800",
    };

    return styles[type] || styles.REGULAR;
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center">
          {guest.guestType === "VIP" && (
            <span className="text-yellow-500 mr-2">⭐</span>
          )}
          <div>
            <p className="font-medium text-gray-900">
              {guest.firstName} {guest.lastName}
            </p>
            <p className="text-sm text-gray-500">ID: {guest.id}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-sm">
          <p className="text-gray-900">{guest.email}</p>
          {guest.phone && <p className="text-gray-500">{guest.phone}</p>}
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-900">{lastStay}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{guest.totalStays}</td>
      <td className="px-4 py-3 text-sm text-gray-900">
        ${guest.lifetimeValue.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGuestTypeBadge(guest.guestType)}`}
        >
          {guest.guestType}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex space-x-2">
          <Link
            href={`/admin/guests/${guest.id}`}
            className="text-blue-600 hover:text-blue-900 text-sm font-medium"
          >
            View
          </Link>
          <button className="text-gray-600 hover:text-gray-900 text-sm">
            Message
          </button>
          <button className="text-green-600 hover:text-green-900 text-sm">
            Edit
          </button>
        </div>
      </td>
    </tr>
  );
}

function SegmentCard({ title, count, description, color, action }) {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    green: "bg-green-50 border-green-200",
    purple: "bg-purple-50 border-purple-200",
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color]}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{description}</p>
      <button className="text-sm font-medium text-primary hover:text-primary/80">
        {action} →
      </button>
    </div>
  );
}
