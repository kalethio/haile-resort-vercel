"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Branch {
  slug: string;
  branchName: string;
}

export default function CheckBooking() {
  const router = useRouter();

  // Branches
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branch, setBranch] = useState("");
  const [branchSlug, setBranchSlug] = useState("");

  // Guests
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Focus & modals
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  // Date range
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });

  const formatDate = (date: Date) => format(date, "MMM dd");
  const calculateNights = () =>
    Math.ceil(
      (selectionRange.endDate.getTime() - selectionRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

  // Fetch branches
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/branches");
        if (!res.ok) throw new Error("Failed to fetch branches");
        const data = await res.json();
        setBranches(data);
        if (data.length) {
          setBranch(data[0].branchName);
          setBranchSlug(data[0].slug);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = branches.find((b) => b.branchName === e.target.value);
    setBranch(e.target.value);
    setBranchSlug(selected?.slug || "");
  };

  const handleGuestChange = (type: "adults" | "children", delta: number) => {
    if (type === "adults") setAdults(Math.max(1, adults + delta));
    else setChildren(Math.max(0, children + delta));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!branchSlug || !selectionRange.startDate || !selectionRange.endDate) {
      setPopupMessage("Please fill in all required fields");
      setShowPopup(true);
      return;
    }

    const totalGuests = adults + children;
    if (isNaN(totalGuests) || totalGuests > 3) {
      setPopupMessage(`❌ Max 3 guests (you have ${totalGuests || 0})`);
      setShowPopup(true);
      return;
    }

    const params = new URLSearchParams({
      branch: branchSlug,
      checkIn: format(selectionRange.startDate, "yyyy-MM-dd"),
      checkOut: format(selectionRange.endDate, "yyyy-MM-dd"),
      adults: adults.toString(),
      children: children.toString(),
    });

    router.push(`/booking?${params.toString()}`);
  };

  const nights = calculateNights();

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-fit max-w-[80vw] mx-auto mt-8 sm:mt-12 p-6 bg-primary/15 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
      >
        <div className="flex flex-col lg:flex-row gap-4 items-center lg:items-end">
          {/* Destination */}
          <div className="w-fit lg:flex-[1.5]">
            <label
              htmlFor="branch-select"
              className="block text-sm font-semibold text-accent mb-3 tracking-wide uppercase text-opacity-90"
            >
              Where
            </label>
            <div
              className={`relative rounded-xl border-2 h-12 flex items-center min-w-[150px] transition-all duration-300 ${
                focusedField === "branch"
                  ? "border-primary bg-white/25 shadow-lg"
                  : "border-white/40 bg-white/15 hover:bg-white/20"
              }`}
            >
              <select
                id="branch-select"
                value={branch}
                onChange={handleBranchChange}
                onFocus={() => setFocusedField("branch")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent px-4 text-white outline-none appearance-none cursor-pointer h-full font-medium"
              >
                {branches.map((b) => (
                  <option
                    key={b.slug}
                    value={b.branchName}
                    className="text-black font-medium"
                  >
                    {b.branchName}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-white/80"
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

          {/* Dates */}
          <div className="w-fit lg:flex-[1.5]">
            <label className="block text-sm font-semibold text-accent mb-3 tracking-wide uppercase text-opacity-90">
              When{" "}
              {nights > 0 && (
                <span className="text-accent font-bold">
                  • {nights} Night{nights !== 1 && "s"}
                </span>
              )}
            </label>
            <div
              className={`relative rounded-xl border-2 h-12 flex items-center cursor-pointer w-fit transition-all duration-300 ${
                focusedField === "dates"
                  ? "border-primary bg-white/25 shadow-lg"
                  : "border-white/40 bg-white/15 hover:bg-white/20"
              }`}
              onClick={() => setShowCalendar(true)}
            >
              <div className="flex justify-between w-full px-4 text-white min-w-[220px]">
                <div className="text-center flex-1">
                  <div className="text-sm font-semibold">
                    {formatDate(selectionRange.startDate)}
                  </div>
                  <div className="text-xs text-white/80 font-medium">
                    Arrival
                  </div>
                </div>
                <div className="mx-3 text-white/60 text-lg font-light self-center">
                  →
                </div>
                <div className="text-center flex-1">
                  <div className="text-sm font-semibold">
                    {formatDate(selectionRange.endDate)}
                  </div>
                  <div className="text-xs text-white/80 font-medium">
                    Departure
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Guests */}
          <div className="w-fit lg:flex-[1.2] flex gap-3">
            <div className="flex flex-col">
              <label className="block text-sm font-semibold text-accent mb-3 tracking-wide uppercase text-opacity-90">
                Guests
              </label>
              <div className="flex gap-3">
                {["adults", "children"].map((type) => {
                  const isAdult = type === "adults";
                  const value = isAdult ? adults : children;
                  const icon = isAdult ? "👤" : "👶";
                  return (
                    <div
                      key={type}
                      className="flex items-center gap-3 bg-white/15 rounded-xl border-2 border-white/30 px-4 h-12 justify-between min-w-[110px] hover:bg-white/20 transition-all"
                    >
                      <span className="text-white text-base">{icon}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleGuestChange(type as "adults" | "children", -1)
                          }
                          disabled={value <= (isAdult ? 1 : 0)}
                          className="w-6 h-6 rounded-lg bg-white/25 flex items-center justify-center disabled:opacity-40 hover:bg-white/35 transition-all font-medium"
                        >
                          −
                        </button>
                        <span className="text-white font-bold text-base min-w-6 text-center">
                          {value}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            handleGuestChange(type as "adults" | "children", 1)
                          }
                          className="w-6 h-6 rounded-lg bg-white/25 flex items-center justify-center hover:bg-white/35 transition-all font-medium"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="w-fit lg:flex-1">
            <label className="block text-sm font-light text-transparent mb-3">
              Ready to Book
            </label>
            <button
              type="submit"
              className="w-fit h-12 px-4 py-2 inline-flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-primary to-primary/90 text-white font-bold text-base shadow-2xl hover:shadow-3xl hover:from-primary hover:to-primary transform hover:scale-105 transition-all duration-300 uppercase tracking-wide"
            >
              BOOK NOW
            </button>
          </div>
        </div>
      </form>

      {/* Compact Calendar Modal */}
      {showCalendar && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowCalendar(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Select Dates</h3>
              <button
                onClick={() => setShowCalendar(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Date Inputs */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Date
                </label>
                <input
                  type="date"
                  min={format(new Date(), "yyyy-MM-dd")}
                  value={format(selectionRange.startDate, "yyyy-MM-dd")}
                  onChange={(e) =>
                    setSelectionRange((prev) => ({
                      ...prev,
                      startDate: new Date(e.target.value),
                      endDate:
                        new Date(e.target.value) > prev.endDate
                          ? new Date(e.target.value)
                          : prev.endDate,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Date
                </label>
                <input
                  type="date"
                  min={format(selectionRange.startDate, "yyyy-MM-dd")}
                  value={format(selectionRange.endDate, "yyyy-MM-dd")}
                  onChange={(e) =>
                    setSelectionRange((prev) => ({
                      ...prev,
                      endDate: new Date(e.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Night Count & Apply Button */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">
                  {nights} night{nights !== 1 ? "s" : ""}
                </span>{" "}
                selected
              </div>
              <button
                onClick={() => setShowCalendar(false)}
                className="px-6 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-lg"
              >
                Apply Dates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Popup */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full mx-auto">
            <div className="p-6 text-center border-b border-gray-100">
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
                Complete Your Booking
              </h3>
              <p className="text-gray-600 font-medium">{popupMessage}</p>
            </div>
            <div className="p-6 flex justify-center">
              <button
                onClick={() => setShowPopup(false)}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 uppercase tracking-wide"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
