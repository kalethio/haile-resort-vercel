"use client";
import { useState, useEffect } from "react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    branch: "",
    status: "",
    search: "",
  });

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/admin/bookings?${new URLSearchParams(filters)}`);
      // const data = await response.json();

      // Mock data
      setBookings([
        {
          id: "1",
          guestName: "Kalkidan Belachew",
          guestEmail: "kal.ethio3@gmail.com",
          guestPhone: "911226731",
          checkIn: "2025-10-20",
          checkOut: "2025-10-22",
          status: "PENDING",
          totalAmount: 450,
          branch: { branchName: "Hawassa Resort", slug: "hawassa" },
          roomBookings: [{ room: { roomType: { name: "Deluxe King Room" } } }],
          createdAt: "2024-01-15T10:30:00Z",
        },
      ]);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      // TODO: Implement status update
      console.log(`Updating booking ${bookingId} to ${status}`);
      fetchBookings(); // Refresh data
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Bookings Management
        </h1>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={filters.branch}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, branch: e.target.value }))
            }
          >
            <option value="">All Branches</option>
            <option value="hawassa">Hawassa</option>
            <option value="addis-ababa">Addis Ababa</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={filters.status}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, status: e.target.value }))
            }
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CHECKED_IN">Checked In</option>
            <option value="CHECKED_OUT">Checked Out</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : (
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
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Room
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left py-3 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-gray-100">
                      <td className="py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {booking.guestName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.guestEmail}
                          </div>
                          <div className="text-sm text-gray-600">
                            {booking.guestPhone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm">
                          <div>Check-in: {booking.checkIn}</div>
                          <div>Check-out: {booking.checkOut}</div>
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-900">
                          {booking.roomBookings[0]?.room?.roomType?.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {booking.branch.branchName}
                        </div>
                      </td>
                      <td className="py-4">
                        <div className="font-semibold text-gray-900">
                          ${booking.totalAmount}
                        </div>
                      </td>
                      <td className="py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateBookingStatus(booking.id, "CONFIRMED")
                            }
                            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                          >
                            Confirm
                          </button>
                          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CHECKED_IN: "bg-blue-100 text-blue-800",
    CHECKED_OUT: "bg-gray-100 text-gray-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100"}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
