// src/app/admin/5CMS/sections/ReviewModal.tsx
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ReviewType } from "../../../../data/review";

type View = "pending" | "approved";

export default function ReviewModal() {
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const [view, setView] = useState<View>("pending");

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/review", { cache: "no-store", signal });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(
          `API responded ${res.status} ${res.statusText}${text ? ` — ${text}` : ""}`
        );
      }
      const data: ReviewType[] = await res.json();
      setReviews(data);
    } catch (err: any) {
      if (err?.name === "AbortError") return;
      console.error("Failed to load reviews:", err);
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    load(ac.signal);
    return () => ac.abort();
  }, [load]);

  const approveReview = async (id: number) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/review/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Approve failed (${res.status})`);
      }
      setReviews((r) =>
        r.map((x) => (x.id === id ? { ...x, approved: true } : x))
      );
    } catch (err: any) {
      console.error("Approve error:", err);
      alert("Failed to approve: " + (err.message ?? ""));
    } finally {
      setActionLoadingId(null);
    }
  };

  const deleteReview = async (id: number) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/review/${id}`, {
        method: "DELETE",
        cache: "no-store",
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Delete failed (${res.status})`);
      }
      setReviews((r) => r.filter((x) => x.id !== id));
    } catch (err: any) {
      console.error("Delete error:", err);
      alert("Failed to delete: " + (err.message ?? ""));
    } finally {
      setActionLoadingId(null);
    }
  };

  const pending = reviews.filter((r) => !r.approved);
  const approved = reviews.filter((r) => r.approved);

  return (
    <div className="p-4 bg-gray-50 rounded-lg">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Reviews</h3>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setView("pending")}
            className={`px-3 py-1 text-sm rounded-md transition-shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              view === "pending"
                ? "bg-[rgb(50,57,6)] text-white shadow"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
            aria-pressed={view === "pending"}
          >
            Pending ({pending.length})
          </button>

          <button
            onClick={() => setView("approved")}
            className={`px-3 py-1 text-sm rounded-md transition-shadow transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              view === "approved"
                ? "bg-[rgb(50,57,6)] text-white shadow"
                : "bg-white text-gray-700 border border-gray-200"
            }`}
            aria-pressed={view === "approved"}
          >
            Approved ({approved.length})
          </button>

          <button
            onClick={() => load()}
            className="px-2 py-1 text-xs rounded-md bg-white text-gray-700 border border-gray-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1"
            title="Refresh"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <div className="text-sm text-gray-600">Loading reviews…</div>}

      {error && (
        <div className="mb-3 text-sm text-red-700 bg-red-50 p-3 rounded">
          <div className="font-semibold text-red-800">
            Unable to load reviews
          </div>
          <div className="mt-1 font-mono text-xs break-words text-red-700">
            {error}
          </div>
        </div>
      )}

      {/* list container: max height, scrollable for long lists */}
      <div className="max-h-[48vh] overflow-y-auto -mx-1 px-1">
        <ul className="space-y-3 mt-1">
          {(view === "pending" ? pending : approved).map((r) => (
            <li
              key={r.id}
              className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
            >
              <div className="min-w-0">
                <div className="text-sm italic text-gray-800 leading-snug">
                  “{r.text}”
                </div>
                <div className="mt-2 text-xs font-semibold text-[rgb(50,57,6)]">
                  — {r.name}
                </div>
                {r.email && ( // Add email display
                  <div className="mt-1 text-xs text-gray-600">{r.email}</div>
                )}
                <div className="mt-1 text-xs text-gray-500">ID: {r.id}</div>
              </div>

              <div className="flex-shrink-0 flex items-center gap-2">
                {view === "pending" && (
                  <button
                    disabled={actionLoadingId === r.id}
                    onClick={() => approveReview(r.id)}
                    className="text-xs px-3 py-1 rounded-md bg-green-600 text-white hover:opacity-95 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-green-300"
                  >
                    {actionLoadingId === r.id ? "..." : "Approve"}
                  </button>
                )}

                <button
                  disabled={actionLoadingId === r.id}
                  onClick={() => deleteReview(r.id)}
                  className="text-xs px-3 py-1 rounded-md bg-red-600 text-white hover:opacity-95 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                  {actionLoadingId === r.id ? "..." : "Delete"}
                </button>
              </div>
            </li>
          ))}

          {/* empty states */}
          {!loading && view === "pending" && pending.length === 0 && !error && (
            <li className="text-sm text-gray-600">No pending reviews.</li>
          )}
          {!loading &&
            view === "approved" &&
            approved.length === 0 &&
            !error && (
              <li className="text-sm text-gray-600">No approved reviews.</li>
            )}
        </ul>
      </div>
    </div>
  );
}
