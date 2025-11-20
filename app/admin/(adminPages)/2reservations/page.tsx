"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import MetricsSection from "./components/MetricsSection";
import FiltersSection from "./components/FiltersSection";
import BookingsGrid from "./components/BookingsGrid";
import { Booking, Branch, PaginationInfo } from "./components/types";

export default function ReservationsPage() {
  const { data: session } = useSession();

  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filters, setFilters] = useState({
    branch: "all",
    status: "all",
    search: "",
    dateRange: { start: "", end: "" },
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });

  // Data fetching
  const fetchBookings = async (showRefresh = false, page = 1) => {
    try {
      if (showRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
      });

      if (filters.branch !== "all") params.append("branch", filters.branch);
      if (filters.search) params.append("search", filters.search);
      if (filters.status !== "all") params.append("status", filters.status);

      // ADD DATE RANGE PARAMETERS
      if (filters.dateRange.start)
        params.append("startDate", filters.dateRange.start);
      if (filters.dateRange.end)
        params.append("endDate", filters.dateRange.end);

      const res = await fetch(`/api/admin/booking?${params}`);

      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
        setPagination(data.pagination || pagination);
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/admin/branches-list");
      if (res.ok) {
        const data = await res.json();
        setBranches(data.branches || []);
      }
    } catch (err) {
      console.error("Failed to fetch branches:", err);
    }
  };

  // Effects
  useEffect(() => {
    fetchBranches();
    fetchBookings();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBookings(false, 1);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  // Handler functions
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleRefresh = () => {
    fetchBookings(true);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reservations</h1>
          <p className="text-gray-600">Manage all guest bookings</p>
        </div>
      </div>

      {/* Major Sections */}
      <MetricsSection
        bookings={bookings}
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <FiltersSection
        filters={filters}
        branches={branches}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      <BookingsGrid
        bookings={bookings}
        filters={filters}
        pagination={pagination}
        loading={loading}
        onPageChange={(page) => fetchBookings(false, page)}
        onRefresh={fetchBookings}
      />
    </div>
  );
}
