// app/booking/components/PaymentSection.tsx
"use client";
import React from "react";
import {
  RoomType,
  BookingParams,
  BookingSummary,
  PaymentMethod,
} from "../types/booking";

interface PaymentSectionProps {
  selectedRoomData: RoomType | undefined;
  bookingParams: BookingParams;
  bookingSummary: BookingSummary | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onPaymentComplete: () => void;
}

export default function PaymentSection({
  selectedRoomData,
  bookingParams,
  bookingSummary,
  paymentMethod,
  onPaymentMethodChange,
  onBack,
  onPaymentComplete,
}: PaymentSectionProps) {
  // Calculate ETB equivalent
  const calculateETB = (usdAmount: number) => {
    return Math.round(usdAmount * 55); // Fixed exchange rate - TODO: Make dynamic
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-3">
          Secure Your Booking
        </h2>
        <p className="text-gray-600 font-light text-lg">
          Choose your preferred payment method
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
        {/* Booking Summary */}
        <div className="bg-primary/5 rounded-xl p-6 mb-8 border border-primary/10">
          <h4 className="font-normal text-gray-900 mb-4 text-lg">
            Your Booking Summary
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 font-light">Room:</span>
              <span className="font-medium text-gray-900">
                {selectedRoomData?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 font-light">Duration:</span>
              <span className="text-gray-900">
                {bookingSummary?.nights} nights • {bookingParams.checkIn} to{" "}
                {bookingParams.checkOut}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between font-medium text-lg">
                <span className="text-gray-900">Total Amount:</span>
                <span className="text-primary">
                  USD {bookingSummary?.total.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span className="font-light">Equivalent in ETB:</span>
                <span>
                  ETB{" "}
                  {bookingSummary
                    ? calculateETB(bookingSummary.total).toLocaleString()
                    : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="mb-8">
          <h4 className="font-normal text-gray-900 mb-6 text-lg">
            Available Payment Options
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Chapa Option */}
            <button
              onClick={() => onPaymentMethodChange("chapa")}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-300 group transform hover:scale-105 ${
                paymentMethod === "chapa"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200 hover:border-primary/30 hover:shadow-md bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    paymentMethod === "chapa"
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-600 group-hover:bg-primary/5"
                  }`}
                >
                  <span className="text-xl">🇪🇹</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">Chapa Payment</div>
                  <div className="text-sm text-gray-600 font-light mt-1">
                    Pay in Ethiopian Birr (ETB)
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-light">
                      Local Favorite
                    </span>
                  </div>
                </div>
                {paymentMethod === "chapa" && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </button>

            {/* Stripe Option */}
            <button
              onClick={() => onPaymentMethodChange("stripe")}
              className={`p-6 border-2 rounded-xl text-left transition-all duration-300 group transform hover:scale-105 ${
                paymentMethod === "stripe"
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-gray-200 hover:border-primary/30 hover:shadow-md bg-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
                    paymentMethod === "stripe"
                      ? "bg-primary/10 text-primary"
                      : "bg-gray-100 text-gray-600 group-hover:bg-primary/5"
                  }`}
                >
                  <span className="text-xl">🌍</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    International Payment
                  </div>
                  <div className="text-sm text-gray-600 font-light mt-1">
                    Pay in USD with credit card
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg font-light">
                      Global Access
                    </span>
                  </div>
                </div>
                {paymentMethod === "stripe" && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Payment Action */}
        <div className="border-t border-gray-200 pt-8">
          {paymentMethod ? (
            <div className="text-center">
              <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl">
                <div className="w-16 h-16 bg-white border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary">🚀</span>
                </div>
                <h4 className="font-normal text-gray-900 mb-3 text-lg">
                  Almost There!
                </h4>
                <p className="text-sm text-gray-700 mb-4 font-light leading-relaxed">
                  We are enhancing our payment system for a seamless experience.
                  Your booking is ready - our team will assist you with the
                  payment process.
                </p>
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2 font-light">
                    Contact our booking specialists:
                  </p>
                  <p className="text-lg font-medium text-primary">
                    +251 11 123 4567
                  </p>
                  <p className="text-sm text-gray-600 font-light">
                    bookings@haileresorts.com
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={onBack}
                  className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-sm transform hover:scale-105"
                >
                  ← Back to Details
                </button>
                <button
                  onClick={onPaymentComplete}
                  className="px-8 py-3.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Confirm Booking & Contact Support →
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-500 flex items-center justify-center gap-3 font-light">
                <span className="text-lg">👆</span>
                <span>Select a payment method to continue</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
