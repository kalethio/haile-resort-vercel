"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Branch {
  slug: string;
  branchName: string;
  heroImage: string;
  starRating: number;
  location: {
    city: string;
    region: string;
  };
}

export default function CheckBooking() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branch, setBranch] = useState<string>("");
  const [branchSlug, setBranchSlug] = useState<string>("");
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState<number>(2);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        if (response.ok) {
          const data = await response.json();
          setBranches(data);
          if (data.length > 0) {
            setBranch(data[0].branchName);
            setBranchSlug(data[0].slug);
          }
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchBranches();
  }, []);

  // Initialize dates
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    setCheckin(today.toISOString().slice(0, 10));
    setCheckout(tomorrow.toISOString().slice(0, 10));
  }, []);

  // Handle branch selection change
  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBranchName = e.target.value;
    const selectedBranch = branches.find(
      (b) => b.branchName === selectedBranchName
    );
    setBranch(selectedBranchName);
    setBranchSlug(selectedBranch?.slug || "");
  };

  // Show popup function
  const showErrorPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!branchSlug || !checkin || !checkout) {
      showErrorPopup("Please fill in all required fields");
      return;
    }

    const params = new URLSearchParams({
      branch: branchSlug,
      checkIn: checkin,
      checkOut: checkout,
      guests: guests.toString(),
    });

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Branch Select - Made wider */}
          <div className="w-full lg:flex-1 lg:min-w-[200px]">
            <label
              htmlFor="branch-select"
              className="block text-sm font-medium text-accent mb-2"
            >
              Destination
            </label>
            <div
              className={`relative rounded-xl border-2 transition-all duration-300 ${
                focusedField === "branch"
                  ? "border-primary bg-white/20 shadow-lg"
                  : "border-white/30 bg-white/15 hover:bg-white/20"
              }`}
            >
              <select
                id="branch-select"
                value={branch}
                onChange={handleBranchChange}
                onFocus={() => setFocusedField("branch")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent py-3 px-4 text-white placeholder-white/60 outline-none appearance-none cursor-pointer text-base font-normal truncate"
              >
                {branches.map((b) => (
                  <option
                    key={b.slug}
                    value={b.branchName}
                    className="text-black"
                  >
                    {b.branchName}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Date Selection - Made wider */}
          <div className="w-full lg:flex-1 lg:min-w-[280px]">
            <label className="block text-sm font-medium text-accent mb-2">
              Check-in & Check-out
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`relative rounded-xl border-2 transition-all duration-300 ${
                  focusedField === "checkin"
                    ? "border-primary bg-white/20 shadow-lg"
                    : "border-white/30 bg-white/15 hover:bg-white/20"
                }`}
              >
                <input
                  type="date"
                  value={checkin}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setCheckin(e.target.value)}
                  onFocus={() => setFocusedField("checkin")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 px-4 text-white outline-none text-base font-normal"
                />
              </div>
              <div
                className={`relative rounded-xl border-2 transition-all duration-300 ${
                  focusedField === "checkout"
                    ? "border-primary bg-white/20 shadow-lg"
                    : "border-white/30 bg-white/15 hover:bg-white/20"
                }`}
              >
                <input
                  type="date"
                  value={checkout}
                  min={checkin}
                  onChange={(e) => setCheckout(e.target.value)}
                  onFocus={() => setFocusedField("checkout")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full bg-transparent py-3 px-4 text-white outline-none text-base font-normal"
                />
              </div>
            </div>
          </div>

          {/* Guests Selector - Made wider */}
          <div className="w-full lg:flex-1 lg:min-w-[160px]">
            <label
              htmlFor="guests-select"
              className="block text-sm font-medium text-accent mb-2"
            >
              Guests
            </label>
            <div
              className={`relative rounded-xl border-2 transition-all duration-300 ${
                focusedField === "guests"
                  ? "border-primary bg-white/20 shadow-lg"
                  : "border-white/30 bg-white/15 hover:bg-white/20"
              }`}
            >
              <select
                id="guests-select"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                onFocus={() => setFocusedField("guests")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent py-3 px-4 text-white outline-none appearance-none cursor-pointer text-base font-normal"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n} className="text-black">
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-white/70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* CTA Button - Made wider */}
          <div className="w-full lg:flex-1 lg:min-w-[200px]">
            <label className="block text-sm font-medium text-transparent mb-2">
              Check Availability
            </label>
            <button
              type="submit"
              className="w-full cursor-pointer inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-6 py-3 text-base font-semibold text-white shadow-2xl transition-all duration-300 hover:shadow-3xl hover:from-primary/90 hover:to-primary/70 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-2 focus:ring-offset-transparent transform hover:scale-105"
            >
              <span className="whitespace-nowrap">Check Availability</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Beautiful Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full mx-auto transform animate-scale-in">
            {/* Header */}
            <div className="relative p-6 text-center border-b border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Required Information
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {popupMessage}
              </p>
            </div>

            {/* Footer */}
            <div className="p-6 flex justify-center">
              <button
                onClick={() => setShowPopup(false)}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:ring-offset-2 transform hover:scale-105"
              >
                Got it
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
