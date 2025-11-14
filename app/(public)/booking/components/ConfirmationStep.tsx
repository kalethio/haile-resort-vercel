// app/booking/components/ConfirmationStep.tsx - SIMPLIFIED
"use client";
import React from "react";

interface ConfirmationStepProps {
  bookingId: string | null;
  onReset: () => void;
  onDone: () => void;
}

export default function ConfirmationStep({
  bookingId,
  onReset,
  onDone,
}: ConfirmationStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {/* Success Header */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-green-600">✓</span>
          </div>
          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Booking Confirmed!
          </h2>
          <p className="text-gray-600 mb-2">
            Thank you for choosing Haile Resorts
          </p>
          {bookingId && (
            <p className="text-sm text-gray-500">
              Reference:{" "}
              <span className="font-mono text-primary">{bookingId}</span>
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">
            What Happens Next?
          </h3>
          <div className="space-y-3 text-sm text-gray-700 text-left">
            <div className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5">①</span>
              <span>
                <strong>Payment Details Sent</strong> - Check your email for
                bank transfer instructions
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5">②</span>
              <span>
                <strong>Complete Payment</strong> - Transfer the amount using
                provided bank details
              </span>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-blue-600 mt-0.5">③</span>
              <span>
                <strong>Booking Secured</strong> - Your reservation will be
                confirmed within 2-4 hours after payment
              </span>
            </div>
          </div>
        </div>

        {/* Support Reminder */}
        <div className="border border-gray-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-gray-600">
            <strong>Need help with payment?</strong> Our team is ready to
            assist:
          </p>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <a
              href="tel:+251111234567"
              className="text-primary hover:text-primary/80"
            >
              📞 +251 11 123 4567
            </a>
            <a
              href="mailto:bookings@haileresorts.com"
              className="text-primary hover:text-primary/80"
            >
              ✉️ bookings@haileresorts.com
            </a>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-colors"
          >
            Book Another Stay
          </button>
          <button
            onClick={onDone}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-colors shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
