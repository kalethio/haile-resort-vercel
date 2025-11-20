import React from "react";
import { Search, Filter, Calendar, X } from "lucide-react";
import { Branch, Filters } from "./types";

interface FiltersSectionProps {
  filters: Filters;
  branches: Branch[];
  onFilterChange: (filters: Partial<Filters>) => void;
  loading: boolean;
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  filters,
  branches,
  onFilterChange,
  loading,
}) => {
  const activeFilters = [
    filters.branch !== "all" && {
      key: "branch",
      label: `Branch: ${branches.find((b) => b.slug === filters.branch)?.branchName}`,
      onRemove: () => onFilterChange({ branch: "all" }),
    },
    filters.status !== "all" && {
      key: "status",
      label: `Status: ${filters.status}`,
      onRemove: () => onFilterChange({ status: "all" }),
    },
    filters.search && {
      key: "search",
      label: `Search: "${filters.search}"`,
      onRemove: () => onFilterChange({ search: "" }),
    },
    filters.dateRange.start &&
      filters.dateRange.end && {
        key: "dateRange",
        label: `Dates: ${new Date(filters.dateRange.start).toLocaleDateString()} - ${new Date(filters.dateRange.end).toLocaleDateString()}`,
        onRemove: () => onFilterChange({ dateRange: { start: "", end: "" } }),
      },
  ].filter(Boolean);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        {/* Search */}
        <div className="flex-1 relative min-w-0">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
            size={20}
          />
          <input
            type="text"
            placeholder="Search guests, emails, booking IDs..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-gray-800 text-gray-900 placeholder-gray-500 bg-white"
          />
        </div>

        {/* Date Range */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={16} />
            <span className="text-sm font-medium">From:</span>
          </div>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) =>
              onFilterChange({
                dateRange: { ...filters.dateRange, start: e.target.value },
              })
            }
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-800 text-gray-900 bg-white"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">To:</span>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) =>
              onFilterChange({
                dateRange: { ...filters.dateRange, end: e.target.value },
              })
            }
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-800 text-gray-900 bg-white"
          />
        </div>

        {/* Branch Filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter size={16} />
            <span className="text-sm font-medium">Branch:</span>
          </div>
          <select
            value={filters.branch}
            onChange={(e) => onFilterChange({ branch: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-gray-800 text-gray-900 bg-white min-w-[200px]"
          >
            <option value="all">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.slug}>
                {b.branchName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-sm text-gray-600 font-medium">
            Active filters:
          </span>
          {activeFilters.map((filter: any) => (
            <span
              key={filter.key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
            >
              {filter.label}
              <button
                onClick={filter.onRemove}
                className="hover:text-blue-900 p-0.5"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <button
            onClick={() =>
              onFilterChange({
                branch: "all",
                status: "all",
                search: "",
                dateRange: { start: "", end: "" },
              })
            }
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FiltersSection;
