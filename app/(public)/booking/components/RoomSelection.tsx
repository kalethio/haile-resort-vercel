// app/booking/components/RoomSelection.tsx
"use client";
import React, { useState } from "react";
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
  const adults = Number(bookingParams.adults) || 2;
  const children = Number(bookingParams.children) || 0;

  // Remove debug logs for production
  const safeRoomTypes = Array.isArray(roomTypes) ? roomTypes : [];

  if (loading) {
    return <RoomSelectionSkeleton />;
  }

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
                Rooms that accommodate {adults}{" "}
                {adults === 1 ? "adult" : "adults"}
                {children > 0 ? " (children can share beds)" : ""}
              </p>
            </div>
          </div>
        </div>

        {safeRoomTypes.length === 0 ? (
          <NoRoomsAvailable adults={adults} />
        ) : (
          <div className="space-y-6">
            {safeRoomTypes.map((room, index) => (
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
            ))}
          </div>
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

// Room Card Component with Image Gallery
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
  const [showGallery, setShowGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const safeAdults = Number(adults) || 2;
  const safeChildren = Number(children) || 0;

  // Updated capacity logic considering both adults and children
  const totalGuests = safeAdults + safeChildren;
  const canAccommodate = room.capacity >= totalGuests;
  const isAvailable = room.available && (room.availableRoomsCount || 0) > 0;
  const isLowInventory =
    room.availableRoomsCount && room.availableRoomsCount < 3;
  const isSelectable = isAvailable && canAccommodate;

  const openGallery = (imgIndex: number) => {
    setSelectedImageIndex(imgIndex);
    setShowGallery(true);
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) =>
      prev < (room.images?.length || 1) - 1 ? prev + 1 : 0
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) =>
      prev > 0 ? prev - 1 : (room.images?.length || 1) - 1
    );
  };

  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${
          isSelected
            ? "border-primary/50 ring-2 ring-primary/20 shadow-md"
            : "border-gray-100 hover:border-gray-200"
        } ${!isSelectable ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Room Image Gallery */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="relative">
                {/* Main Image - Clickable */}
                <div
                  className="h-48 bg-gray-100 rounded-xl overflow-hidden cursor-pointer group relative"
                  onClick={() => openGallery(0)}
                >
                  {room.images?.[0] ? (
                    // Use regular img tag instead of Next/Image for external URLs
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                      <div className="text-center text-primary">
                        <div className="text-4xl mb-2">🏨</div>
                        <div className="text-sm font-medium">No Image</div>
                      </div>
                    </div>
                  )}

                  {/* Rest of the code remains same */}
                </div>
                {/* Thumbnail Strip */}
                {room.images && room.images.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {room.images.slice(0, 4).map((image, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden cursor-pointer flex-shrink-0 border-2 border-transparent hover:border-primary transition-colors"
                        onClick={() => openGallery(imgIndex)}
                      >
                        <img
                          src={image}
                          alt={`${room.name} ${imgIndex + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {room.images.length > 4 && (
                      <div
                        className="w-16 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xs text-gray-600 cursor-pointer flex-shrink-0 border-2 border-dashed border-gray-300"
                        onClick={() => openGallery(4)}
                      >
                        +{room.images.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Availability Badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {!isAvailable && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Sold Out
                  </div>
                )}
                {isLowInventory && isAvailable && (
                  <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {room.availableRoomsCount} Left
                  </div>
                )}
                {!canAccommodate && isAvailable && (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Too Small
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
                      <h3 className="text-xl font-normal text-gray-900 mb-2">
                        {room.name}
                        <span className="ml-2 text-sm font-medium text-gray-600">
                          (Sleeps {room.capacity})
                        </span>
                      </h3>

                      {/* Capacity Status */}
                      <CapacityStatus
                        room={room}
                        adults={safeAdults}
                        children={safeChildren}
                      />

                      <p className="text-gray-600 leading-relaxed font-light mb-4">
                        {room.description}
                      </p>

                      {/* Amenities */}
                      {room.amenities && room.amenities.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {room.amenities.slice(0, 4).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-gray-50 text-gray-600 border border-gray-200 font-light"
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
                      )}
                    </div>
                  </div>
                </div>

                {/* Price & Select Button */}
                <RoomPriceSection
                  room={room}
                  bookingSummary={bookingSummary}
                  isSelected={isSelected}
                  isSelectable={isSelectable}
                  adults={safeAdults}
                  onSelect={onSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {showGallery && room.images && room.images.length > 0 && (
        <ImageGalleryModal
          images={room.images}
          selectedIndex={selectedImageIndex}
          roomName={room.name}
          onClose={() => setShowGallery(false)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </>
  );
}

// Capacity Status Component
function CapacityStatus({
  room,
  adults,
  children,
}: {
  room: RoomType;
  adults: number;
  children: number;
}) {
  const totalGuests = adults + children;
  const remainingCapacity = room.capacity - totalGuests;

  const getStatusConfig = () => {
    if (room.capacity < totalGuests) {
      return {
        status: "too-small",
        message: `Room capacity (${room.capacity}) too small for ${totalGuests} guests`,
        icon: "❌",
        color: "red",
      };
    }

    if (remainingCapacity === 0) {
      return {
        status: "perfect-fit",
        message: "Perfect fit for your party",
        icon: "✅",
        color: "green",
      };
    } else if (remainingCapacity <= 2) {
      return {
        status: "good-fit",
        message: `Space for ${remainingCapacity} more guest${remainingCapacity !== 1 ? "s" : ""}`,
        icon: "👍",
        color: "blue",
      };
    } else {
      return {
        status: "spacious",
        message: `Very spacious for your party`,
        icon: "💫",
        color: "purple",
      };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      className={`mb-3 p-3 rounded-lg border bg-${config.color}-50 border-${config.color}-200`}
    >
      <p
        className={`text-sm font-medium flex items-center gap-2 text-${config.color}-700`}
      >
        <span>{config.icon}</span>
        {config.message}
      </p>
      <p className="text-xs text-gray-600 mt-1 font-light">
        Your party: {adults} {adults === 1 ? "adult" : "adults"}
        {children > 0 &&
          `, ${children} ${children === 1 ? "child" : "children"}`}
      </p>
    </div>
  );
}

// Price Section Component
function RoomPriceSection({
  room,
  bookingSummary,
  isSelected,
  isSelectable,
  adults,
  onSelect,
}: {
  room: RoomType;
  bookingSummary: BookingSummaryType | null;
  isSelected: boolean;
  isSelectable: boolean;
  adults: number;
  onSelect: (roomId: number) => void;
}) {
  return (
    <div className="mt-4 lg:mt-0 lg:text-right lg:pl-6">
      <div className="space-y-3">
        <div className="text-2xl font-light text-gray-900">
          ${room.basePrice}
          <span className="text-sm font-light text-gray-600 ml-1">/night</span>
        </div>
        {bookingSummary && (
          <div className="text-sm text-gray-500 font-light">
            ${(room.basePrice * bookingSummary.nights).toLocaleString()} total
          </div>
        )}
        <div className="text-xs text-green-600 font-light">
          ✓ Free breakfast included
        </div>
      </div>

      <button
        onClick={() => onSelect(room.id)}
        disabled={!isSelectable}
        className={`mt-4 w-full lg:w-auto px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${
          isSelected
            ? "bg-primary text-white shadow-sm hover:bg-primary/90"
            : isSelectable
              ? "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400"
              : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
        }`}
      >
        {!isSelectable
          ? "Not Available"
          : isSelected
            ? "Selected"
            : "Select Room"}
      </button>
    </div>
  );
}

// Image Gallery Modal Component
function ImageGalleryModal({
  images,
  selectedIndex,
  roomName,
  onClose,
  onNext,
  onPrev,
}: {
  images: string[];
  selectedIndex: number;
  roomName: string;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-3xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
        >
          ×
        </button>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              className="absolute left-4 text-white text-2xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
            >
              ‹
            </button>
            <button
              onClick={onNext}
              className="absolute right-4 text-white text-2xl z-10 bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70"
            >
              ›
            </button>
          </>
        )}

        {/* Main Image */}
        <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
          <img
            src={images[selectedIndex]}
            alt={`${roomName} ${selectedIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Image Counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">
          {selectedIndex + 1} / {images.length}
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                /* You'd need to pass setSelectedImageIndex here */
              }}
              className={`w-16 h-12 bg-gray-800 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                index === selectedIndex ? "border-white" : "border-transparent"
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Skeleton Loading Component
function RoomSelectionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
        </div>
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-64 h-48 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-200 rounded animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// No Rooms Available Component
function NoRoomsAvailable({ adults }: { adults: number }) {
  return (
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
  );
}
