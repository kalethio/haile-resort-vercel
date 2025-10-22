// app/booking/page.tsx - COMPLETE FIXED VERSION
"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
  images: string[];
  available: boolean;
  availableRoomsCount?: number;
  totalRooms?: number;
}

interface BookingSummary {
  nights: number;
  roomPrice: number;
  taxes: number;
  total: number;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(
    null
  );
  const [paymentMethod, setPaymentMethod] = useState<"chapa" | "stripe" | null>(
    null
  );
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Get parameters from URL
  const branch = searchParams.get("branch") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = parseInt(searchParams.get("guests") || "2");

  // Calculate nights and summary
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const nights = Math.ceil(
        (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
      );

      const roomPrice = selectedRoom
        ? roomTypes.find((r) => r.id === selectedRoom)?.basePrice || 0
        : 0;
      const taxes = roomPrice * nights * 0.1;
      const total = roomPrice * nights + taxes;

      setBookingSummary({
        nights,
        roomPrice,
        taxes,
        total,
      });
    }
  }, [checkIn, checkOut, selectedRoom, roomTypes]);

  // Fetch available rooms from API
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      if (!branch || !checkIn || !checkOut) {
        setError("Missing booking parameters");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          branch,
          checkIn,
          checkOut,
          guests: guests.toString(),
        });

        const response = await fetch(`/api/availability?${params}`);

        if (!response.ok) {
          throw new Error(`Failed to load rooms: ${response.status}`);
        }

        const data = await response.json();

        if (data.roomTypes) {
          setRoomTypes(data.roomTypes);
        } else {
          throw new Error("No rooms data received");
        }
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load available rooms. Please try again."
        );
        setRoomTypes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableRooms();
  }, [branch, checkIn, checkOut, guests]);

  // Handle guest info submission
  const handleGuestInfoSubmit = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    specialRequests: string;
  }) => {
    if (!selectedRoom) {
      alert("Please select a room first");
      return;
    }

    try {
      setSubmitting(true);

      const bookingData = {
        branchSlug: branch,
        roomTypeId: selectedRoom.toString(),
        checkIn,
        checkOut,
        adults: guests,
        children: 0,
        infants: 0,
        guestName: `${formData.firstName} ${formData.lastName}`,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        guestCountry: "",
        specialRequests: formData.specialRequests,
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
        throw new Error(result.error || "Failed to create booking");
      }

      if (result.success) {
        setBookingId(result.bookingId);
        setStep(3);
      } else {
        throw new Error(result.error || "Booking failed");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create booking. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = () => {
    setStep(4);
  };

  // Handle Done button click
  const handleDone = () => {
    router.push("/");
  };

  // Calculate ETB amount
  const calculateETB = (usdAmount: number) => {
    return Math.round(usdAmount * 55);
  };

  const selectedRoomData = roomTypes.find((room) => room.id === selectedRoom);

  // Loading state
  if (loading && step === 1) {
    return (
      <div className="min-h-screen bg-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available rooms...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && step === 1) {
    return (
      <div className="min-h-screen bg-bg pt-20 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-light text-gray-900 mb-4">
            Unable to Load Rooms
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg pt-20">
      {/* Header with Progress */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-light text-gray-900 tracking-tight">
                Complete Your Booking
              </h1>
              <p className="text-gray-600 mt-2 font-light">
                {checkIn} to {checkOut} • {guests}{" "}
                {guests === 1 ? "Guest" : "Guests"}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-6">
              {[
                { number: 1, label: "Select Room", current: step === 1 },
                { number: 2, label: "Guest Details", current: step === 2 },
                { number: 3, label: "Payment", current: step === 3 },
                { number: 4, label: "Confirmation", current: step === 4 },
              ].map((stepItem) => (
                <div key={stepItem.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
                      stepItem.current || step > stepItem.number
                        ? "bg-primary border-primary text-white shadow-sm"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {step > stepItem.number ? "✓" : stepItem.number}
                  </div>
                  <span
                    className={`ml-2 font-medium text-sm ${
                      stepItem.current ? "text-primary" : "text-gray-500"
                    }`}
                  >
                    {stepItem.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Step 1: Room Selection */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Room List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-light text-gray-900 tracking-tight">
                  Available Rooms
                </h2>
                <span className="text-gray-600 text-sm font-light">
                  {roomTypes.length} room types available
                </span>
              </div>

              {roomTypes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏨</div>
                  <h3 className="text-xl font-light text-gray-900 mb-2">
                    No Rooms Available
                  </h3>
                  <p className="text-gray-600">
                    Please try different dates or contact us.
                  </p>
                </div>
              ) : (
                roomTypes.map((room, index) => (
                  <div
                    key={room.id}
                    className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
                      selectedRoom === room.id
                        ? "border-primary/50 ring-2 ring-primary/20 shadow-md"
                        : "border-gray-100 hover:border-gray-200"
                    } ${!room.available ? "opacity-60 cursor-not-allowed" : ""}`}
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Room Image */}
                        <div className="lg:w-64 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden flex items-center justify-center">
                          <div className="text-primary text-center">
                            <div className="text-4xl mb-2">🏨</div>
                            <div className="text-sm font-medium">
                              {room.name}
                            </div>
                            {room.availableRoomsCount && (
                              <div className="text-xs text-gray-500 mt-1">
                                {room.availableRoomsCount} rooms left
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Room Details */}
                        <div className="flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-xl font-normal text-gray-900 mb-3">
                                    {room.name}
                                  </h3>
                                  <p className="text-gray-600 leading-relaxed font-light mb-4">
                                    {room.description}
                                  </p>

                                  {/* Amenities */}
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {room.amenities
                                      .slice(0, 4)
                                      .map((amenity, index) => (
                                        <span
                                          key={index}
                                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-200 font-light transition-all hover:scale-105"
                                        >
                                          {amenity}
                                        </span>
                                      ))}
                                    {room.amenities.length > 4 && (
                                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-200 font-light">
                                        +{room.amenities.length - 4} more
                                      </span>
                                    )}
                                  </div>

                                  {/* Capacity */}
                                  <div className="flex items-center gap-4 text-sm text-gray-500 font-light">
                                    <span className="flex items-center gap-2">
                                      <span>👤</span>
                                      Sleeps {room.capacity}
                                    </span>
                                    <span className="flex items-center gap-2">
                                      <span>✅</span>
                                      Free Cancellation
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Price & Select */}
                            <div className="mt-4 lg:mt-0 lg:text-right lg:pl-6">
                              <div className="space-y-3">
                                <div className="text-2xl font-light text-gray-900">
                                  ${room.basePrice}
                                  <span className="text-sm font-light text-gray-600 ml-1">
                                    /night
                                  </span>
                                </div>
                                {bookingSummary && (
                                  <div className="text-sm text-gray-500 font-light">
                                    $
                                    {(
                                      room.basePrice * bookingSummary.nights
                                    ).toLocaleString()}{" "}
                                    total
                                  </div>
                                )}
                                <div className="text-xs text-green-600 font-light">
                                  ✓ Free breakfast included
                                </div>
                                {room.availableRoomsCount &&
                                  room.availableRoomsCount < 5 && (
                                    <div className="text-xs text-orange-600 font-light">
                                      ⚠️ Only {room.availableRoomsCount} left
                                    </div>
                                  )}
                              </div>

                              <button
                                onClick={() =>
                                  room.available && setSelectedRoom(room.id)
                                }
                                disabled={!room.available}
                                className={`mt-4 w-full lg:w-auto px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                                  selectedRoom === room.id
                                    ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                                    : room.available
                                      ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                }`}
                              >
                                {!room.available
                                  ? "Sold Out"
                                  : selectedRoom === room.id
                                    ? "Selected"
                                    : "Select Room"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 sticky top-24 transition-all duration-300 hover:shadow-md">
                <div className="p-6">
                  <h3 className="text-lg font-normal text-gray-900 mb-6 tracking-tight">
                    Booking Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-light">Check-in</span>
                      <span className="font-medium text-gray-900">
                        {checkIn}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-light">
                        Check-out
                      </span>
                      <span className="font-medium text-gray-900">
                        {checkOut}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 font-light">Guests</span>
                      <span className="font-medium text-gray-900">
                        {guests}
                      </span>
                    </div>

                    {bookingSummary && (
                      <>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 font-light">
                              {bookingSummary.nights} night
                              {bookingSummary.nights > 1 ? "s" : ""}
                            </span>
                            <span className="font-medium text-gray-900">
                              $
                              {(
                                bookingSummary.roomPrice * bookingSummary.nights
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="font-light">Taxes & fees</span>
                            <span>
                              ${bookingSummary.taxes.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between font-medium text-lg">
                            <span className="text-gray-900">Total</span>
                            <span className="text-primary">
                              ${bookingSummary.total.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2 font-light">
                            Including all taxes and charges
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedRoom}
                    className={`w-full mt-6 py-3.5 rounded-xl font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
                      selectedRoom
                        ? "bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Continue to Guest Details
                  </button>

                  <div className="mt-6 space-y-3 text-xs text-gray-500 font-light">
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">
                        🔒
                      </span>
                      <span>Your payment is secure and encrypted</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs">
                        🔄
                      </span>
                      <span>
                        Free cancellation until 24 hours before check-in
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Guest Information */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-light text-gray-900 tracking-tight mb-3">
                Guest Information
              </h2>
              <p className="text-gray-600 font-light text-lg">
                Please provide the main guest details for this booking
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      await handleGuestInfoSubmit({
                        firstName: formData.get("firstName") as string,
                        lastName: formData.get("lastName") as string,
                        email: formData.get("email") as string,
                        phone: formData.get("phone") as string,
                        specialRequests: formData.get(
                          "specialRequests"
                        ) as string,
                      });
                    }}
                    className="space-y-8"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className="animate-fadeInUp"
                        style={{ animationDelay: "0.1s" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          required
                          disabled={submitting}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div
                        className="animate-fadeInUp"
                        style={{ animationDelay: "0.2s" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          required
                          disabled={submitting}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div
                        className="animate-fadeInUp"
                        style={{ animationDelay: "0.3s" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          disabled={submitting}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div
                        className="animate-fadeInUp"
                        style={{ animationDelay: "0.4s" }}
                      >
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          required
                          disabled={submitting}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div
                      className="animate-fadeInUp"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Special Requests
                      </label>
                      <textarea
                        name="specialRequests"
                        rows={4}
                        disabled={submitting}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light resize-none transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="Any special requirements, dietary restrictions, or room preferences..."
                      />
                    </div>

                    <div
                      className="flex justify-between pt-6 animate-fadeInUp"
                      style={{ animationDelay: "0.6s" }}
                    >
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        disabled={submitting}
                        className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-sm transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Back to Rooms
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Booking...
                          </>
                        ) : (
                          "Continue to Payment →"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Room Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1">
                  <h4 className="font-normal text-gray-900 mb-6 text-lg tracking-tight">
                    Your Room
                  </h4>
                  {selectedRoomData && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
                          <span className="text-primary text-2xl">🏨</span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {selectedRoomData.name}
                          </div>
                          <div className="text-sm text-gray-600 font-light">
                            ${selectedRoomData.basePrice}/night
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 space-y-2 font-light">
                        <div>Check-in: {checkIn}</div>
                        <div>Check-out: {checkOut}</div>
                        <div>Guests: {guests}</div>
                        {bookingSummary && (
                          <div className="pt-2 border-t border-gray-200">
                            <div className="flex justify-between font-medium">
                              <span>Total:</span>
                              <span className="text-primary">
                                ${bookingSummary.total.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment & Confirmation */}
        {step === 3 && bookingSummary && (
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
                      {bookingSummary.nights} nights • {checkIn} to {checkOut}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <div className="flex justify-between font-medium text-lg">
                      <span className="text-gray-900">Total Amount:</span>
                      <span className="text-primary">
                        USD {bookingSummary.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span className="font-light">Equivalent in ETB:</span>
                      <span>
                        ETB{" "}
                        {calculateETB(bookingSummary.total).toLocaleString()}
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
                    onClick={() => setPaymentMethod("chapa")}
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
                        <div className="font-medium text-gray-900">
                          Chapa Payment
                        </div>
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
                    onClick={() => setPaymentMethod("stripe")}
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
                        We are enhancing our payment system for a seamless
                        experience. Your booking is ready - our team will assist
                        you with the payment process.
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
                        onClick={() => setStep(2)}
                        className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-sm transform hover:scale-105"
                      >
                        ← Back to Details
                      </button>
                      <button
                        onClick={handlePaymentComplete}
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
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
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
                  onClick={() => {
                    setStep(1);
                    setSelectedRoom(null);
                    setPaymentMethod(null);
                    setBookingId(null);
                  }}
                  className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-300 hover:shadow-sm transform hover:scale-105"
                >
                  Create Another Booking
                </button>
                <button
                  onClick={handleDone}
                  className="px-8 py-3.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out both;
        }
      `}</style>
    </div>
  );
}
