import React from "react";
import { Search } from "lucide-react";
import BookingCard from "./BookingCard";
import { Booking, Filters, PaginationInfo } from "./types";

interface BookingsGridProps {
  bookings: Booking[];
  filters: Filters;
  pagination: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefresh: (showRefresh?: boolean, page?: number) => void;
}

const BookingsGrid: React.FC<BookingsGridProps> = ({
  bookings,
  filters,
  pagination,
  loading,
  onPageChange,
  onRefresh,
}) => {
  // Filter bookings based on current filters
  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      filters.status === "all" || booking.status === filters.status;
    const matchesSearch = filters.search
      ? booking.guestName
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        booking.guestEmail
          .toLowerCase()
          .includes(filters.search.toLowerCase()) ||
        booking.id.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesDateRange =
      !filters.dateRange.start ||
      !filters.dateRange.end ||
      (new Date(booking.checkIn) >= new Date(filters.dateRange.start) &&
        new Date(booking.checkOut) <= new Date(filters.dateRange.end));

    return matchesStatus && matchesSearch && matchesDateRange;
  });

  if (loading) return <BookingsGridSkeleton />;

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-gray-900 text-lg">
              {filters.status === "all" ? "All Bookings" : filters.status}
            </h3>
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
              {filteredBookings.length}{" "}
              {filteredBookings.length === 1 ? "booking" : "bookings"}
            </span>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bookings List */}
      <div className="p-4">
        {filteredBookings.length === 0 ? (
          <EmptyState
            hasFilters={
              !!filters.search ||
              filters.status !== "all" ||
              filters.dateRange.start
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusChange={(bookingId, newStatus) => {
                  // Handle status change - you'll need to implement this
                  console.log("Status change:", bookingId, newStatus);
                }}
                onRefresh={onRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const BookingsGridSkeleton = () => (
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
);

const EmptyState = ({ hasFilters }: { hasFilters: boolean }) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <Search className="text-gray-400" size={24} />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">
      {hasFilters ? "No matching bookings found" : "No bookings available"}
    </h3>
    <p className="text-gray-500 max-w-sm mx-auto">
      {hasFilters
        ? "Try adjusting your search criteria or filters to see more results."
        : "When you have new reservations, they will appear here."}
    </p>
  </div>
);

export default BookingsGrid;
