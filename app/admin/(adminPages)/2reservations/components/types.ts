export interface Booking {
  id: string;
  type: string;
  status: string;
  guestName: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  totalAmount: number;
  branch: { branchName: string; slug: string };
  roomBookings: {
    room: { roomNumber: string; roomType: { name: string } };
    pricePerNight: number;
    totalNights: number;
  }[];
  createdAt: string;
}

export interface Branch {
  id: number;
  branchName: string;
  slug: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface Filters {
  branch: string;
  status: string;
  search: string;
  dateRange: {
    start: string;
    end: string;
  };
}
// Add to your existing types.ts
export interface BookingCardProps {
  booking: Booking;
  onStatusChange: (bookingId: string, newStatus: string) => void;
  onRefresh: (showRefresh?: boolean, page?: number) => void;
}

export interface MetricsSectionProps {
  bookings: Booking[];
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  loading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export interface FiltersSectionProps {
  filters: Filters;
  branches: Branch[];
  onFilterChange: (filters: Partial<Filters>) => void;
  loading: boolean;
}

export interface BookingsGridProps {
  bookings: Booking[];
  filters: Filters;
  pagination: PaginationInfo;
  loading: boolean;
  onPageChange: (page: number) => void;
  onRefresh: (showRefresh?: boolean, page?: number) => void;
}
