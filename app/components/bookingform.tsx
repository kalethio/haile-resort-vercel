"use client";
import { useState } from "react";

export default function BookingForm() {
  const [guests, setGuests] = useState(2);
  const [form, setForm] = useState({
    destination: "Addis Ababa",
    checkin: "",
    checkout: "",
    name: "",
    email: "",
    phone: "",
    requests: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!form.name || !form.email || !form.phone) {
      alert("Please fill out all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      alert("Please enter a valid email.");
      return;
    }
    if (!/^\+?\d{7,15}$/.test(form.phone)) {
      alert("Please enter a valid phone number.");
      return;
    }
    if (form.checkout && form.checkin > form.checkout) {
      alert("Check-out date cannot be earlier than check-in date.");
      return;
    }

    alert(
      `Booking confirmed for ${form.name}, ${guests} guests at ${form.destination}.`
    );
  };

  return (
    <form
      className="space-y-3 text-sm text-primary max-w-md mx-auto px-4 sm:px-0"
      onSubmit={handleSubmit}
    >
      {/* Destination */}
      <div>
        <label className="block font-medium mb-0.5">Destination</label>
        <select
          name="destination"
          value={form.destination}
          onChange={handleChange}
          className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-primary/30 focus:ring-1 focus:ring-primary outline-none"
        >
          <option>Addis Ababa</option>
          <option>Hawassa</option>
          <option>Arba Minch</option>
          <option>Bahir Dar</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div>
          <label className="block font-medium mb-0.5">Check-In</label>
          <input
            type="date"
            name="checkin"
            value={form.checkin}
            onChange={handleChange}
            min={new Date().toISOString().slice(0, 10)}
            className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-primary/30 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
        <div>
          <label className="block font-medium mb-0.5">Check-Out</label>
          <input
            type="date"
            name="checkout"
            value={form.checkout}
            onChange={handleChange}
            min={form.checkin || new Date().toISOString().slice(0, 10)}
            className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-primary/30 focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block font-medium mb-0.5">Guests</label>
        <div className="mt-1 flex items-center gap-2 justify-start">
          <button
            type="button"
            onClick={() => setGuests(Math.max(1, guests - 1))}
            className="w-8 h-8 flex items-center justify-center bg-white/5 border border-primary/30 rounded-full text-primary hover:bg-primary hover:text-white transition"
          >
            -
          </button>
          <span className="text-sm font-medium">{guests}</span>
          <button
            type="button"
            onClick={() => setGuests(guests + 1)}
            className="w-8 h-8 flex items-center justify-center bg-white/5 border border-primary/30 rounded-full text-primary hover:bg-primary hover:text-white transition"
          >
            +
          </button>
        </div>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-primary/30 placeholder-primary/50 focus:ring-1 focus:ring-primary outline-none"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-primary/30 placeholder-primary/50 focus:ring-1 focus:ring-primary outline-none"
          required
        />
      </div>
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-primary/30 placeholder-primary/50 focus:ring-1 focus:ring-primary outline-none"
        required
      />

      {/* Special Requests */}
      <textarea
        name="requests"
        placeholder="Special Requests"
        value={form.requests}
        onChange={handleChange}
        className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-primary/30 placeholder-primary/50 focus:ring-1 focus:ring-primary outline-none"
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-2 rounded-lg font-medium bg-primary text-white text-sm shadow-sm hover:brightness-90 transition"
      >
        Confirm Booking
      </button>
    </form>
  );
}
