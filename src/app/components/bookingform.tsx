"use client";
import { useState } from "react";

export default function BookingForm() {
  const [guests, setGuests] = useState(2);

  return (
    <form className="space-y-6">
      {/* Destination */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Destination
        </label>
        <select className="mt-2 w-full p-3 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-primary outline-none">
          <option>Addis Ababa</option>
          <option>Hawassa</option>
          <option>Arba Minch</option>
          <option>Bahir Dar</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Check-In
          </label>
          <input
            type="date"
            className="mt-2 w-full p-3 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Check-Out
          </label>
          <input
            type="date"
            className="mt-2 w-full p-3 rounded-xl bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Guests
        </label>
        <div className="mt-2 flex items-center gap-4">
          <button
            type="button"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="px-3 py-2 bg-gray-200 rounded-full text-lg hover:bg-primary hover:text-white transition"
          >
            -
          </button>
          <span className="text-lg font-medium">{guests}</span>
          <button
            type="button"
            onClick={() => setGuests(guests + 1)}
            className="px-3 py-2 bg-gray-200 rounded-full text-lg hover:bg-primary hover:text-white transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
        />
        <input
          type="email"
          placeholder="Email Address"
          className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
        />
      </div>
      <input
        type="tel"
        placeholder="Phone Number"
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
      />

      {/* Special Requests */}
      <textarea
        placeholder="Special Requests"
        className="w-full p-3 rounded-xl bg-gray-100 border border-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-primary outline-none"
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-lg transition"
      >
        Confirm Booking
      </button>
    </form>
  );
}
