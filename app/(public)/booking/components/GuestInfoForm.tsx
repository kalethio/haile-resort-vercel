// app/booking/components/GuestInfoForm.tsx
"use client";
import React, { useState } from "react";
import {
  RoomType,
  BookingParams,
  BookingSummary,
  GuestInfo,
} from "../types/booking";

interface GuestInfoFormProps {
  selectedRoomData: RoomType | undefined;
  bookingParams: BookingParams;
  bookingSummary: BookingSummary | null;
  submitting: boolean;
  onBack: () => void;
  onSubmit: (guestInfo: GuestInfo) => void;
}

export default function GuestInfoForm({
  selectedRoomData,
  bookingParams,
  bookingSummary,
  submitting,
  onBack,
  onSubmit,
}: GuestInfoFormProps) {
  const [formErrors, setFormErrors] = useState<Partial<GuestInfo>>({});

  const validateForm = (formData: FormData): GuestInfo | null => {
    const errors: Partial<GuestInfo> = {};
    const guestInfo: GuestInfo = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      specialRequests: formData.get("specialRequests") as string,
    };

    // Validation rules
    if (!guestInfo.firstName?.trim())
      errors.firstName = "First name is required";
    if (!guestInfo.lastName?.trim()) errors.lastName = "Last name is required";

    if (!guestInfo.email?.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!guestInfo.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (
      !/^\+?[\d\s-()]{10,}$/.test(guestInfo.phone.replace(/\s/g, ""))
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0 ? guestInfo : null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const validatedData = validateForm(formData);

    if (validatedData) {
      onSubmit(validatedData);
    }
  };

  return (
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
            <form onSubmit={handleSubmit} className="space-y-8">
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
                    className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      formErrors.firstName
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter first name"
                  />
                  {formErrors.firstName && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.firstName}
                    </p>
                  )}
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
                    className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      formErrors.lastName ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Enter last name"
                  />
                  {formErrors.lastName && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.lastName}
                    </p>
                  )}
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
                    className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      formErrors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="your@email.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.email}
                    </p>
                  )}
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
                    className={`w-full px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-light transform hover:scale-105 focus:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      formErrors.phone ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {formErrors.phone && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.phone}
                    </p>
                  )}
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
                  onClick={onBack}
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
                    <div className="text-xs text-green-600 font-light mt-1">
                      ✓ Accommodates {selectedRoomData.capacity} guests
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 space-y-2 font-light">
                  <div>Check-in: {bookingParams.checkIn}</div>
                  <div>Check-out: {bookingParams.checkOut}</div>
                  <div>Guests: {bookingParams.guests}</div>
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
  );
}
