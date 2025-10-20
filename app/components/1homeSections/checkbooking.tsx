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
  const [branchSlug, setBranchSlug] = useState<string>(""); // Store slug for URL
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState<number>(2);
  const router = useRouter();

  // Fetch branches from API
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        if (response.ok) {
          const data = await response.json();
          setBranches(data);
          // Set default branch to first one
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

  // Ensure hydration-safe date initialization
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

  // Handle form submission - redirect to booking page
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!branchSlug || !checkin || !checkout) {
      alert("Please fill in all required fields");
      return;
    }

    // Redirect to booking page with parameters
    const params = new URLSearchParams({
      branch: branchSlug,
      checkIn: checkin,
      checkOut: checkout,
      guests: guests.toString(),
    });

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <form className="text-bg" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
        {/* Branch select - Mobile ultra compact */}
        <div className="flex flex-col w-full sm:w-48">
          <label htmlFor="branch-select" className="text-xs font-medium mb-1">
            Branch
          </label>
          <select
            id="branch-select"
            aria-label="Select branch"
            value={branch}
            onChange={handleBranchChange}
            className="w-full rounded-lg border border-white/10 bg-white/6 py-1.5 px-2 text-xs outline-none focus:ring-1 focus:ring-primary/40"
          >
            {branches.map((b) => (
              <option key={b.slug} value={b.branchName} className="text-black">
                {b.branchName}
              </option>
            ))}
          </select>
        </div>

        {/* Ultra compact date layout for mobile */}
        <div className="flex-1">
          <label className="text-xs font-medium mb-1 block">Dates</label>
          <div className="grid grid-cols-2 gap-1">
            <div className="flex flex-col">
              <input
                type="date"
                aria-label="Check-in date"
                value={checkin}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setCheckin(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/6 py-1 px-1.5 text-[10px] outline-none focus:ring-1 focus:ring-primary/40"
                title="Check-in Date"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 text-center">
                Check-in
              </span>
            </div>
            <div className="flex flex-col">
              <input
                type="date"
                aria-label="Check-out date"
                value={checkout}
                min={checkin}
                onChange={(e) => setCheckout(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/6 py-1 px-1.5 text-[10px] outline-none focus:ring-1 focus:ring-primary/40"
                title="Check-out Date"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 text-center">
                Check-out
              </span>
            </div>
          </div>
        </div>

        {/* Guests dropdown (desktop) */}
        <div className="hidden sm:flex flex-col">
          <label htmlFor="guests" className="text-sm font-medium mb-2">
            Guests
          </label>
          <select
            id="guests"
            aria-label="Number of guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-white/6 py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 min-w-24"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={`desktop-${n}`} value={n} className="text-black">
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button - Mobile compact and moved to end */}
        <button
          type="submit"
          className="mt-1 cursor-pointer sm:mt-0 inline-flex items-center justify-center gap-1 rounded-full bg-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:brightness-90 focus:outline-none focus:ring-1 focus:ring-primary/40 min-w-16 order-last"
        >
          Book Now
        </button>
      </div>

      {/* Guests dropdown (mobile) - Ultra compact */}
      <div className="mt-2 block sm:hidden flex flex-col">
        <label htmlFor="guests-mobile" className="text-xs font-medium mb-1">
          Guests
        </label>
        <select
          id="guests-mobile"
          aria-label="Number of guests (mobile)"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-lg border border-white/10 bg-white/6 py-1.5 px-2 text-xs outline-none focus:ring-1 focus:ring-primary/40"
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
