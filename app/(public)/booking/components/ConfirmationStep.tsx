// app/booking/components/ConfirmationStep.tsx
"use client";
import React, { useState } from "react";
import { RoomType, BookingParams, BookingSummary } from "../types/booking";

interface ConfirmationStepProps {
  bookingId: string | null;
  selectedRoomData: RoomType | undefined;
  bookingParams: BookingParams;
  bookingSummary: BookingSummary | null;
  guestInfo: any; // Add guest info for the recap
  onReset: () => void;
  onDone: () => void;
}

export default function ConfirmationStep({
  bookingId,
  selectedRoomData,
  bookingParams,
  bookingSummary,
  guestInfo,
  onReset,
  onDone,
}: ConfirmationStepProps) {
  const [showSummary, setShowSummary] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  // Calculate ETB equivalent
  const calculateETB = (usdAmount: number) => {
    return Math.round(usdAmount * 55);
  };

  // Download booking details as PDF
  const downloadBookingDetails = () => {
    const content = `
HAILE HOTELS & RESORTS - BOOKING CONFIRMATION
=============================================

Booking Reference: ${bookingId || "Pending"}
Date: ${new Date().toLocaleDateString()}

GUEST INFORMATION:
------------------
Name: ${guestInfo?.firstName} ${guestInfo?.lastName}
Email: ${guestInfo?.email}
Phone: ${guestInfo?.phone}

BOOKING DETAILS:
----------------
Room: ${selectedRoomData?.name}
Check-in: ${bookingParams.checkIn}
Check-out: ${bookingParams.checkOut}
Guests: ${bookingParams.guests}
Nights: ${bookingSummary?.nights}

PAYMENT SUMMARY:
----------------
Room Rate: USD ${bookingSummary?.roomPrice}/night
Total Room: USD ${(bookingSummary?.roomPrice || 0) * (bookingSummary?.nights || 0)}
Taxes & Fees: USD ${bookingSummary?.taxes}
TOTAL: USD ${bookingSummary?.total}
Equivalent: ETB ${calculateETB(bookingSummary?.total || 0)}

PAYMENT INSTRUCTIONS:
---------------------
Please transfer the total amount to:

Bank: Bank of Abyssinia
Account: Haile Hotels & Resorts
Account #: 1234 5678 9012
Swift: BOFAETAA
Branch: Bole Branch

Use booking reference in transfer description.
Send confirmation to: payments@haileresorts.com

Contact: +251 11 123 4567
=============================================
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `booking-${bookingId || "confirmation"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Simulate hybrid email approach
  const handleSendEmailCopy = async () => {
    try {
      // Send immediate automated acknowledgment
      const response = await fetch("/api/bookings/send-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          guestEmail: guestInfo?.email,
          guestName: `${guestInfo?.firstName} ${guestInfo?.lastName}`,
          type: "acknowledgment", // Immediate auto-email
        }),
      });

      if (response.ok) {
        setEmailSent(true);

        // Also notify admin for manual follow-up
        await fetch("/api/admin/booking-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId,
            guestName: `${guestInfo?.firstName} ${guestInfo?.lastName}`,
            amount: bookingSummary?.total,
            action: "review_and_confirm", // Admin manual step
          }),
        });
      }
    } catch (error) {
      console.error("Email sending failed:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-3xl text-primary">✓</span>
          </div>
          <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-4">
            Booking Received Successfully
          </h2>
          <p className="text-gray-600 mb-6 text-lg font-light leading-relaxed">
            Your booking{bookingId ? ` (Reference: ${bookingId})` : ""} has been
            recorded. Please complete your bank transfer to secure your
            reservation.
          </p>

          {/* Email Status */}
          {emailSent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-md mx-auto mb-6">
              <div className="flex items-center gap-3 justify-center">
                <span className="text-green-600">✓</span>
                <span className="text-green-800 font-medium">
                  Email confirmation sent!
                </span>
              </div>
            </div>
          ) : (
            <button
              onClick={handleSendEmailCopy}
              className="px-6 py-3 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 font-medium transition-all duration-300 mb-6 inline-flex items-center gap-2"
            >
              <span>📧</span>
              Send Email Confirmation
            </button>
          )}
        </div>

        {/* Expandable Booking Summary */}
        <div className="border border-gray-200 rounded-xl mb-8 overflow-hidden">
          <button
            onClick={() => setShowSummary(!showSummary)}
            className="w-full p-6 bg-gray-50 hover:bg-gray-100 transition-all duration-300 flex items-center justify-between text-left"
          >
            <div>
              <h3 className="font-medium text-gray-900 text-lg">
                Booking Summary
              </h3>
              <p className="text-gray-600 text-sm font-light">
                Click to view complete booking details
              </p>
            </div>
            <span
              className={`transform transition-transform duration-300 ${showSummary ? "rotate-180" : ""}`}
            >
              ▼
            </span>
          </button>

          {showSummary && (
            <div className="p-6 bg-white border-t border-gray-200 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Guest Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    Guest Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">Name:</span>
                      <span className="font-medium text-gray-900">
                        {guestInfo?.firstName} {guestInfo?.lastName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">Email:</span>
                      <span className="font-medium text-gray-900">
                        {guestInfo?.email}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">Phone:</span>
                      <span className="font-medium text-gray-900">
                        {guestInfo?.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">
                    Stay Details
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">Room:</span>
                      <span className="font-medium text-gray-900">
                        {selectedRoomData?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">
                        Check-in:
                      </span>
                      <span className="font-medium text-gray-900">
                        {bookingParams.checkIn}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">
                        Check-out:
                      </span>
                      <span className="font-medium text-gray-900">
                        {bookingParams.checkOut}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">Guests:</span>
                      <span className="font-medium text-gray-900">
                        {bookingParams.guests}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-light">Nights:</span>
                      <span className="font-medium text-gray-900">
                        {bookingSummary?.nights}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-4">
                  Payment Summary
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-light">Room Rate:</span>
                    <span className="font-medium text-gray-900">
                      USD {bookingSummary?.roomPrice}/night
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-light">
                      Total Room Charge:
                    </span>
                    <span className="font-medium text-gray-900">
                      USD{" "}
                      {(bookingSummary?.roomPrice || 0) *
                        (bookingSummary?.nights || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-light">
                      Taxes & Fees:
                    </span>
                    <span className="font-medium text-gray-900">
                      USD {bookingSummary?.taxes}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-medium pt-3 border-t border-gray-200">
                    <span className="text-gray-900">Total Amount:</span>
                    <span className="text-primary">
                      USD {bookingSummary?.total}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-light">
                      Equivalent in ETB:
                    </span>
                    <span className="font-medium text-gray-900">
                      ETB{" "}
                      {calculateETB(
                        bookingSummary?.total || 0
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bank Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span>🏦</span>
            Bank Transfer Instructions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 font-light">Bank:</span>
                <span className="font-medium text-gray-900">
                  Bank of Abyssinia
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-light">Account Name:</span>
                <span className="font-medium text-gray-900">
                  Haile Hotels & Resorts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-light">
                  Account Number:
                </span>
                <span className="font-medium text-gray-900">
                  1234 5678 9012
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 font-light">Swift Code:</span>
                <span className="font-medium text-gray-900">BOFAETAA</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-light">Branch:</span>
                <span className="font-medium text-gray-900">Bole Branch</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 font-light">Reference:</span>
                <span className="font-medium text-primary">{bookingId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={downloadBookingDetails}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-sm transform hover:scale-105 flex items-center gap-2"
          >
            <span>📥</span>
            Download Details
          </button>
          <button
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-sm transform hover:scale-105"
          >
            Create Another Booking
          </button>
          <button
            onClick={onDone}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            Finish
          </button>
        </div>

        {/* Support Contact */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 font-light">
            Need help? Contact our booking team:{" "}
            <span className="text-primary font-medium">+251 11 123 4567</span>
          </p>
        </div>
      </div>
    </div>
  );
}
