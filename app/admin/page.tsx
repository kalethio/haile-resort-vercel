"use client";

import { useState, useEffect } from "react";
import DashboardHeader from "./components/DashboardHeader";
import KPISection from "./components/KPISection";
import BranchOverview from "./components/BranchOverview";

interface DashboardData {
  stats: {
    weeklyRevenue: number;
    todayBookings: number;
    todayCheckIns: number;
    todayCheckOuts: number;
    branchPerformance: Array<{
      name: string;
      occupancy: number;
      revenue: number;
    }>;
    monthlyTrends: Array<{
      branch: string;
      months: Array<{ month: string; occupancy: number }>;
    }>;
  };
  recentBookings: Array<{
    id: string;
    guestName: string;
    checkIn: string;
    checkOut: string;
    status: string;
    amount: number;
    branch: string;
  }>;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();

        // Transform API response to match component expectations
        setDashboardData({
          stats: data,
          recentBookings: [], // You'll need to fetch this separately or include in API
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-12 text-gray-600">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      <DashboardHeader />
      <KPISection />
      <BranchOverview />
    </div>
  );
}
