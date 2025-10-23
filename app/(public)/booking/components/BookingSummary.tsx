// app/booking/components/BookingSummary.tsx
"use client";
import React from "react";
import { RoomType, BookingParams, BookingSummary } from "../types/booking";

interface BookingSummaryProps {
  bookingParams: BookingParams;
  bookingSummary: BookingSummary | null;
  selectedRoom: number | null;
  roomTypes: RoomType[];
  onProceed: () => void;
}

export default function BookingSummary({
  bookingParams,
  bookingSummary,
  selectedRoom,
  roomTypes,
  onProceed,
}: BookingSummaryProps) {
  const selectedRoomData = roomTypes.find((room) => room.id === selectedRoom);

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-normal text-gray-900 mb-6 tracking-tight">
            Booking Summary
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-light">Check-in</span>
              <span className="font-medium text-gray-900">
                {bookingParams.checkIn}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-light">Check-out</span>
              <span className="font-medium text-gray-900">
                {bookingParams.checkOut}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 font-light">Guests</span>
              <span className="font-medium text-gray-900">
                {bookingParams.guests}
              </span>
            </div>

            {bookingSummary && (
              <>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 font-light">
                      {bookingSummary.nights} night
                      {bookingSummary.nights > 1 ? "s" : ""}
                    </span>
                    <span className="font-medium text-gray-900">
                      $
                      {(
                        bookingSummary.roomPrice * bookingSummary.nights
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="font-light">Taxes & fees</span>
                    <span>${bookingSummary.taxes.toLocaleString()}</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-medium text-lg">
                    <span className="text-gray-900">Total</span>
                    <span className="text-primary">
                      ${bookingSummary.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-light">
                    Including all taxes and charges
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={onProceed}
            disabled={!selectedRoom}
            className={`w-full mt-6 py-3.5 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
              selectedRoom
                ? "bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue to Guest Details
          </button>

          <div className="mt-6 space-y-3 text-xs text-gray-500 font-light">
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">
                🔒
              </span>
              <span>Your payment is secure and encrypted</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">
                🔄
              </span>
              <span>Free cancellation until 24 hours before check-in</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
