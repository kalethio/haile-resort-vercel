"use client";
import { useState, useEffect } from "react";
import DashboardHeader from "./components/DashboardHeader";
import KPISection from "./components/KPISection";
import OperationsFinanceSection from "./components/OperationsFinanceSection";
import RecentActivitySection from "./components/RecentActivitySection";
import {
  DashboardStats,
  Booking,
  FinancialMetric,
  BranchPerformance,
} from "./components/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [financialMetrics, setFinancialMetrics] = useState<FinancialMetric[]>(
    []
  );
  const [branchPerformance, setBranchPerformance] = useState<
    BranchPerformance[]
  >([]);

  useEffect(() => {
    setTimeout(() => {
      setStats({
        totalBookings: 847,
        revenue: 125400,
        occupancyRate: 82,
        guestSatisfaction: 4.7,
        averageDailyRate: 156,
        revPar: 128,
        expenses: 78400,
        netProfit: 47000,
        todayCheckIns: 8,
        todayCheckOuts: 5,
        availableRooms: 23,
        totalBranches: 4,
        activeBranches: 4,
      });

      setBranchPerformance([
        {
          name: "Addis Ababa",
          occupancy: 85,
          revenue: 65400,
          bookings: 45,
          trend: "up",
        },
        {
          name: "Hawassa",
          occupancy: 72,
          revenue: 42300,
          bookings: 32,
          trend: "up",
        },
        {
          name: "Awassa",
          occupancy: 65,
          revenue: 28700,
          bookings: 28,
          trend: "down",
        },
        {
          name: "Bahir Dar",
          occupancy: 78,
          revenue: 39100,
          bookings: 35,
          trend: "up",
        },
      ]);

      setRecentBookings([
        {
          id: "1",
          guestName: "Kalkidan Belachew",
          checkIn: "2024-01-20",
          checkOut: "2024-01-22",
          status: "confirmed",
          amount: 450,
          branch: "Hawassa",
        },
        {
          id: "2",
          guestName: "John Smith",
          checkIn: "2024-01-21",
          checkOut: "2024-01-23",
          status: "confirmed",
          amount: 320,
          branch: "Addis Ababa",
        },
      ]);

      setFinancialMetrics([
        { label: "Net Profit", value: "$47,000", change: "+18%", trend: "up" },
        { label: "ADR", value: "$156", change: "+5%", trend: "up" },
        { label: "RevPAR", value: "$128", change: "+12%", trend: "up" },
        { label: "Expenses", value: "$78,400", change: "+3%", trend: "down" },
      ]);
    }, 500);
  }, []);

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <DashboardHeader />
      <KPISection stats={stats} branchPerformance={branchPerformance} />
      <OperationsFinanceSection
        stats={stats}
        financialMetrics={financialMetrics}
      />
      <RecentActivitySection bookings={recentBookings} />
    </div>
  );
}
