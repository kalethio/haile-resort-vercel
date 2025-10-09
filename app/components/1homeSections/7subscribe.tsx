// app/components/7subscribe.tsx
"use client";

import { useState } from "react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // conservative heuristic fallback name derivation (used only if you want a name)
  const deriveNameFromEmail = (email: string) => {
    const local = (email || "").split("@")[0] || "";
    // replace separators and digits, collapse spaces
    const cleaned = local
      .replace(/[\d_+.-]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!cleaned) return undefined;
    return cleaned
      .split(" ")
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const name = deriveNameFromEmail(email);
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const payload = await res.json();
      if (!res.ok)
        throw new Error(
          payload.error || payload.message || "Subscription failed"
        );

      setMessage(payload.message || "Subscribed successfully.");
      setEmail("");
    } catch (err: any) {
      console.error("Subscribe error:", err);
      setMessage(err.message || "Failed to subscribe.");
    } finally {
      setLoading(false);
    }
  };

  // LAYOUT KEPT EXACTLY AS REQUESTED
  return (
    <section className="py-12 my-24 bg-gradient-to-t from-primary/50 to-primary/90 text-text">
      <div className="max-w-md mx-auto text-center px-4">
        {/* Headline (single line) */}
        <h2 className="text-2xl sm:text-3xl font-light">Get Exclusive Deals</h2>

        {/* Subtext */}
        <p className="mt-2 text-sm">
          Be the first to receive exclusive offers, seasonal packages, and
          member-only perks straight to your inbox.
        </p>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 w-full flex-1 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-bg bg-white placeholder-gray-400"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            type="submit"
            className="bg-bg text-primary px-6 py-3 rounded-lg font-semibold hover:bg-text cursor-pointer transition-all shadow-md"
            disabled={loading}
          >
            {loading ? "Subscribing..." : "Subscribe"}
          </button>
        </form>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </section>
  );
}
