"use client";
export default function Subscription() {
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
          onSubmit={(e) => e.preventDefault()}
          className="mt-6 flex flex-col sm:flex-row items-center gap-3"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="p-3 w-full flex-1 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-bg bg-white placeholder-gray-400"
            required
          />
          <button
            type="submit"
            className="bg-bg text-primary px-6 py-3 rounded-lg font-semibold hover:bg-text cursor-pointer transition-all shadow-md"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
