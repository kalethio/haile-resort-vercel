// app/booking/confirmation/page.tsx
import { Suspense } from "react";
import BookingConfirmationContent from "./BookingConfirmationContent";

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<ConfirmationSkeleton />}>
      <BookingConfirmationContent />
    </Suspense>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-8 h-8 bg-gray-300 rounded"></div>
          </div>

          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-6 animate-pulse"></div>

          <div className="h-16 bg-gray-100 rounded-lg mb-6 animate-pulse"></div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="h-12 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
            <div className="h-12 bg-gray-200 rounded-lg w-40 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
