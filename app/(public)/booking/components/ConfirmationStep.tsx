// app/booking/components/BookingWizard.tsx
"use client";
import React, { useState } from "react";
import ConfirmationStep from "./ConfirmationStep";

interface BookingData {
  guestEmail: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  roomType: string;
  totalAmount: number;
  branchName: string;
  // ... other booking fields
}

export default function BookingWizard() {
  const [currentStep, setCurrentStep] = useState("form");
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBookingComplete = async (bookingData: BookingData) => {
    setLoading(true);
    try {
      // 1. Create booking in database
      const bookingResponse = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const booking = await bookingResponse.json();

      if (!bookingResponse.ok) {
        throw new Error(booking.error || "Failed to create booking");
      }

      // 2. Send payment instructions email
      const paymentResponse = await fetch("/api/payment/send-instructions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestEmail: bookingData.guestEmail,
          guestName: bookingData.guestName,
          bookingId: booking.id,
          checkIn: bookingData.checkIn,
          checkOut: bookingData.checkOut,
          roomType: bookingData.roomType,
          totalAmount: bookingData.totalAmount,
          branchName: bookingData.branchName,
        }),
      });

      if (!paymentResponse.ok) {
        console.warn("Payment email failed, but continuing...");
      }

      // 3. Send booking confirmation email
      const confirmationResponse = await fetch(
        "/api/admin/send-transactional",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bookingId: booking.id,
            emailType: "confirmation",
          }),
        }
      );

      if (!confirmationResponse.ok) {
        console.warn("Confirmation email failed, but continuing...");
      }

      // 4. Show confirmation step
      setBookingId(booking.id);
      setCurrentStep("confirmation");
    } catch (error) {
      console.error("Booking completion failed:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep("form");
    setBookingId(null);
  };

  const handleDone = () => {
    window.location.href = "/";
  };

  if (currentStep === "confirmation") {
    return (
      <ConfirmationStep
        bookingId={bookingId}
        onReset={handleReset}
        onDone={handleDone}
      />
    );
  }

  // Your existing booking form goes here
  return (
    <div>
      {/* Your booking form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const bookingData: BookingData = {
            guestEmail: formData.get("email") as string,
            guestName: formData.get("name") as string,
            checkIn: formData.get("checkIn") as string,
            checkOut: formData.get("checkOut") as string,
            roomType: formData.get("roomType") as string,
            totalAmount: parseFloat(formData.get("totalAmount") as string),
            branchName: formData.get("branchName") as string,
          };
          handleBookingComplete(bookingData);
        }}
      >
        {/* Form fields */}
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium disabled:opacity-50"
        >
          {loading ? "Processing..." : "Complete Booking"}
        </button>
      </form>
    </div>
  );
}
