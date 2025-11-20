// app/booking/components/GuestInfoForm.tsx - PRODUCTION READY
"use client";
import React, { useState, useEffect } from "react";
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
  onSubmit: (guestInfo: GuestInfo) => Promise<boolean>;
}

// Essential countries for immediate load
const ESSENTIAL_COUNTRIES = [
  { code: "ET", name: "Ethiopia", phoneCode: "+251" },
  { code: "US", name: "United States", phoneCode: "+1" },
  { code: "GB", name: "United Kingdom", phoneCode: "+44" },
  { code: "CN", name: "China", phoneCode: "+86" },
  { code: "IN", name: "India", phoneCode: "+91" },
  { code: "DE", name: "Germany", phoneCode: "+49" },
  { code: "FR", name: "France", phoneCode: "+33" },
  { code: "AE", name: "United Arab Emirates", phoneCode: "+971" },
  { code: "SA", name: "Saudi Arabia", phoneCode: "+966" },
  { code: "KE", name: "Kenya", phoneCode: "+254" },
].sort((a, b) => a.name.localeCompare(b.name));

export default function GuestInfoForm({
  selectedRoomData,
  bookingParams,
  bookingSummary,
  submitting,
  onBack,
  onSubmit,
}: GuestInfoFormProps) {
  const [formErrors, setFormErrors] = useState<Partial<GuestInfo>>({});
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [formData, setFormData] = useState<Partial<GuestInfo>>({});
  const [countries, setCountries] = useState(ESSENTIAL_COUNTRIES);
  const [selectedCountry, setSelectedCountry] = useState(
    ESSENTIAL_COUNTRIES[0]
  );
  const [localPhone, setLocalPhone] = useState("");

  // Load saved form data and countries
  useEffect(() => {
    // Load form data
    const saved = localStorage.getItem("guestInfoFormData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setFormData(parsed);

      // Restore phone number and country
      if (parsed.phone) {
        const country =
          ESSENTIAL_COUNTRIES.find((c) =>
            parsed.phone?.startsWith(c.phoneCode)
          ) || ESSENTIAL_COUNTRIES[0];

        setSelectedCountry(country);
        setLocalPhone(parsed.phone.replace(country.phoneCode, ""));
      }

      if (parsed.guestCountry) {
        const country = ESSENTIAL_COUNTRIES.find(
          (c) => c.name === parsed.guestCountry
        );
        if (country) setSelectedCountry(country);
      }
    }

    // Load full country list in background
    fetch("/api/countries")
      .then((res) => res.json())
      .then(setCountries)
      .catch(() => console.log("Using essential countries list"));
  }, []);

  // Save form data
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem("guestInfoFormData", JSON.stringify(formData));
    }
  }, [formData]);

  const handleInputChange = (field: keyof GuestInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      handleInputChange("guestCountry", country.name);
      // Update phone with new country code
      if (localPhone) {
        handleInputChange("phone", `${country.phoneCode}${localPhone}`);
      }
    }
  };

  const handlePhoneChange = (value: string) => {
    // Only allow numbers and common separators
    const cleaned = value.replace(/[^\d\s\-\(\)\.]/g, "");
    setLocalPhone(cleaned);
    handleInputChange("phone", `${selectedCountry.phoneCode}${cleaned}`);
  };

  const validateForm = (): GuestInfo | null => {
    const errors: Partial<GuestInfo> = {};
    const guestInfo: GuestInfo = {
      firstName: formData.firstName?.trim() || "",
      lastName: formData.lastName?.trim() || "",
      email: formData.email?.trim() || "",
      phone: formData.phone?.trim() || "",
      guestCountry: formData.guestCountry?.trim() || "",
      specialRequests: formData.specialRequests?.trim() || "",
    };

    // Validation
    if (!guestInfo.firstName) errors.firstName = "First name is required";
    if (!guestInfo.lastName) errors.lastName = "Last name is required";

    if (!guestInfo.email) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!guestInfo.phone) {
      errors.phone = "Phone number is required";
    } else {
      const digitsOnly = guestInfo.phone.replace(/\D/g, "");
      if (digitsOnly.length < 10) {
        errors.phone = "Please enter a valid phone number";
      }
    }

    if (!guestInfo.guestCountry) {
      errors.guestCountry = "Country is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0 ? guestInfo : null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validatedData = validateForm();

    if (validatedData) {
      const success = await onSubmit(validatedData);

      // Only subscribe if booking was successful
      if (success && marketingOptIn) {
        try {
          await fetch("/api/subscribers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: validatedData.email,
              name: validatedData.firstName,
            }),
          });
        } catch (error) {
          console.warn("Newsletter subscription failed");
        }
      }
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ""}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                    disabled={submitting}
                    className={`w-full text-gray-900 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-light disabled:opacity-50 disabled:cursor-not-allowed ${
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                    disabled={submitting}
                    className={`w-full text-gray-900 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-light disabled:opacity-50 disabled:cursor-not-allowed ${
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

              {/* Contact Fields */}
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    disabled={submitting}
                    className={`w-full text-gray-900 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-light disabled:opacity-50 disabled:cursor-not-allowed ${
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Phone Number *
                  </label>
                  <div className="flex gap-3">
                    <select
                      value={selectedCountry.code}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      disabled={submitting}
                      className="w-32 px-3 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white text-gray-900 disabled:opacity-50"
                    >
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.phoneCode}
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={localPhone}
                      onChange={(e) => handlePhoneChange(e.target.value)}
                      required
                      disabled={submitting}
                      className={`flex-1 text-gray-900 px-4 py-3.5 border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 font-light disabled:opacity-50 disabled:cursor-not-allowed ${
                        formErrors.phone ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Phone number"
                    />
                  </div>
                  {formErrors.phone && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Country *
                  </label>
                  <select
                    value={selectedCountry.code}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    required
                    disabled={submitting}
                    className="w-full text-gray-900 px-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary bg-white disabled:opacity-50"
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.guestCountry && (
                    <p className="text-red-600 text-sm mt-2">
                      {formErrors.guestCountry}
                    </p>
                  )}
                </div>
              </div>
              {/* Marketing Opt-in */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(e) => setMarketingOptIn(e.target.checked)}
                    disabled={submitting}
                    className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary/20 focus:ring-2 transition-all duration-200 disabled:opacity-50"
                  />
                  <span className="text-sm text-gray-600 font-light leading-relaxed">
                    Yes, I would like to receive exclusive offers, promotions,
                    and updates about Haile Hotels & Resorts via email. I can
                    unsubscribe at any time.
                  </span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between pt-6">
                <button
                  type="button"
                  onClick={onBack}
                  disabled={submitting}
                  className="px-8 py-3.5 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Back to Rooms
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3.5 bg-primary text-white rounded-xl hover:bg-primary/90 font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
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
