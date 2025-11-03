// app/booking/page.tsx - PRODUCTION READY VERSION
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import BookingHeader from "./components/BookingHeader";
import RoomSelection from "./components/RoomSelection";
import GuestInfoForm from "./components/GuestInfoForm";
import PaymentSection from "./components/PaymentSection";
import ConfirmationStep from "./components/ConfirmationStep";
import { bookingStyles } from "./components/BookingStyles";
import {
  RoomType,
  BookingSummary,
  GuestInfo,
  BookingParams,
  BookingStep,
  PaymentMethod,
} from "./types/booking";

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // State management
  const [step, setStep] = useState<BookingStep>(1);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Extract URL parameters with validation
  const bookingParams: BookingParams = React.useMemo(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    // Validate dates
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      if (end <= start) {
        setError("Check-out date must be after check-in date");
      }
    }

    return {
      branch: searchParams.get("branch") || "",
      checkIn: checkIn || "",
      checkOut: checkOut || "",
      guests: Math.max(1, parseInt(searchParams.get("guests") || "2")), // Ensure at least 1 guest
    };
  }, [searchParams]);

  // Calculate booking summary - memoized for performance
  const calculateBookingSummary = useCallback((): BookingSummary | null => {
    if (!bookingParams.checkIn || !bookingParams.checkOut) return null;

    const start = new Date(bookingParams.checkIn);
    const end = new Date(bookingParams.checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Validate nights calculation
    if (nights <= 0) return null;

    const roomPrice = selectedRoom
      ? roomTypes.find((r) => r.id === selectedRoom)?.basePrice || 0
      : 0;
    const taxes = roomPrice * nights * 0.1; // 10% tax
    const total = roomPrice * nights + taxes;

    return { nights, roomPrice, taxes, total };
  }, [bookingParams.checkIn, bookingParams.checkOut, selectedRoom, roomTypes]);

  // Update booking summary when dependencies change
  useEffect(() => {
    const summary = calculateBookingSummary();
    setBookingSummary(summary);
  }, [calculateBookingSummary]);

  // Fetch available rooms - with proper error handling and cleanup
  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const fetchAvailableRooms = async () => {
      if (
        !bookingParams.branch ||
        !bookingParams.checkIn ||
        !bookingParams.checkOut
      ) {
        if (isMounted) {
          setError(
            "Missing booking parameters: branch, check-in, and check-out dates are required"
          );
          setLoading(false);
        }
        return;
      }

      // Validate dates
      const start = new Date(bookingParams.checkIn);
      const end = new Date(bookingParams.checkOut);
      if (end <= start) {
        if (isMounted) {
          setError("Check-out date must be after check-in date");
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }

        const params = new URLSearchParams({
          branch: bookingParams.branch,
          checkIn: bookingParams.checkIn,
          checkOut: bookingParams.checkOut,
          adults: bookingParams.guests.toString(), // ← Change to "adults"
          children: "0", // ← Add children parameter
        });
        const response = await fetch(`/api/availability?${params}`, {
          signal: abortController.signal,
          headers: {
            "Cache-Control": "no-cache", // Prevent caching of availability data
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Failed to load rooms: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();

        if (isMounted) {
          if (data.roomTypes && Array.isArray(data.roomTypes)) {
            setRoomTypes(data.roomTypes);
          } else {
            throw new Error(
              "Invalid response format: roomTypes array not found"
            );
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch rooms:", err);
          if (err instanceof Error && err.name !== "AbortError") {
            setError(
              err instanceof Error
                ? err.message
                : "Failed to load available rooms. Please try again."
            );
          }
          setRoomTypes([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAvailableRooms();

    // Cleanup function
    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [bookingParams]);

  // Handle room selection with enhanced validation
  const handleRoomSelect = useCallback(
    (roomId: number) => {
      const room = roomTypes.find((r) => r.id === roomId);
      if (!room) {
        console.error("Room not found:", roomId);
        return;
      }

      const canAccommodate = room.capacity >= bookingParams.guests;
      const isAvailable = room.available && (room.availableRoomsCount || 0) > 0;

      if (!isAvailable) {
        alert("This room is no longer available. Please select another room.");
        return;
      }

      if (!canAccommodate) {
        alert(
          `This room only accommodates ${room.capacity} guests. Please select a different room or reduce guest count.`
        );
        return;
      }

      setSelectedRoom(roomId);
    },
    [roomTypes, bookingParams.guests]
  );

  // Handle guest info submission with enhanced error handling
  const handleGuestInfoSubmit = useCallback(
    async (guestInfo: GuestInfo) => {
      if (!selectedRoom) {
        alert("Please select a room first");
        return;
      }

      // Additional client-side validation
      if (!guestInfo.email.includes("@")) {
        alert("Please enter a valid email address");
        return;
      }

      try {
        setSubmitting(true);

        const bookingData = {
          branchSlug: bookingParams.branch,
          roomTypeId: selectedRoom.toString(),
          checkIn: bookingParams.checkIn,
          checkOut: bookingParams.checkOut,
          adults: bookingParams.guests,
          children: 0,
          infants: 0,
          guestName: `${guestInfo.firstName} ${guestInfo.lastName}`.trim(),
          guestEmail: guestInfo.email.toLowerCase().trim(),
          guestPhone: guestInfo.phone.trim(),
          guestCountry: "",
          specialRequests: guestInfo.specialRequests.trim(),
        };

        const response = await fetch("/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        const result = await response.json();

        if (!response.ok) {
          // Handle specific error cases
          if (response.status === 409) {
            throw new Error(
              "This room is no longer available. Please select a different room."
            );
          } else if (response.status === 400) {
            throw new Error(
              result.error ||
                "Invalid booking data. Please check your information."
            );
          } else {
            throw new Error(
              result.error || `Failed to create booking: ${response.status}`
            );
          }
        }

        if (result.success && result.bookingId) {
          setBookingId(result.bookingId);
          setStep(3);

          // Track successful booking for analytics
          console.log("Booking created successfully:", result.bookingId);
        } else {
          throw new Error(
            result.error || "Booking failed - no booking ID received"
          );
        }
      } catch (error) {
        console.error("Booking submission error:", error);

        // User-friendly error messages
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create booking. Please try again or contact support.";

        alert(errorMessage);

        // Optionally reset to room selection if it's an availability issue
        if (
          error instanceof Error &&
          error.message.includes("no longer available")
        ) {
          setStep(1);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [selectedRoom, bookingParams]
  );

  // Handle payment completion
  const handlePaymentComplete = useCallback(() => {
    // Track payment completion for analytics
    console.log("Payment process initiated for booking:", bookingId);
    setStep(4);
  }, [bookingId]);

  // Handle booking reset
  const handleResetBooking = useCallback(() => {
    setStep(1);
    setSelectedRoom(null);
    setPaymentMethod(null);
    setBookingId(null);
    setError(null);
  }, []);

  // Handle navigation to home
  const handleDone = useCallback(() => {
    router.push("/");
  }, [router]);

  // Render current step with error boundary
  const renderStep = () => {
    try {
      const selectedRoomData = roomTypes.find(
        (room) => room.id === selectedRoom
      );

      switch (step) {
        case 1:
          return (
            <RoomSelection
              roomTypes={roomTypes}
              selectedRoom={selectedRoom}
              bookingParams={bookingParams}
              bookingSummary={bookingSummary}
              loading={loading}
              error={error}
              onRoomSelect={handleRoomSelect}
              onProceed={() => {
                if (!selectedRoom) {
                  alert("Please select a room to continue");
                  return;
                }
                setStep(2);
              }}
            />
          );

        case 2:
          return (
            <GuestInfoForm
              selectedRoomData={selectedRoomData}
              bookingParams={bookingParams}
              bookingSummary={bookingSummary}
              submitting={submitting}
              onBack={() => setStep(1)}
              onSubmit={handleGuestInfoSubmit}
            />
          );

        case 3:
          return (
            <PaymentSection
              selectedRoomData={selectedRoomData}
              bookingParams={bookingParams}
              bookingSummary={bookingSummary}
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
              onBack={() => setStep(2)}
              onPaymentComplete={handlePaymentComplete}
            />
          );

        case 4:
          return (
            <ConfirmationStep
              bookingId={bookingId}
              onReset={handleResetBooking}
              onDone={handleDone}
            />
          );

        default:
          return <div>Invalid step</div>;
      }
    } catch (error) {
      console.error("Error rendering booking step:", error);
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😵</div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Something went wrong
          </h2>
          <p className="text-gray-600 mb-6">
            Please refresh the page and try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-bg pt-20">
      <BookingHeader step={step} params={bookingParams} />
      <div className="max-w-6xl mx-auto px-4 py-8">{renderStep()}</div>

      {/* Global Styles */}
      <style jsx global>
        {bookingStyles}
      </style>
    </div>
  );
}
