"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

type FormState = {
  email: string;
  password: string;
  remember: boolean;
};

export default function LoginPage(): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    remember: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (value: string) => {
    // Simple, pragmatic email validation for UX (not a substitute for server-side validation)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Client-side sanity checks to improve UX
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      // Replace with your real auth endpoint. This demonstrates a typical POST call.
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          remember: form.remember,
        }),
      });

      const payload = await res.json();

      if (!res.ok) {
        throw new Error(payload?.message || "Authentication failed");
      }

      // On success — pragmatic routing to dashboard. Replace with your canonical route.
      router.push(payload?.redirect || "/dashboard");
    } catch (err: any) {
      setError(
        err?.message ?? "An unexpected error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <section className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your corporate credentials to continue.
          </p>
        </header>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-invalid={!!error}
              aria-describedby="email-note"
            />
            <p id="email-note" className="mt-1 text-xs text-gray-400">
              We use your corporate email for account lookup.
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <a
                href="/forgot-password"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="remember" className="text-sm text-gray-600">
              Remember me on this device
            </label>
          </div>

          <div>
            <button
              type="submit"
              className="w-full inline-flex justify-center items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <svg
                  className="-ml-1 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  ></path>
                </svg>
              ) : null}

              <span>{loading ? "Signing in..." : "Sign in"}</span>
            </button>
          </div>

          <div className="pt-2">
            <p className="text-center text-sm text-gray-500">
              Or continue with
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                {/* Icon placeholder - replace with provider SVGs */}
                <span>Google</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span>Microsoft</span>
              </button>
            </div>
          </div>
        </form>

        <footer className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 hover:underline">
            Sign up
          </a>
        </footer>
      </section>
    </main>
  );
}
