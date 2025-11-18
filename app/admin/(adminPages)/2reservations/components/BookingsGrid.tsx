import React, { useState } from "react";
import { Search, AlertCircle, RefreshCw } from "lucide-react";
import BookingCard from "./BookingCard";
import { Booking, Filters, PaginationInfo } from "./types";

interface BookingsGridProps {
  bookings: Booking[];
  filters: Filters;
  pagination: PaginationInfo;
  loading: boolean;
  error?: string;
  onPageChange: (page: number) => void;
  onRefresh: (showRefresh?: boolean, page?: number) => void;
  onStatusChange?: (bookingId: string, newStatus: string) => Promise<void>;
}

const BookingsGrid: React.FC<BookingsGridProps> = ({
  bookings,
  filters,
  pagination,
  loading,
  error,
  onPageChange,
  onRefresh,
  onStatusChange,
}) => {
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdatingBooking(bookingId);
    try {
      const res = await fetch(`/api/admin/booking`, {
        method: "POST", // ← CHANGE FROM PATCH TO POST
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          status: newStatus,
        }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      onRefresh(false, pagination.currentPage);
    } catch (error) {
      console.error("Failed to update booking status:", error);
    } finally {
      setUpdatingBooking(null);
    }
  };
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh(true, pagination.currentPage);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Failed to load bookings
        </h3>
        <p className="text-gray-500 mb-4">{error}</p>
        <button
          onClick={() => onRefresh(true, pagination.currentPage)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (loading) return <BookingsGridSkeleton />;

  const displayBookings = bookings; // Use server-filtered data directly

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {filters.status === "all" ? "All Bookings" : filters.status}
            </h3>
            <span
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium"
              aria-live="polite"
            >
              {pagination.totalItems}{" "}
              {pagination.totalItems === 1 ? "booking" : "bookings"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh bookings"
              aria-label="Refresh bookings"
            >
              <RefreshCw
                size={16}
                className={`text-gray-600 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <nav aria-label="Booking pagination">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onPageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm"
                    aria-label="Previous page"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 min-w-[100px] text-center">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => onPageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4">
        {displayBookings.length === 0 ? (
          <EmptyState
            hasFilters={
              !!filters.search ||
              filters.status !== "all" ||
              !!filters.dateRange.start
            }
            onClearFilters={() => onRefresh(true, 1)}
          />
        ) : (
          <div
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            role="list"
            aria-label="Bookings list"
          >
            {displayBookings.map((booking) => (
              <div key={booking.id} role="listitem">
                <BookingCard
                  booking={booking}
                  onStatusChange={handleStatusChange}
                  onRefresh={onRefresh}
                  isLoading={updatingBooking === booking.id}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Pagination for mobile */}
      {pagination.totalPages > 1 && (
        <div className="p-4 border-t border-gray-200 sm:hidden">
          <nav aria-label="Booking pagination mobile">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev || loading}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm flex-1 mr-2"
                aria-label="Previous page"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 mx-2">
                {pagination.currentPage}/{pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext || loading}
                className="px-4 py-2 border border-gray-300 rounded disabled:opacity-50 hover:bg-gray-50 transition-colors text-sm flex-1 ml-2"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};

const BookingsGridSkeleton = () => (
  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
    {/* Header Skeleton */}
    <div className="p-4 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
      </div>
    </div>

    {/* Cards Skeleton */}
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-4 bg-white animate-pulse"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-4/5"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="flex gap-2 pt-3">
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
              <div className="h-8 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EmptyState = ({
  hasFilters,
  onClearFilters,
}: {
  hasFilters: boolean;
  onClearFilters?: () => void;
}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="text-gray-400" size={24} />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {hasFilters ? "No matching bookings found" : "No bookings available"}
    </h3>
    <p className="text-gray-500 max-w-sm mx-auto mb-4">
      {hasFilters
        ? "Try adjusting your search criteria or filters to see more results."
        : "When you have new reservations, they will appear here."}
    </p>
    {hasFilters && onClearFilters && (
      <button
        onClick={onClearFilters}
        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
      >
        Clear all filters
      </button>
    )}
  </div>
);

export default BookingsGrid;
