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
    return Math.round(usdAmount * 55); // Fixed exchange rate
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-3">
          Secure Your Booking
        </h2>
        <p className="text-gray-600 font-light text-lg">
          Complete your reservation
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

        {/* BOA Payment Section */}
        <div className="mb-8">
          <h4 className="font-normal text-gray-900 mb-6 text-lg">
            Bank Transfer Payment
          </h4>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">BOA</span>
              </div>
              <div>
                <div className="font-medium text-gray-900 text-lg">
                  Bank of Abyssinia
                </div>
                <div className="text-sm text-gray-600 font-light">
                  Secure Bank Transfer
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-300">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-light">Bank Name:</span>
                  <span className="font-medium text-gray-900">
                    Bank of Abyssinia
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-light">
                    Account Name:
                  </span>
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
                <div className="flex justify-between">
                  <span className="text-gray-600 font-light">Swift Code:</span>
                  <span className="font-medium text-gray-900">BOFAETAA</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-light">Branch:</span>
                  <span className="font-medium text-gray-900">Bole Branch</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-yellow-600 text-lg">📝</span>
              <div>
                <p className="text-yellow-800 font-medium mb-2">
                  Important Instructions
                </p>
                <ul className="text-yellow-700 text-sm space-y-1 font-light">
                  <li>• Use your booking reference as payment description</li>
                  <li>
                    • Send payment confirmation to finance@haileresorts.com
                  </li>
                  <li>
                    • Booking will be confirmed within 24 hours of payment
                    receipt
                  </li>
                  <li>• Contact us for any assistance: +251 11 123 4567</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Action */}
        <div className="border-t border-gray-200 pt-8">
          <div className="text-center">
            <div className="mb-8 p-6 bg-gradient-to-r from-primary/5 to-accent/5 border border-primary/10 rounded-2xl">
              <div className="w-16 h-16 bg-white border border-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary">⏳</span>
              </div>
              <h4 className="font-normal text-gray-900 mb-3 text-lg">
                Payment Processing
              </h4>
              <p className="text-sm text-gray-700 mb-4 font-light leading-relaxed">
                Our online payment system is currently being upgraded for better
                service. Please use the Bank of Abyssinia transfer details above
                to complete your payment.
              </p>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-2 font-light">
                  Need assistance with payment?
                </p>
                <p className="text-lg font-medium text-primary">
                  +251 11 123 4567
                </p>
                <p className="text-sm text-gray-600 font-light">
                  payments@haileresorts.com
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
                Confirm Booking & Proceed to Bank Transfer →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
