export interface DashboardStats {
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
  guestSatisfaction: number;
  averageDailyRate: number;
  revPar: number;
  expenses: number;
  netProfit: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  availableRooms: number;
  totalBranches: number;
  activeBranches: number;
}

export interface BranchPerformance {
  name: string;
  occupancy: number;
  revenue: number;
  bookings: number;
  trend: "up" | "down";
}

export interface Booking {
  id: string;
  guestName: string;
  checkIn: string;
  checkOut: string;
  status: "confirmed" | "pending" | "checked_in"; // Add all possible statuses
  amount: number;
  branch: string;
}

export interface FinancialMetric {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
}
