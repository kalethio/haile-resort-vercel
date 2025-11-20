// app/booking/confirmation/BookingConfirmationContent.tsx
"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams?.get("bookingId") ?? "";
  const guestName = searchParams?.get("guestName") ?? "";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✅</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you {guestName || "for your booking"}! Your reservation is
            confirmed.
          </p>

          {bookingId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600">Booking Reference</p>
              <p className="font-mono font-bold text-lg">{bookingId}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Back to Home
            </Link>
            <Link
              href="/booking"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Book Another Stay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
