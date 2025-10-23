// app/booking/components/ConfirmationStep.tsx
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <span className="text-3xl text-primary">✓</span>
        </div>
        <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-4">
          Booking Confirmed
        </h2>
        <p className="text-gray-600 mb-6 text-lg font-light leading-relaxed">
          Your booking{bookingId ? ` (ID: ${bookingId})` : ""} has been
          recorded. Our booking team will contact you to finalize payment.
        </p>
        <p className="text-primary font-medium mb-8 animate-pulse">
          ✓ Confirmation will be sent to your email
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onReset}
            className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-sm transform hover:scale-105"
          >
            Create Another Booking
          </button>
          <button
            onClick={onDone}
            className="px-8 py-3.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
