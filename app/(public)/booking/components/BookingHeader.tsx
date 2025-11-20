// app/booking/components/BookingHeader.tsx
"use client";
import React from "react";
import { BookingStep, BookingParams } from "../types/booking";

interface BookingHeaderProps {
  step: BookingStep;
  params: BookingParams;
}

export default function BookingHeader({ step, params }: BookingHeaderProps) {
  const steps = [
    { number: 1, label: "Select Room" },
    { number: 2, label: "Guest Details" },
    { number: 3, label: "Payment" },
    { number: 4, label: "Confirmation" },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight">
              Complete Your Booking
            </h1>
            <p className="text-gray-600 mt-2 font-light">
              {params.checkIn} to {params.checkOut} • {params.guests}{" "}
              {params.guests === 1 ? "Guest" : "Guests"}
            </p>
          </div>

          {/* Progress Steps */}
          <div className="w-full lg:w-auto">
            <div className="flex justify-between lg:justify-center lg:space-x-8">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                        step === stepItem.number || step > stepItem.number
                          ? "bg-primary border-primary text-white shadow-sm"
                          : "border-gray-300 text-gray-500"
                      }`}
                    >
                      {step > stepItem.number ? "✓" : stepItem.number}
                    </div>
                    <span
                      className={`hidden sm:block ml-2 font-medium text-sm ${
                        step === stepItem.number
                          ? "text-primary"
                          : "text-gray-500"
                      }`}
                    >
                      {stepItem.label}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block w-8 h-px bg-gray-300 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
