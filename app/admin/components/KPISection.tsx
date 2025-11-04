import { Building, TrendingUp, TrendingDown, MapPin } from "lucide-react";
import { DashboardStats, BranchPerformance } from "./types";

interface Props {
  stats: DashboardStats;
  branchPerformance: BranchPerformance[];
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
            className={`flex items-center gap-1 text-sm ${
              trend === "up" ? "text-green-600" : "text-red-600"
            }`}
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

function BranchCard({ branch }: { branch: BranchPerformance }) {
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
          className={`text-xs flex items-center gap-1 ${
            branch.trend === "up" ? "text-green-600" : "text-red-600"
          }`}
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

export default function KPISection({ stats, branchPerformance }: Props) {
  return (
    <section className="space-y-6">
      {/* Multi-Branch Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Multi-Branch Overview
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building size={16} />
            <span>
              {stats.activeBranches} of {stats.totalBranches} branches active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Revenue"
            value={`$${(stats.revenue / 1000).toFixed(0)}K`}
            subtitle="Across all branches"
            trend="up"
            trendValue="+12.5%"
            icon={Building}
          />
          <MetricCard
            title="Avg Occupancy"
            value={`${stats.occupancyRate}%`}
            subtitle="Network average"
            trend="up"
            trendValue="+5.2%"
            icon={TrendingUp}
          />
          <MetricCard
            title="Total Bookings"
            value={stats.totalBookings.toLocaleString()}
            subtitle="All properties"
            trend="up"
            trendValue="+8%"
            icon={Building}
          />
          <MetricCard
            title="Guest Rating"
            value={stats.guestSatisfaction.toString()}
            subtitle="Average score"
            trend="up"
            trendValue="+0.3"
            icon={TrendingUp}
          />
        </div>
      </div>

      {/* Branch Performance */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Branch Performance</h3>
          <p className="text-sm text-gray-600 mt-1">
            Today's occupancy & revenue
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchPerformance.map((branch, index) => (
              <BranchCard key={branch.name} branch={branch} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
