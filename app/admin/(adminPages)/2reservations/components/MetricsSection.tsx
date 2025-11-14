import React from "react";
import { Download, RefreshCw } from "lucide-react";
import { Booking, Filters } from "./types";

interface MetricsSectionProps {
  bookings: Booking[];
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  loading: boolean;
  isRefreshing: boolean;
  onRefresh: () => void;
}

const MetricsSection: React.FC<MetricsSectionProps> = ({
  bookings,
  filters,
  onFilterChange,
  loading,
  isRefreshing,
  onRefresh,
}) => {
  const metrics = [
    {
      id: "all",
      label: "Total",
      value: bookings.length,
      color: "bg-gray-100 text-gray-900",
    },
    {
      id: "PENDING",
      label: "Pending",
      value: bookings.filter((b) => b.status === "PENDING").length,
      color: "bg-yellow-50 text-yellow-900",
    },
    {
      id: "CONFIRMED",
      label: "Confirmed",
      value: bookings.filter((b) => b.status === "CONFIRMED").length,
      color: "bg-blue-50 text-blue-900",
    },
    {
      id: "CHECKED_IN",
      label: "Checked In",
      value: bookings.filter((b) => b.status === "CHECKED_IN").length,
      color: "bg-green-50 text-green-900",
    },
    {
      id: "CHECKED_OUT",
      label: "Completed",
      value: bookings.filter((b) => b.status === "CHECKED_OUT").length,
      color: "bg-gray-50 text-gray-900",
    },
  ];

  if (loading) return <MetricsSkeleton />;

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 flex-1">
          {metrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => onFilterChange({ status: metric.id })}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                filters.status === metric.id
                  ? "border-gray-800 bg-gray-800 text-white shadow-lg"
                  : `${metric.color} border-transparent hover:shadow-md`
              }`}
            >
              <div className="text-2xl font-bold mb-1">{metric.value}</div>
              <div className="text-sm font-medium">{metric.label}</div>
            </button>
          ))}
        </div>

        <div className="flex gap-3 ml-4">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={isRefreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
            <Download size={16} /> Export
          </button>
        </div>
      </div>
    </>
  );
};

const MetricsSkeleton = () => (
  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="p-4 rounded-lg border-2 border-gray-200 bg-white animate-pulse"
      >
        <div className="h-7 bg-gray-200 rounded mb-1 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default MetricsSection;
