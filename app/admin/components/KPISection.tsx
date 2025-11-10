"use client";

import { useState, useEffect } from "react";
import {
  Building,
  TrendingUp,
  TrendingDown,
  MapPin,
  Users,
  Calendar,
  LogOut,
} from "lucide-react";

interface DashboardStats {
  weeklyRevenue: number;
  todayBookings: number;
  todayCheckIns: number;
  todayCheckOuts: number;
  branchPerformance: Array<{
    name: string;
    occupancy: number;
    revenue: number;
    bookings: number;
    trend: "up" | "down";
  }>;
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon: Icon,
}: any) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-gray-50">
          <Icon size={20} className="text-gray-600" />
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1 text-sm ${trend === "up" ? "text-green-600" : "text-red-600"}`}
          >
            {trend === "up" ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <div className="text-2xl font-light text-gray-900 mb-1">{value}</div>
        <div className="text-sm text-gray-600">{title}</div>
        {subtitle && (
          <div className="text-xs text-gray-500 mt-1">{subtitle}</div>
        )}
      </div>
    </div>
  );
}

function BranchCard({ branch }: { branch: any }) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded-lg">
          <MapPin size={16} className="text-gray-600" />
        </div>
        <div>
          <div className="font-medium text-gray-900 text-sm">{branch.name}</div>
          <div className="text-xs text-gray-600">
            {branch.bookings} bookings
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-gray-900 text-sm">
          {branch.occupancy}%
        </div>
        <div
          className={`text-xs flex items-center gap-1 ${branch.trend === "up" ? "text-green-600" : "text-red-600"}`}
        >
          {branch.trend === "up" ? (
            <TrendingUp size={12} />
          ) : (
            <TrendingDown size={12} />
          )}
          ${(branch.revenue / 1000).toFixed(0)}K
        </div>
      </div>
    </div>
  );
}

export default function KPISection() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats");
        const data = await response.json();
        setStats(data);
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
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-600">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* Daily Operations Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Today&apos;s Operations
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Real-time updates</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="This Week Revenue"
            value={`$${(stats.weeklyRevenue / 1000).toFixed(0)}K`}
            subtitle="Revenue this week"
            trend="up"
            trendValue="+12.5%"
            icon={Building}
          />
          <MetricCard
            title="Today New Booking"
            value={stats.todayBookings.toString()}
            subtitle="New reservations today"
            trend="up"
            trendValue="+8%"
            icon={Calendar}
          />
          <MetricCard
            title="Today Check In"
            value={stats.todayCheckIns.toString()}
            subtitle="Arrivals today"
            trend="up"
            trendValue="+15%"
            icon={Users}
          />
          <MetricCard
            title="Today Check Out"
            value={stats.todayCheckOuts.toString()}
            subtitle="Departures today"
            trend="down"
            trendValue="-3%"
            icon={LogOut}
          />
        </div>
      </div>
    </section>
  );
}
