"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface RoomType {
  id: number;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  amenities: string[];
  images: string[];
  available: boolean;
}

interface BookingSummary {
  nights: number;
  roomPrice: number;
  taxes: number;
  total: number;
}

export default function BookingPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [bookingSummary, setBookingSummary] = useState<BookingSummary | null>(
    null
  );

  // Get parameters from URL
  const branch = searchParams.get("branch") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "2";

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
      const taxes = roomPrice * nights * 0.1; // 10% tax
      const total = roomPrice * nights + taxes;

      setBookingSummary({
        nights,
        roomPrice,
        taxes,
        total,
      });
    }
  }, [checkIn, checkOut, selectedRoom, roomTypes]);

  // Fetch available rooms
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await fetch(
          `/api/rooms/availability?branch=${branch}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
        );
        if (response.ok) {
          const data = await response.json();
          setRoomTypes(data.roomTypes);
        }
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };

    if (branch && checkIn && checkOut) {
      fetchAvailableRooms();
    }
  }, [branch, checkIn, checkOut, guests]);

  // Mock room data for now
  useEffect(() => {
    if (roomTypes.length === 0) {
      setRoomTypes([
        {
          id: 1,
          name: "Deluxe King Room",
          description:
            "Spacious room with king-sized bed, mountain view, and modern amenities perfect for couples or solo travelers.",
          capacity: 2,
          basePrice: 199,
          amenities: [
            "Free WiFi",
            "Air Conditioning",
            "Smart TV",
            "Mini Bar",
            "Coffee Maker",
            "Safe",
          ],
          images: ["/room-deluxe.jpg"],
          available: true,
        },
        {
          id: 2,
          name: "Executive Suite",
          description:
            "Luxurious suite with separate living area, perfect for business travelers or families needing extra space.",
          capacity: 4,
          basePrice: 299,
          amenities: [
            "Free WiFi",
            "Air Conditioning",
            "2 Smart TVs",
            "Mini Bar",
            "Coffee Maker",
            "Safe",
            "Work Desk",
          ],
          images: ["/room-suite.jpg"],
          available: true,
        },
        {
          id: 3,
          name: "Family Room",
          description:
            "Comfortable family accommodation with connecting rooms and child-friendly amenities.",
          capacity: 5,
          basePrice: 249,
          amenities: [
            "Free WiFi",
            "Air Conditioning",
            "Smart TV",
            "Mini Bar",
            "Coffee Maker",
            "Safe",
            "Baby Cot Available",
          ],
          images: ["/room-family.jpg"],
          available: true,
        },
      ]);
    }
  }, [roomTypes.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Progress */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Complete Your Booking
              </h1>
              <p className="text-gray-600 mt-1">
                {checkIn} to {checkOut} • {guests}{" "}
                {guests === "1" ? "Guest" : "Guests"}
              </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center space-x-8">
              {[
                { number: 1, label: "Select Room", current: step === 1 },
                { number: 2, label: "Guest Details", current: step === 2 },
                { number: 3, label: "Confirmation", current: step === 3 },
              ].map((stepItem) => (
                <div key={stepItem.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      stepItem.current || step > stepItem.number
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {step > stepItem.number ? "✓" : stepItem.number}
                  </div>
                  <span
                    className={`ml-2 font-medium ${
                      stepItem.current ? "text-blue-600" : "text-gray-500"
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Available Rooms
                </h2>
                <span className="text-gray-600">
                  {roomTypes.length} rooms available
                </span>
              </div>

              {roomTypes.map((room) => (
                <div
                  key={room.id}
                  className={`bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
                    selectedRoom === room.id
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Room Image */}
                      <div className="lg:w-64 h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg overflow-hidden flex items-center justify-center">
                        <div className="text-blue-600 text-center">
                          <div className="text-4xl mb-2">🏨</div>
                          <div className="text-sm font-medium">{room.name}</div>
                        </div>
                      </div>

                      {/* Room Details */}
                      <div className="flex-1">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-semibold text-gray-900">
                                  {room.name}
                                </h3>
                                <p className="text-gray-600 mt-2 leading-relaxed">
                                  {room.description}
                                </p>

                                {/* Amenities */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                  {room.amenities.map((amenity, index) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700 border"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                </div>

                                {/* Capacity */}
                                <div className="flex items-center gap-4 mt-4 text-sm text-gray-600">
                                  <span className="flex items-center gap-1">
                                    <span>👤</span>
                                    Sleeps {room.capacity}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span>✅</span>
                                    Free Cancellation
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Price & Select */}
                          <div className="mt-4 lg:mt-0 lg:text-right">
                            <div className="space-y-2">
                              <div className="text-2xl font-bold text-gray-900">
                                ${room.basePrice}
                                <span className="text-sm font-normal text-gray-600">
                                  /night
                                </span>
                              </div>
                              {bookingSummary && (
                                <div className="text-sm text-gray-600">
                                  $
                                  {(
                                    room.basePrice * bookingSummary.nights
                                  ).toLocaleString()}{" "}
                                  total
                                </div>
                              )}
                              <div className="text-xs text-green-600 font-medium">
                                ✓ Free breakfast included
                              </div>
                            </div>

                            <button
                              onClick={() => setSelectedRoom(room.id)}
                              className={`mt-4 w-full lg:w-auto px-8 py-3 rounded-lg font-semibold transition-all ${
                                selectedRoom === room.id
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300"
                              }`}
                            >
                              {selectedRoom === room.id
                                ? "Selected"
                                : "Select Room"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 sticky top-8">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Booking Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-in</span>
                      <span className="font-medium">{checkIn}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Check-out</span>
                      <span className="font-medium">{checkOut}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Guests</span>
                      <span className="font-medium">{guests}</span>
                    </div>

                    {bookingSummary && (
                      <>
                        <div className="border-t pt-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">
                              {bookingSummary.nights} night
                              {bookingSummary.nights > 1 ? "s" : ""}
                            </span>
                            <span>
                              $
                              {(
                                bookingSummary.roomPrice * bookingSummary.nights
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Taxes & fees</span>
                            <span>
                              ${bookingSummary.taxes.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total</span>
                            <span className="text-blue-600">
                              ${bookingSummary.total.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Including all taxes and charges
                          </p>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    disabled={!selectedRoom}
                    className={`w-full mt-6 py-4 rounded-lg font-semibold text-lg transition-all ${
                      selectedRoom
                        ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Continue to Guest Details
                  </button>

                  <div className="mt-4 space-y-2 text-xs text-gray-500">
                    <div className="flex items-center gap-2">
                      <span>🔒</span>
                      <span>Your payment is secure and encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🔄</span>
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
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Guest Information
              </h2>
              <p className="text-gray-600 mt-2">
                Please provide the main guest details for this booking
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter first name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="Enter last name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Any special requirements, dietary restrictions, or room preferences..."
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all"
                      >
                        ← Back to Rooms
                      </button>
                      <button
                        type="button"
                        onClick={() => setStep(3)}
                        className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all"
                      >
                        Continue to Payment →
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Room Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Your Room
                  </h4>
                  {selectedRoom &&
                    roomTypes.find((r) => r.id === selectedRoom) && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 text-2xl">🏨</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {
                                roomTypes.find((r) => r.id === selectedRoom)
                                  ?.name
                              }
                            </div>
                            <div className="text-sm text-gray-600">
                              $
                              {
                                roomTypes.find((r) => r.id === selectedRoom)
                                  ?.basePrice
                              }
                              /night
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>Check-in: {checkIn}</div>
                          <div>Check-out: {checkOut}</div>
                          <div>Guests: {guests}</div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment & Confirmation */}
        {step === 3 && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Payment Details
              </h2>
              <p className="text-gray-600 mt-2">Secure payment processing</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Integration
              </h3>
              <p className="text-gray-600 mb-6">
                This is where you would integrate with your payment provider
                (Stripe, PayPal, etc.)
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
                >
                  ← Back
                </button>
                <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                  Complete Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
