// app/error.tsx
"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-20 h-20 border-4 border-red-300 border-t-red-600 rounded-full animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          We apologize for the inconvenience. Please try again.
        </p>
        <button
          onClick={reset}
          className="bg-premium text-white px-6 py-3 rounded-lg hover:bg-premium/90 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
