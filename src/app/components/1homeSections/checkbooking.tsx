"use client";
import React, { useState } from "react";
import { DATA } from "./1herosection"; // import branch data

type Branch = (typeof DATA)["branches"][number];

export default function CheckBooking() {
  const { branches } = DATA;

  // Booking state
  const [branch, setBranch] = useState<Branch>(branches[0]);
  const [checkin, setCheckin] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [checkout, setCheckout] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [guests, setGuests] = useState<number>(2);

  return (
    <form
      className="mt-8 w-full rounded-2xl bg-white/8 backdrop-blur-sm p-4 shadow-lg max-w-lg"
      onSubmit={(e) => {
        e.preventDefault();
        alert(
          `Booking: ${branch.display} | ${checkin} → ${checkout} | ${guests} guests`
        );
      }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
        {/* Branch select */}
        <div className="flex flex-col w-full sm:w-40">
          <label
            htmlFor="branch-select"
            className="text-xs font-medium text-white mb-1"
          >
            Branch
          </label>
          <select
            id="branch-select"
            value={branch.slug}
            onChange={(e) =>
              setBranch(
                branches.find((b) => b.slug === e.target.value) || branches[0]
              )
            }
            className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-300"
          >
            {branches.map((b) => (
              <option key={b.slug} value={b.slug} className="text-black">
                {b.display}
              </option>
            ))}
          </select>
        </div>

        {/* Check-in & Check-out */}
        <div className="grid grid-cols-2 gap-2 flex-1">
          <div className="flex flex-col">
            <label
              htmlFor="checkin"
              className="text-xs font-medium text-white mb-1"
            >
              Check-in
            </label>
            <input
              id="checkin"
              type="date"
              value={checkin}
              min={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setCheckin(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="checkout"
              className="text-xs font-medium text-white mb-1"
            >
              Check-out
            </label>
            <input
              id="checkout"
              type="date"
              value={checkout}
              min={checkin}
              onChange={(e) => setCheckout(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-300"
            />
          </div>
        </div>

        {/* Guests dropdown (desktop) */}
        <div className="hidden sm:flex flex-col">
          <label
            htmlFor="guests"
            className="text-xs font-medium text-white mb-1"
          >
            Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-300"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n} className="text-black">
                {n} {n === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="mt-2 sm:mt-0 inline-flex items-center justify-center gap-2 rounded-full bg-[#78112D] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          Book Now
        </button>
      </div>

      {/* Guests dropdown (mobile) */}
      <div className="mt-3 block sm:hidden flex flex-col">
        <label
          htmlFor="guests-mobile"
          className="text-xs font-medium text-white mb-1"
        >
          Guests
        </label>
        <select
          id="guests-mobile"
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full rounded-lg border border-white/10 bg-white/6 py-2 px-3 text-sm text-white outline-none focus:ring-2 focus:ring-yellow-300"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n} className="text-black">
              {n} {n === 1 ? "guest" : "guests"}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}
