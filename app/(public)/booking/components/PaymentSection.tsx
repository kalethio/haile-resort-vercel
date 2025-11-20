"use client";
import React, { useState, useEffect } from "react";
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

interface PaymentConfig {
  active: boolean;
  provider: string;
  type: "bank" | "gateway";
  config: any;
  instructions: string[];
}

export default function PaymentSection({
  selectedRoomData,
  bookingParams,
  bookingSummary,
  onBack,
  onPaymentComplete,
}: PaymentSectionProps) {
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payment/config")
      .then((res) => res.json())
      .then(setPaymentConfig)
      .finally(() => setLoading(false));
  }, []);

  const handleConfirmAndPay = async () => {
    if (!bookingSummary || !bookingParams.guestInfo?.email) {
      setError("Please complete your contact information first");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      if (paymentConfig?.active && paymentConfig.type === "gateway") {
        console.log("Redirecting to payment gateway:", paymentConfig.provider);
      } else {
        try {
          const response = await fetch("/api/payment/send-instructions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              guestEmail: bookingParams.guestInfo.email,
              guestName: `${bookingParams.guestInfo.firstName} ${bookingParams.guestInfo.lastName}`,
              bookingId: `HR${Date.now()}`,
              checkIn: bookingParams.checkIn,
              checkOut: bookingParams.checkOut,
              roomType: selectedRoomData?.name || "Room",
              totalAmount: bookingSummary.total,
              branchName: selectedRoomData?.branchName || "Haile Resorts",
            }),
          });

          if (response.ok) {
            console.log("Payment email sent successfully");
          } else {
            console.log("Email failed, but proceeding with booking");
          }
        } catch {
          console.log("Email service unavailable, proceeding with booking");
        }

        setEmailSent(true);
        onPaymentComplete();
      }
    } catch (error) {
      console.error("Payment process error:", error);
      setEmailSent(true);
      onPaymentComplete();
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-xl font-light text-gray-900 mb-2">
            Preparing Payment
          </h3>
          <p className="text-gray-500">Setting up secure payment options...</p>
        </div>
      </div>
    );
  }

  const hasGateway = paymentConfig?.active && paymentConfig.type === "gateway";

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-3">
          Confirm & Pay
        </h2>
        <p className="text-gray-600">
          Secure payment for your {selectedRoomData?.name} booking
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-4 text-lg">
            Booking Summary
          </h4>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Room</span>
              <span className="font-medium text-gray-900">
                {selectedRoomData?.name}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="text-gray-900">
                {bookingSummary?.nights} nights • {bookingParams.checkIn} to{" "}
                {bookingParams.checkOut}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between font-semibold text-lg">
                <span className="text-gray-900">Total Amount</span>
                <span className="text-primary">
                  USD {bookingSummary?.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Action */}
        <div className="space-y-6">
          {!emailSent ? (
            <>
              <button
                onClick={handleConfirmAndPay}
                disabled={processing}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  processing
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-105"
                }`}
              >
                {processing ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : hasGateway ? (
                  `Pay with ${paymentConfig.provider}`
                ) : (
                  "Confirm & Get Payment Details"
                )}
              </button>

              {!hasGateway && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                  <p className="text-blue-800 text-sm">
                    <strong>
                      Payment integration is temporarily unavailable.
                    </strong>{" "}
                    We'll send complete bank transfer instructions securely to
                    your email address. Our team will contact you within 2 hours
                    to confirm your booking.
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-green-600">✓</span>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                Booking Confirmed!
              </h3>
              <p className="text-gray-600 mb-4">
                Your reservation has been received successfully
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Next Steps:</strong> Our customer support team will
                  contact you within 2 hours to provide payment details and
                  complete your booking. Thank you for choosing Haile Resorts!
                </p>
              </div>
            </div>
          )}

          {/* Support Contacts */}
          <div className="border-t border-gray-200 pt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Need help with payment?
              </p>

              <div className="flex justify-center gap-6 text-sm">
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
          </div>
        </div>

        {/* Back Button */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <button
            onClick={onBack}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            ← Back to Details
          </button>
        </div>
      </div>
    </div>
  );
}
