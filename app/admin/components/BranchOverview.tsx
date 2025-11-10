"use client";

import { useState, useEffect } from "react";

interface BranchPerformance {
  name: string;
  occupancy: number;
  revenue: number;
}

interface MonthlyTrend {
  branch: string;
  months: Array<{ month: string; occupancy: number }>;
}

interface DashboardStats {
  branchPerformance: BranchPerformance[];
  monthlyTrends: MonthlyTrend[];
}

// ─────────────────────────────────────────────
// Vertical Bar Chart (Refined Premium Look)
// ─────────────────────────────────────────────
function VerticalBarChart({ branches }: { branches: BranchPerformance[] }) {
  const maxOccupancy = Math.max(...branches.map((b) => b.occupancy), 1);

  return (
    <div className="flex justify-between items-end gap-6 h-56">
      {branches.map((branch) => (
        <div key={branch.name} className="flex flex-col items-center  flex-1">
          <div className="text-sm font-medium text-gray-800 mb-2 text-center">
            {branch.name}
          </div>

          <div className="relative w-full bg-gradient-to-b from-gray-50 to-gray-100 rounded-lg h-40 flex items-end justify-center overflow-hidden shadow-inner">
            <div
              className={`rounded-t-md transition-all duration-700 ease-in-out shadow-sm ${
                branch.occupancy >= 80
                  ? "bg-gradient-to-t from-green-500 to-emerald-400"
                  : branch.occupancy >= 60
                    ? "bg-gradient-to-t from-blue-500 to-sky-400"
                    : "bg-gradient-to-t from-amber-500 to-yellow-400"
              }`}
              style={{
                height: `${(branch.occupancy / maxOccupancy) * 100}%`,
                width: "28%",
              }}
            ></div>
          </div>

          <div className="text-sm font-semibold text-gray-900 mt-2">
            {branch.occupancy}%
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Line Graph Chart (Cleaner Layout)
// ─────────────────────────────────────────────
function LineGraphChart({ trends }: { trends: MonthlyTrend[] }) {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const colors = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  return (
    <div className="space-y-6">
      {/* Trend Lines */}
      <div className="space-y-6">
        {trends.map((branchTrend, index) => {
          const data = branchTrend.months.map((m) => m.occupancy);
          const max = Math.max(...data);
          const min = Math.min(...data);
          const range = max - min || 1;

          return (
            <div key={branchTrend.branch} className="flex items-center gap-4">
              <div className="w-24 text-sm font-medium text-gray-900">
                {branchTrend.branch}
              </div>

              <div className="flex-1 relative h-16">
                {/* Subtle Grid Lines */}
                <div className="absolute inset-0 flex justify-between">
                  {months.map((_, i) => (
                    <div key={i} className="w-px bg-gray-100" />
                  ))}
                </div>

                {/* Line Graph */}
                <svg
                  className="w-full h-full"
                  viewBox={`0 0 ${months.length * 25} 50`}
                >
                  <polyline
                    fill="none"
                    stroke={colors[index % colors.length]}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={branchTrend.months
                      .map(
                        (m, i) =>
                          `${i * 25 + 12},${50 - ((m.occupancy - min) / range) * 45}`
                      )
                      .join(" ")}
                    className="transition-all duration-700 ease-in-out"
                  />

                  {branchTrend.months.map((m, i) => (
                    <circle
                      key={i}
                      cx={i * 25 + 12}
                      cy={50 - ((m.occupancy - min) / range) * 45}
                      r="3"
                      fill={colors[index % colors.length]}
                      className="shadow-sm"
                    />
                  ))}
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Single Month Labels */}
      <div className="flex justify-between text-xs text-gray-400 mt-3 px-[6rem] tracking-wide">
        {months.map((month) => (
          <span key={month}>{month}</span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// KPI Section (Main Component)
// ─────────────────────────────────────────────
export default function KPISection() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats");
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setStats({
          branchPerformance: [],
          monthlyTrends: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12 text-gray-600">
        Unable to load dashboard data
      </div>
    );
  }

  return (
    <section className="space-y-8">
      {/* Charts Only - No Summary Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="flex justify-center border flex-col border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            This Month Occupancy
          </h3>
          <VerticalBarChart branches={stats.branchPerformance} />
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Monthly Trends (Jan–Dec)
          </h3>
          <LineGraphChart trends={stats.monthlyTrends} />
        </div>
      </div>
    </section>
  );
}
