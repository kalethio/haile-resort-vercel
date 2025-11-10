import Link from "next/link";
import { MapPin, Eye } from "lucide-react";
import { Booking } from "./types";

interface Props {
  bookings: Booking[];
}

export default function RecentActivitySection({ bookings }: Props) {
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
    </section>
  );
}
