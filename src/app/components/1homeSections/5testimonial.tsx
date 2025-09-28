"use client";

import { useState } from "react";

export default function Review() {
  const [reviews, setReviews] = useState([
    { text: "Incredible experience, I’ll be back!", name: "John Smith" },
    {
      text: "The rooms were spotless and service top-notch.",
      name: "Maria Garcia",
    },
    { text: "Best family vacation we’ve ever had!", name: "Lee Wong" },
    { text: "Exceptional service and stunning views!", name: "Sara Ibrahim" },
    { text: "The spa and wellness center was heavenly.", name: "David Kim" },
  ]);
  const [form, setForm] = useState({ name: "", text: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.text) return;
    setReviews([...reviews, { ...form }]);
    setForm({ name: "", text: "" });
  };

  return (
    <section id="reviews" className="relative py-4 mb-24">
      {/* Premium Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />
      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        {/* LEFT: Scrolling Testimonials */}
        <div className="flex-1 flex items-center justify-center">
          <div className="overflow-hidden relative w-full max-w-2xl">
            <div className="flex w-max animate-marquee">
              {[...reviews, ...reviews].map((r, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur p-3 rounded-xl shadow-sm min-w-[240px] max-w-xs mx-3 border border-black/5"
                >
                  <p className="italic mb-2 text-sm text-accent/90">
                    “{r.text}”
                  </p>
                  <p className="font-semibold text-xs text-primary">
                    - {r.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Minimal Floating Review Form */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xs bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow border border-black/10">
            <h3 className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
              Share Your Experience
            </h3>
            <form onSubmit={handleSubmit} className="text-black space-y-3">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                required
              />
              <textarea
                rows={2}
                placeholder="Your Review"
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
                className="w-full border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                required
              />
              <button
                type="submit"
                className="w-full bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Tailwind Keyframes */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
