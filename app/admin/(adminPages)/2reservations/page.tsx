"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  Filter,
  Mail,
  MoreHorizontal,
  Calendar,
  MapPin,
  User,
  DollarSign,
} from "lucide-react";

interface Booking {
  id: string;
  type: string;
  status: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  totalAmount: number;
  branch: {
    branchName: string;
    slug: string;
  };
  roomBookings: {
    room: {
      roomNumber: string;
      roomType: {
        name: string;
      };
    };
    pricePerNight: number;
    totalNights: number;
  }[];
  createdAt: string;
}

interface Branch {
  id: number;
  branchName: string;
  slug: string;
}

export default function ReservationsPage() {
  const { data: session } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
    fetchBookings();
  }, [selectedBranch, statusFilter]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches-list");
      if (response.ok) {
        const data = await response.json();
        setBranches(data.branches || []);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBranch !== "all") params.append("branch", selectedBranch);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/booking?${params}`);
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
      }
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/booking/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  const sendConfirmationEmail = async (bookingId: string) => {
    try {
      const response = await fetch("/api/admin/send-transactional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, emailType: "confirmation" }),
      });

      const result = await response.json();
      if (result.success) {
        alert("Confirmation email sent!");
      }
    } catch (error) {
      alert("Failed to send email");
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CONFIRMED: "bg-green-100 text-green-800 border-green-200",
      CHECKED_IN: "bg-blue-100 text-blue-800 border-blue-200",
      CHECKED_OUT: "bg-gray-100 text-gray-800 border-gray-200",
      CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      colors[status as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.guestName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.guestEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage guest bookings</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search bookings, guests, emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.slug}>
                  {branch.branchName}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CHECKED_IN">Checked In</option>
              <option value="CHECKED_OUT">Checked Out</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Guest Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="font-semibold text-gray-900">
                      {booking.guestName}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}
                    >
                      {booking.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      <span>{booking.guestEmail}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                        {new Date(booking.checkOut).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      <span>{booking.branch.branchName}</span>
                    </div>

                    <div className="text-gray-600">
                      Room {booking.roomBookings[0]?.room.roomNumber} •{" "}
                      {booking.roomBookings[0]?.room.roomType.name}
                    </div>

                    <div className="text-gray-600">
                      {booking.adults} adults •{" "}
                      {booking.roomBookings[0]?.totalNights || 0} nights
                    </div>

                    <div className="flex items-center gap-2 font-semibold text-gray-900">
                      <DollarSign size={16} />
                      <span>${booking.totalAmount}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <select
                    value={booking.status}
                    onChange={(e) =>
                      updateBookingStatus(booking.id, e.target.value)
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirm</option>
                    <option value="CHECKED_IN">Check In</option>
                    <option value="CHECKED_OUT">Check Out</option>
                    <option value="CANCELLED">Cancel</option>
                  </select>

                  <button
                    onClick={() => sendConfirmationEmail(booking.id)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <Mail size={16} />
                    Send Email
                  </button>
                </div>
              </div>

              {/* Booking ID */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Booking ID: {booking.id}
                </span>
              </div>
            </div>
          ))}

          {filteredBookings.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">No bookings found</p>
              {searchQuery && (
                <p className="text-gray-400 mt-2">
                  Try adjusting your search or filters
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
