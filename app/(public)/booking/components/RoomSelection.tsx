// app/booking/components/RoomSelection.tsx
"use client";
import React from "react";
import {
  RoomType,
  BookingParams,
  BookingSummary as BookingSummaryType,
} from "../types/booking";
import BookingSummary from "./BookingSummary";

interface RoomSelectionProps {
  roomTypes: RoomType[];
  selectedRoom: number | null;
  bookingParams: BookingParams;
  bookingSummary: BookingSummaryType | null;
  loading: boolean;
  error: string | null;
  onRoomSelect: (roomId: number) => void;
  onProceed: () => void;
}

export default function RoomSelection({
  roomTypes,
  selectedRoom,
  bookingParams,
  bookingSummary,
  loading,
  error,
  onRoomSelect,
  onProceed,
}: RoomSelectionProps) {
  // ✅ FIX: Add proper number validation
  const adults = Number(bookingParams.adults) || 2;
  const children = Number(bookingParams.children) || 0;

  // 🔍 ENHANCED DEBUG LOGGING
  console.log("🔍 ROOM SELECTION DEBUG:", {
    // Raw parameters
    rawAdults: bookingParams.adults,
    rawChildren: bookingParams.children,
    // Processed numbers
    adults,
    children,
    // Room data validation
    roomTypesExists: !!roomTypes,
    isArray: Array.isArray(roomTypes),
    roomTypesLength: roomTypes?.length || 0,
    // First room deep inspection
    firstRoom: roomTypes?.[0]
      ? {
          id: roomTypes[0].id,
          name: roomTypes[0].name,
          available: roomTypes[0].available,
          availableRoomsCount: roomTypes[0].availableRoomsCount,
          capacity: roomTypes[0].capacity,
          basePrice: roomTypes[0].basePrice,
          // Property existence checks
          hasAllProps:
            roomTypes[0].id !== undefined &&
            roomTypes[0].available !== undefined &&
            roomTypes[0].availableRoomsCount !== undefined &&
            roomTypes[0].capacity !== undefined,
        }
      : "No rooms in array",
    // All rooms summary
    allRooms:
      roomTypes?.map((room) => ({
        id: room.id,
        name: room.name,
        available: room.available,
        availableRoomsCount: room.availableRoomsCount,
        capacity: room.capacity,
      })) || "No rooms",
  });

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">
            Finding available rooms for {adults}{" "}
            {adults === 1 ? "adult" : "adults"}...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12">
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
    );
  }

  // ✅ SAFETY CHECK: Ensure roomTypes is always an array
  const safeRoomTypes = Array.isArray(roomTypes) ? roomTypes : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Room List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-light text-gray-900 tracking-tight">
            Available Rooms for {adults} {adults === 1 ? "Adult" : "Adults"}
            {children > 0 &&
              ` + ${children} ${children === 1 ? "Child" : "Children"}`}
          </h2>
          <span className="text-gray-600 text-sm font-light">
            {safeRoomTypes.length} room type
            {safeRoomTypes.length !== 1 ? "s" : ""} available
          </span>
        </div>

        {/* Guest Composition Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-2">
          <div className="flex items-center gap-3">
            <span className="text-blue-600 text-lg">👥</span>
            <div>
              <p className="text-blue-800 font-medium">
                Your Party: {adults} {adults === 1 ? "Adult" : "Adults"}
                {children > 0 &&
                  `, ${children} ${children === 1 ? "Child" : "Children"}`}
              </p>
              <p className="text-blue-700 text-sm font-light">
                Showing rooms that can accommodate {adults}{" "}
                {adults === 1 ? "adult" : "adults"}
                {children > 0 ? " (children can share beds)" : ""}
              </p>
            </div>
          </div>
        </div>

        {safeRoomTypes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-light text-gray-900 mb-2">
              No Suitable Rooms Available
            </h3>
            <p className="text-gray-600 font-light mb-4">
              We could not find rooms that accommodate {adults}{" "}
              {adults === 1 ? "adult" : "adults"} for your selected dates.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Try adjusting your guest count or dates</p>
              <p>• Contact us for group booking options</p>
              <p>• Check our suites for larger parties</p>
            </div>
          </div>
        ) : (
          safeRoomTypes.map((room, index) => (
            <RoomCard
              key={room.id}
              room={room}
              index={index}
              adults={adults}
              children={children}
              isSelected={selectedRoom === room.id}
              bookingSummary={bookingSummary}
              onSelect={onRoomSelect}
            />
          ))
        )}
      </div>

      {/* Booking Summary Sidebar */}
      <BookingSummary
        bookingParams={bookingParams}
        bookingSummary={bookingSummary}
        selectedRoom={selectedRoom}
        roomTypes={safeRoomTypes}
        onProceed={onProceed}
      />
    </div>
  );
}

// Enhanced Room Card with accurate adults-only capacity checking
function RoomCard({
  room,
  index,
  adults,
  children,
  isSelected,
  bookingSummary,
  onSelect,
}: {
  room: RoomType;
  index: number;
  adults: number;
  children: number;
  isSelected: boolean;
  bookingSummary: BookingSummaryType | null;
  onSelect: (roomId: number) => void;
}) {
  // ✅ FIX: Ensure numbers and use adults-only logic
  const safeAdults = Number(adults) || 2;
  const safeChildren = Number(children) || 0;

  // ✅ FIX: Check room capacity against ADULTS only (children can share)
  const canAccommodate = room.capacity >= safeAdults;
  const isAvailable = room.available && (room.availableRoomsCount || 0) > 0;
  const isLowInventory =
    room.availableRoomsCount && room.availableRoomsCount < 3;
  const isSelectable = isAvailable && canAccommodate;

  // 🔍 ENHANCED DEBUG LOGGING FOR EACH ROOM
  console.log("🔍 ROOM CARD DEBUG:", {
    roomId: room.id,
    roomName: room.name,
    // Room properties
    roomAvailable: room.available,
    roomAvailableRoomsCount: room.availableRoomsCount,
    roomCapacity: room.capacity,
    // Guest info
    adults: safeAdults,
    children: safeChildren,
    // Logic results
    canAccommodate,
    isAvailable,
    isSelectable,
    // Detailed calculation
    capacityCheck: `${room.capacity} >= ${safeAdults} = ${canAccommodate}`,
    availabilityCheck: `${room.available} && ${room.availableRoomsCount} > 0 = ${isAvailable}`,
  });

  // Calculate how well the room fits the guest composition
  const getCapacityStatus = () => {
    if (!canAccommodate) {
      return {
        status: "too-small",
        message: `Room capacity (${room.capacity}) too small for ${safeAdults} adults`,
        icon: "❌",
      };
    }

    const remainingCapacity = room.capacity - safeAdults;
    if (remainingCapacity === 0) {
      return {
        status: "perfect-fit",
        message: "Perfect fit for your adults",
        icon: "✅",
      };
    } else if (remainingCapacity <= 2) {
      return {
        status: "good-fit",
        message: `Space for ${remainingCapacity} more adult${remainingCapacity !== 1 ? "s" : ""}`,
        icon: "👍",
      };
    } else {
      return {
        status: "spacious",
        message: `Very spacious for your party`,
        icon: "💫",
      };
    }
  };

  const capacityStatus = getCapacityStatus();

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md transform hover:-translate-y-1 ${
        isSelected
          ? "border-primary/50 ring-2 ring-primary/20 shadow-md"
          : "border-gray-100 hover:border-gray-200"
      } ${!isSelectable ? "opacity-60 cursor-not-allowed grayscale" : ""}`}
      style={{ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` }}
    >
      <div className="p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Room Image */}
          <div className="lg:w-64 h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl overflow-hidden flex items-center justify-center relative">
            {/* Availability Badges */}
            {!isAvailable && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Sold Out
              </div>
            )}
            {isLowInventory && isAvailable && (
              <div className="absolute top-3 right-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                {room.availableRoomsCount} Left
              </div>
            )}
            {!canAccommodate && isAvailable && (
              <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Too Small
              </div>
            )}

            <div className="text-primary text-center">
              <div className="text-4xl mb-2">🏨</div>
              <div className="text-sm font-medium">{room.name}</div>
              {room.availableRoomsCount && isAvailable && (
                <div className="text-xs text-gray-500 mt-1 font-light">
                  {room.availableRoomsCount}{" "}
                  {room.availableRoomsCount === 1 ? "room" : "rooms"} available
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
                      <span className="ml-2 text-sm font-medium text-gray-600">
                        (Sleeps {room.capacity})
                      </span>
                    </h3>

                    {/* Capacity Status */}
                    <div
                      className={`mb-3 p-3 rounded-lg border ${
                        capacityStatus.status === "too-small"
                          ? "bg-red-50 border-red-200"
                          : capacityStatus.status === "perfect-fit"
                            ? "bg-green-50 border-green-200"
                            : capacityStatus.status === "good-fit"
                              ? "bg-blue-50 border-blue-200"
                              : "bg-purple-50 border-purple-200"
                      }`}
                    >
                      <p
                        className={`text-sm font-medium flex items-center gap-2 ${
                          capacityStatus.status === "too-small"
                            ? "text-red-700"
                            : capacityStatus.status === "perfect-fit"
                              ? "text-green-700"
                              : capacityStatus.status === "good-fit"
                                ? "text-blue-700"
                                : "text-purple-700"
                        }`}
                      >
                        <span>{capacityStatus.icon}</span>
                        {capacityStatus.message}
                      </p>
                      {capacityStatus.status !== "too-small" && (
                        <p className="text-xs text-gray-600 mt-1 font-light">
                          Your party: {safeAdults}{" "}
                          {safeAdults === 1 ? "adult" : "adults"}
                          {safeChildren > 0 &&
                            `, ${safeChildren} ${safeChildren === 1 ? "child" : "children"} (can share beds)`}
                        </p>
                      )}
                    </div>

                    <p className="text-gray-600 leading-relaxed font-light mb-4">
                      {room.description}
                    </p>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.amenities?.slice(0, 4).map((amenity, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-200 font-light transition-all hover:scale-105"
                        >
                          {amenity}
                        </span>
                      ))}
                      {room.amenities && room.amenities.length > 4 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-50 text-gray-500 border border-gray-200 font-light">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>

                    {/* Capacity Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 font-light">
                      <span className="flex items-center gap-2">
                        <span>👥</span>
                        Max {room.capacity} guests
                      </span>
                      <span className="flex items-center gap-2">
                        <span>✅</span>
                        Free Cancellation
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Select Button */}
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

                  {/* Inventory & Capacity Status */}
                  {isLowInventory && isAvailable && canAccommodate && (
                    <div className="text-xs text-orange-600 font-light bg-orange-50 px-2 py-1 rounded">
                      ⚠️ Only {room.availableRoomsCount} left!
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="text-xs text-red-600 font-light bg-red-50 px-2 py-1 rounded">
                      ❌ Fully booked for your dates
                    </div>
                  )}
                  {!canAccommodate && isAvailable && (
                    <div className="text-xs text-red-600 font-light bg-red-50 px-2 py-1 rounded">
                      ❌ Needs capacity for {safeAdults}+ adults
                    </div>
                  )}
                  {canAccommodate &&
                    isAvailable &&
                    capacityStatus.status === "perfect-fit" && (
                      <div className="text-xs text-green-600 font-light bg-green-50 px-2 py-1 rounded">
                        ✅ Perfect for your adults
                      </div>
                    )}
                </div>

                <button
                  onClick={() => onSelect(room.id)}
                  disabled={!isSelectable}
                  className={`mt-4 w-full lg:w-auto px-6 py-2.5 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                    isSelected
                      ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                      : isSelectable
                        ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {!isAvailable
                    ? "Sold Out"
                    : !canAccommodate
                      ? `Needs ${safeAdults}+ Adults`
                      : isSelected
                        ? "Selected"
                        : "Select Room"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
