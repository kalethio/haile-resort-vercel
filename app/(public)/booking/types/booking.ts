"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { DateRange } from "react-date-range";
import { addDays, format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Branch {
  slug: string;
  branchName: string;
}

export default function CheckBooking() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branch, setBranch] = useState<string>("");
  const [branchSlug, setBranchSlug] = useState<string>("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const router = useRouter();
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateButtonRef = useRef<HTMLDivElement>(null);

  // Date range state
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection"
  });

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  // Format date for display
  const formatDisplayDate = (date: Date) => {
    return format(date, "MMM dd");
  };

  // Calculate nights
  const calculateNights = () => {
    const start = dateRange.startDate;
    const end = dateRange.endDate;
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Fetch branches
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

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBranchName = e.target.value;
    const selectedBranch = branches.find((b) => b.branchName === selectedBranchName);
    setBranch(selectedBranchName);
    setBranchSlug(selectedBranch?.slug || "");
  };

  const showErrorPopup = (message: string) => {
    setPopupMessage(message);
    setShowPopup(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!branchSlug || !dateRange.startDate || !dateRange.endDate) {
      showErrorPopup("Please fill in all required fields");
      return;
    }
    const params = new URLSearchParams({
      branch: branchSlug,
      checkIn: format(dateRange.startDate, "yyyy-MM-dd"),
      checkOut: format(dateRange.endDate, "yyyy-MM-dd"),
      adults: adults.toString(),
      children: children.toString(),
    });
    router.push(`/booking?${params.toString()}`);
  };

  const updateGuests = (type: 'adults' | 'children', delta: number) => {
    if (type === 'adults') {
      const newValue = Math.max(1, adults + delta);
      setAdults(newValue);
    } else {
      const newValue = Math.max(0, children + delta);
      setChildren(newValue);
    }
  };

  const nights = calculateNights();

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-end">
          {/* Destination */}
          <div className="w-full lg:flex-[1.8]">
            <label htmlFor="branch-select" className="block text-sm font-medium text-accent mb-1">
              Destination
            </label>
            <div className={`relative rounded-xl border-2 transition-all duration-300 ${
              focusedField === "branch" ? "border-primary bg-white/20 shadow-lg" : "border-white/30 bg-white/15 hover:bg-white/20"
            }`}>
              <select
                id="branch-select"
                value={branch}
                onChange={handleBranchChange}
                onFocus={() => setFocusedField("branch")}
                onBlur={() => setFocusedField(null)}
                className="w-full bg-transparent py-2.5 px-3 text-white outline-none appearance-none cursor-pointer text-sm"
              >
                {branches.map((b) => (
                  <option key={b.slug} value={b.branchName} className="text-black">
                    {b.branchName}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dates with Calendar - Fixed positioning */}
          <div className="w-full lg:flex-[1.6] relative" ref={calendarRef}>
            <label className="block text-sm font-medium text-accent mb-1">
              Dates {nights > 0 && <span className="text-primary">({nights} night{nights !== 1 ? 's' : ''})</span>}
            </label>
            <div 
              ref={dateButtonRef}
              className={`relative rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                focusedField === "dates" ? "border-primary bg-white/20 shadow-lg" : "border-white/30 bg-white/15 hover:bg-white/20"
              }`}
              onClick={() => {
                setShowCalendar(!showCalendar);
                setFocusedField("dates");
              }}
            >
              <div className="py-2.5 px-3 text-white">
                <div className="flex items-center justify-between">
                  <div className="text-center flex-1">
                    <div className="text-sm font-medium">{formatDisplayDate(dateRange.startDate)}</div>
                    <div className="text-xs text-white/70">Check-in</div>
                  </div>
                  <div className="mx-2 text-white/50 text-sm">→</div>
                  <div className="text-center flex-1">
                    <div className="text-sm font-medium">{formatDisplayDate(dateRange.endDate)}</div>
                    <div className="text-xs text-white/70">Check-out</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Popup - Fixed positioning */}
            {showCalendar && (
              <div className="fixed lg:absolute z-50 top-20 lg:top-full left-1/2 lg:left-0 transform -translate-x-1/2 lg:translate-x-0 mt-2">
                <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 w-[90vw] lg:w-[560px] max-w-[560px]">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item: any) => setDateRange(item.selection)}
                    moveRangeOnFirstSelection={false}
                    ranges={[dateRange]}
                    minDate={new Date()}
                    months={2}
                    direction="horizontal"
                    rangeColors={["#F97316"]}
                    className="w-full"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="button"
                      onClick={() => setShowCalendar(false)}
                      className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Guests */}
          <div className="w-full lg:flex-1">
            <label className="block text-sm font-medium text-accent mb-1">Guests</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateGuests('adults', -1)}
                    disabled={adults <= 1}
                    className="w-6 h-6 rounded-lg border border-white/30 bg-white/15 flex items-center justify-center disabled:opacity-30 hover:bg-white/20 transition-all"
                  >
                    <span className="text-white text-xs">−</span>
                  </button>
                  <span className="text-white font-medium text-sm min-w-5 text-center">{adults}</span>
                  <button
                    type="button"
                    onClick={() => updateGuests('adults', 1)}
                    className="w-6 h-6 rounded-lg border border-white/30 bg-white/15 flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <span className="text-white text-xs">+</span>
                  </button>
                </div>
                <span className="text-white text-xs">Adults</span>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateGuests('children', -1)}
                    disabled={children <= 0}
                    className="w-6 h-6 rounded-lg border border-white/30 bg-white/15 flex items-center justify-center disabled:opacity-30 hover:bg-white/20 transition-all"
                  >
                    <span className="text-white text-xs">−</span>
                  </button>
                  <span className="text-white font-medium text-sm min-w-5 text-center">{children}</span>
                  <button
                    type="button"
                    onClick={() => updateGuests('children', 1)}
                    className="w-6 h-6 rounded-lg border border-white/30 bg-white/15 flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <span className="text-white text-xs">+</span>
                  </button>
                </div>
                <span className="text-white text-xs">Children</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="w-full lg:flex-[0.8]">
            <label className="block text-sm font-medium text-transparent mb-1">Check</label>
            <button
              type="submit"
              className="w-full cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary/80 px-3 py-2.5 text-white font-semibold text-sm shadow-xl transition-all duration-300 hover:shadow-2xl hover:from-primary/90 hover:to-primary/70 transform hover:scale-105"
            >
              <span>Check</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {/* Error Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl max-w-md w-full mx-auto">
            <div className="relative p-6 text-center border-b border-gray-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Required Information</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{popupMessage}</p>
            </div>
            <div className="p-6 flex justify-center">
              <button
                onClick={() => setShowPopup(false)}
                className="px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}