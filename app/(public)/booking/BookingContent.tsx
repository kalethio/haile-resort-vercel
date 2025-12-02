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

export default function BookingContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ---------------------------------------------------------
  // STATE MANAGEMENT
  // ---------------------------------------------------------
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

  // ✅ Added based on your instruction
  const [guestInfo, setGuestInfo] = useState<GuestInfo | null>(null);

  // ---------------------------------------------------------
  // VALIDATED BOOKING PARAMS
  // ---------------------------------------------------------
  const bookingParams: BookingParams = React.useMemo(() => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut"); //parma

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
      guests: Math.max(1, parseInt(searchParams.get("guests") || "2")),
    };
  }, [searchParams]);

  // ---------------------------------------------------------
  // BOOKING SUMMARY (NO TAX)
  // ---------------------------------------------------------
  const calculateBookingSummary = useCallback((): BookingSummary | null => {
    if (!bookingParams.checkIn || !bookingParams.checkOut) return null;

    const start = new Date(bookingParams.checkIn);
    const end = new Date(bookingParams.checkOut);
    const nights = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) return null;

    const roomPrice = selectedRoom
      ? roomTypes.find((r) => r.id === selectedRoom)?.basePrice || 0
      : 0;

    const total = roomPrice * nights;

    return { nights, roomPrice, taxes: 0, total };
  }, [bookingParams.checkIn, bookingParams.checkOut, selectedRoom, roomTypes]);

  useEffect(() => {
    const summary = calculateBookingSummary();
    setBookingSummary(summary);
  }, [calculateBookingSummary]);

  // ---------------------------------------------------------
  // FETCH AVAILABLE ROOMS
  // ---------------------------------------------------------
  useEffect(() => {
    let isMounted = true;
    const abort = new AbortController();

    const fetchRooms = async () => {
      if (
        !bookingParams.branch ||
        !bookingParams.checkIn ||
        !bookingParams.checkOut
      ) {
        if (isMounted) {
          setError("Missing booking parameters");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          branch: bookingParams.branch,
          checkIn: bookingParams.checkIn,
          checkOut: bookingParams.checkOut,
          adults: bookingParams.guests.toString(),
          children: "0",
        });

        const res = await fetch(`/api/availability?${params}`, {
          signal: abort.signal,
          headers: { "Cache-Control": "no-cache" },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Failed to load rooms: ${msg}`);
        }

        const data = await res.json();
        if (isMounted) setRoomTypes(data.roomTypes || []);
      } catch (err) {
        if (isMounted && !(err instanceof DOMException)) {
          console.error(err);
          setError("Failed to load available rooms");
          setRoomTypes([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRooms();
    return () => {
      isMounted = false;
      abort.abort();
    };
  }, [bookingParams]);

  // ---------------------------------------------------------
  // ROOM SELECTION
  // ---------------------------------------------------------
  const handleRoomSelect = useCallback(
    (roomId: number) => {
      const room = roomTypes.find((r) => r.id === roomId);
      if (!room) return;

      if (!room.available || (room.availableRoomsCount || 0) <= 0) {
        alert("This room is no longer available.");
        return;
      }

      if (room.capacity < bookingParams.guests) {
        alert(`Room accommodates only ${room.capacity} guests.`);
        return;
      }

      setSelectedRoom(roomId);
    },
    [roomTypes, bookingParams.guests]
  );

  // ---------------------------------------------------------
  // GUEST INFO SUBMIT
  // ---------------------------------------------------------
  const handleGuestInfoSubmit = useCallback(
    async (submittedGuestInfo: GuestInfo) => {
      // ✅ Store for Step 3 Payment Section
      setGuestInfo(submittedGuestInfo);

      if (!selectedRoom || !bookingSummary) {
        alert("Please select a room first");
        return;
      }

      if (!submittedGuestInfo.email.includes("@")) {
        alert("Please enter a valid email");
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
          guestName:
            `${submittedGuestInfo.firstName} ${submittedGuestInfo.lastName}`.trim(),
          guestEmail: submittedGuestInfo.email.toLowerCase().trim(),
          guestPhone: submittedGuestInfo.phone.trim(),
          guestCountry: submittedGuestInfo.guestCountry || "",
          specialRequests: submittedGuestInfo.specialRequests.trim(),

          // Required pricing fields
          totalAmount: bookingSummary.total,
          baseAmount: 0,
          nights: bookingSummary.nights,
        };

        const res = await fetch("/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookingData),
        });

        const result = await res.json();
        if (!res.ok) throw new Error(result.error || "Booking failed");

        if (!result.bookingId) throw new Error("No booking ID received");

        setBookingId(result.bookingId);
        setStep(3);
      } catch (error) {
        console.error("Booking error:", error);
        alert(error instanceof Error ? error.message : "Booking failed");
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
    [selectedRoom, bookingParams, bookingSummary]
  );

  // ---------------------------------------------------------
  // PAYMENT COMPLETE
  // ---------------------------------------------------------
  const handlePaymentComplete = useCallback(() => {
    setStep(4);
  }, []);

  const handleResetBooking = () => {
    setStep(1);
    setSelectedRoom(null);
    setPaymentMethod(null);
    setBookingId(null);
    setError(null);
  };

  const handleDone = () => router.push("/");

  // ---------------------------------------------------------
  // STEP RENDERING
  // ---------------------------------------------------------
  const renderStep = () => {
    const selectedRoomData = roomTypes.find((r) => r.id === selectedRoom);

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
              if (!selectedRoom) return alert("Select a room first");
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
            bookingParams={{ ...bookingParams, guestInfo }} // ✅ UPDATED
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
            customerEmail={guestInfo?.email}
            onReset={handleResetBooking}
            onDone={handleDone}
          />
        );
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-bg pt-20">
      <BookingHeader step={step} params={bookingParams} />
      <div className="max-w-6xl mx-auto px-4 py-8">{renderStep()}</div>

      <style jsx global>
        {bookingStyles}
      </style>
    </div>
  );
}
