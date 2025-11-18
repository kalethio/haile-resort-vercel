"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Eye, RefreshCw } from "lucide-react";
import { Booking } from "./types";

interface Props {
  bookings?: Booking[];
}

export default function RecentActivitySection({
  bookings: initialBookings,
}: Props) {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings || []);
  const [loading, setLoading] = useState(!initialBookings);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch recent bookings only if no initial data provided
  const fetchRecentBookings = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else if (!initialBookings) {
        setLoading(true);
      }

      const params = new URLSearchParams({
        limit: "5",
        sort: "createdAt:desc",
      });

      const res = await fetch(`/api/admin/booking?${params}`);

      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error("Failed to fetch recent bookings:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchRecentBookings(true);
  };

  useEffect(() => {
    if (!initialBookings) {
      fetchRecentBookings();
    }
  }, [initialBookings]);

  if (loading) {
    return (
      <section>
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
              <Link
                href="/admin/2reservations"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                View all bookings
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-gray-200 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                      <div className="h-3 bg-gray-200 rounded w-20 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                    <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                  </div>
                  <div className="w-8 h-8 bg-gray-200 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900">Recent Bookings</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh bookings"
              >
                <RefreshCw
                  size={16}
                  className={`text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
              <Link
                href="/admin/2reservations"
                className="text-gray-600 hover:text-gray-900 text-sm"
              >
                View all bookings
              </Link>
            </div>
          </div>
        </div>
        <div className="p-6">
          {bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No recent bookings found
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        booking.status === "confirmed"
                          ? "bg-green-500"
                          : booking.status === "pending"
                            ? "bg-orange-500"
                            : booking.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-gray-500"
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
          )}
        </div>
      </div>
    </section>
  );
}
