import Link from "next/link";
import {
  Users,
  Calendar,
  Bed,
  ClipboardList,
  BarChart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { DashboardStats, FinancialMetric } from "./types";

interface Props {
  stats: DashboardStats;
  financialMetrics: FinancialMetric[];
}

export default function OperationsFinanceSection({
  stats,
  financialMetrics,
}: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Today's Operations */}
      <div className="lg:col-span-1 space-y-6">
        {/* Today's Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Today's Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Users size={18} className="text-green-600" />
                <span className="text-gray-700">Check-ins</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats.todayCheckIns}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-blue-600" />
                <span className="text-gray-700">Check-outs</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats.todayCheckOuts}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Bed size={18} className="text-orange-600" />
                <span className="text-gray-700">Available Rooms</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats.availableRooms}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              href="/admin/reservations"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Calendar size={18} className="text-gray-600" />
              <span>Manage Bookings</span>
            </Link>
            <Link
              href="/admin/guests"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Users size={18} className="text-gray-600" />
              <span>Guest Management</span>
            </Link>
            <Link
              href="/admin/housekeeping"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ClipboardList size={18} className="text-gray-600" />
              <span>Housekeeping</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Finance Review */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Finance Review</h3>
              <Link
                href="/admin/finance"
                className="text-gray-600 hover:text-gray-900 text-sm flex items-center gap-1"
              >
                Detailed Report <BarChart size={14} />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              {financialMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm text-gray-600 mb-2">
                    {metric.label}
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-xl font-semibold text-gray-900">
                      {metric.value}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm ${
                        metric.trend === "up"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <TrendingUp size={14} />
                      ) : (
                        <TrendingDown size={14} />
                      )}
                      {metric.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Profit Summary */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm text-gray-600">Net Profit Margin</div>
                  <div className="text-lg font-semibold text-gray-900">
                    37.5%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">This Month</div>
                  <div className="text-lg font-semibold text-green-600">
                    +$8,200
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
