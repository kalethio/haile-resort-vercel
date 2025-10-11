"use client";

import { useEffect, useState } from "react";
import { ReviewType } from "../../data/review";

export default function Review() {
  // State to store the list of approved reviews
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  // State for review form input fields
  const [form, setForm] = useState({ name: "", text: "" });
  // State to indicate if the form is currently submitting
  const [submitting, setSubmitting] = useState(false);
  // State to indicate if the review has been successfully submitted
  const [submitted, setSubmitted] = useState(false);

  // Load reviews when component mounts
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/review"); // Fetch reviews from API
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ReviewType[] = await res.json();
        // Only display reviews that have been approved by admin
        setReviews(data.filter((r) => r.approved));
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  // Handle review form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); // Set submitting state to true while request is ongoing

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // Send form data to API
      });

      if (!res.ok) {
        // If server returns error, read message for debugging
        const text = await res.text().catch(() => "");
        throw new Error(text || `Submit failed (${res.status})`);
      }

      // Reset form and show success message
      setForm({ name: "", text: "" });
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      alert("Failed to submit review: " + (err.message || "Unknown error"));
    } finally {
      setSubmitting(false); // Always reset submitting state
    }
  };

  return (
    <section id="reviews" className="relative py-4 mb-24">
      {/* Background gradient for premium look */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
      {/* Noise overlay for texture */}
      <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10 mix-blend-overlay" />

      <div className="relative max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-16">
        {/* LEFT: Scrolling testimonials section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="overflow-hidden relative w-full max-w-2xl">
            <div className="flex w-max animate-marquee">
              {/* Duplicate reviews for smooth looping marquee effect */}
              {[...reviews, ...reviews].map((r, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur p-3 rounded-xl shadow-sm min-w-[240px] max-w-xs mx-3 border border-black/5"
                >
                  {/* Review text */}
                  <p className="italic mb-2 text-sm text-accent/90">
                    “{r.text}”
                  </p>
                  {/* Reviewer name */}
                  <p className="font-semibold text-xs text-primary">
                    - {r.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Floating review submission form */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-xs bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow border border-black/10">
            <h3 className="text-sm font-semibold text-primary mb-3 tracking-wide uppercase">
              Share Your Experience
            </h3>

            {/* Show thank-you message if review submitted */}
            {submitted ? (
              <div className="text-sm text-primary text-success">
                ✅ Thanks for sharing your experience.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-black space-y-3">
                {/* Name input */}
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                  required
                />
                {/* Review text input */}
                <textarea
                  rows={2}
                  placeholder="Your Review"
                  value={form.text}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  className="w-full border border-black/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/40"
                  required
                />
                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition disabled:opacity-60"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Tailwind keyframes for marquee animation */}
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
