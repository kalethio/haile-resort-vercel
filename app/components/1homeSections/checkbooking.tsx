"use client";
import React, { useState, useEffect } from "react";

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
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState<number>(2);

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        if (response.ok) {
          const data = await response.json();
          setBranches(data);
          // Set default branch to first one's name
          if (data.length > 0) {
            setBranch(data[0].branchName);
          }
        }
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };

    fetchBranches();
  }, []);

  // Ensure hydration-safe date initialization
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    setCheckin(today.toISOString().slice(0, 10));
    setCheckout(tomorrow.toISOString().slice(0, 10));
  }, []);

  return (
    <form
      className="text-text"
      onSubmit={(e) => {
        e.preventDefault();
        alert(
          `Booking: ${branch} | ${checkin} → ${checkout} | ${guests} guests`
        );
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {/* Branch select */}
        <div className="flex flex-col w-full sm:w-40">
          <label htmlFor="branch-select" className="text-xs font-medium mb-1">
            Branch
          </label>
          <select
            id="branch-select"
            aria-label="Select branch"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          >
            {branches.map((b) => (
              <option key={b.slug} value={b.branchName} className="text-black">
                {b.branchName}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in & Check-out */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div className="flex flex-col">
            <label htmlFor="checkin" className="text-xs font-medium mb-1">
              Check-in
            </label>
            <input
              id="checkin"
              type="date"
              aria-label="Check-in date"
              value={checkin}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="checkout" className="text-xs font-medium mb-1">
              Check-out
            </label>
            <input
              id="checkout"
              type="date"
              aria-label="Check-out date"
              value={checkout}
              min={checkin}
              onChange={(e) => setCheckout(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
        </div>

        {/* Guests dropdown (desktop) */}
        <div className="hidden sm:flex flex-col">
          <label htmlFor="guests" className="text-xs font-medium mb-1">
            Guests
          </label>
          <select
            id="guests"
            aria-label="Number of guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={`desktop-${n}`} value={n} className="text-black">
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="mt-2 cursor-pointer sm:mt-0 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          Book Now
        </button>
      </div>

      {/* Guests dropdown (mobile) */}
      <div className="mt-3 block sm:hidden flex flex-col">
        <label htmlFor="guests-mobile" className="text-xs font-medium mb-1">
          Guests
        </label>
        <select
          id="guests-mobile"
          aria-label="Number of guests (mobile)"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={`mobile-${n}`} value={n} className="text-black">
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
