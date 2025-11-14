// D:\(adminPages)\8systemAdmin\audit-logs\page.tsx
"use client";
import { useState, useEffect } from "react";

const actionTypes = [
  { value: "", label: "All Actions" },
  { value: "user_created", label: "User Created" },
  { value: "user_updated", label: "User Updated" },
  { value: "user_deleted", label: "User Deleted" },
  { value: "role_created", label: "Role Created" },
  { value: "role_updated", label: "Role Updated" },
  { value: "booking_created", label: "Booking Created" },
  { value: "booking_updated", label: "Booking Updated" },
  { value: "booking_cancelled", label: "Booking Cancelled" },
  { value: "room_created", label: "Room Created" },
  { value: "room_updated", label: "Room Updated" },
  { value: "permission_updated", label: "Permission Updated" },
];

const modules = [
  { value: "", label: "All Modules" },
  { value: "User Management", label: "User Management" },
  { value: "Role Management", label: "Role Management" },
  { value: "Room Management", label: "Room Management" },
  { value: "Reservations", label: "Reservations" },
  { value: "Finance", label: "Finance" },
  { value: "System Admin", label: "System Admin" },
  { value: "HR Management", label: "HR Management" },
];

export default function AuditLogs() {
  const [selectedLog, setSelectedLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    user: "",
    action: "",
    targetType: "",
    page: 1,
    limit: 20,
  });

  const getActionColor = (action: string) => {
    const colors = {
      created: "bg-green-100 text-green-800 border-green-200",
      updated: "bg-blue-100 text-blue-800 border-blue-200",
      deleted: "bg-red-100 text-red-800 border-red-200",
      cancelled: "bg-orange-100 text-orange-800 border-orange-200",
      default: "bg-gray-100 text-gray-800 border-gray-200",
    };

    if (action.includes("created")) return colors.created;
    if (action.includes("updated")) return colors.updated;
    if (action.includes("deleted")) return colors.deleted;
    if (action.includes("cancelled")) return colors.cancelled;
    return colors.default;
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
    };
  };

  const fetchAuditLogs = async () => {
    setLoading(true);
    setError("");
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.user) params.append("user", filters.user);
      if (filters.action) params.append("action", filters.action);
      if (filters.targetType) params.append("targetType", filters.targetType);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const response = await fetch(`/api/admin/system/audit-logs?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to load audit logs: ${response.status}`);
      }

      const data = await response.json();
      setLogs(data.auditLogs || []);
    } catch (error) {
      console.error("Error fetching audit logs:", error);
      setError("Failed to load audit logs. Please try again.");
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      user: "",
      action: "",
      targetType: "",
      page: 1,
      limit: 20,
    });
  };

  const exportLogs = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Timestamp,User,Action,Module,Branch,Target ID\n" +
      logs
        .map(
          (log) =>
            `"${log.createdAt}","${log.user?.email}","${log.action}","${log.targetType}","${log.branch?.branchName}","${log.targetId}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "audit_logs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch logs on component mount and when filters change
  useEffect(() => {
    fetchAuditLogs();
  }, [filters.page, filters.action, filters.targetType]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Logs</h1>
          <p className="text-gray-600">
            Track system activities and user actions across all branches
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Records</div>
          <div className="text-2xl font-bold text-gray-900">{logs.length}</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-800 text-sm font-medium">{error}</div>
          </div>
        </div>
      )}

      {/* Enhanced Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                value={filters.startDate}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
                value={filters.endDate}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              User Email
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              placeholder="Search user email..."
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Action Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              value={filters.action}
              onChange={(e) =>
                setFilters({ ...filters, action: e.target.value })
              }
            >
              {actionTypes.map((action) => (
                <option key={action.value} value={action.value}>
                  {action.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Module
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-black"
              value={filters.targetType}
              onChange={(e) =>
                setFilters({ ...filters, targetType: e.target.value })
              }
            >
              {modules.map((module) => (
                <option key={module.value} value={module.value}>
                  {module.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={fetchAuditLogs}
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Loading..." : "Apply Filters"}
            </button>
            <button
              onClick={clearFilters}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Clear All
            </button>
          </div>

          <button
            onClick={exportLogs}
            disabled={logs.length === 0}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Enhanced Table */}
        <div className="flex-1">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Time & Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Action
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                      Branch
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((log) => {
                    const { date, time } = formatDate(log.createdAt);
                    return (
                      <tr
                        key={log.id}
                        className="hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {date}
                          </div>
                          <div className="text-sm text-gray-500">{time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {log.user?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getActionColor(log.action)}`}
                          >
                            {formatAction(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.targetType}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {log.branch?.branchName || "System"}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {logs.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg font-medium">
                  No audit logs found
                </div>
                <div className="text-gray-500 text-sm mt-2">
                  {error
                    ? "Please check your connection and try again."
                    : "Try adjusting your filters or check back later for new activity"}
                </div>
              </div>
            )}

            {loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg font-medium">
                  Loading audit logs...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Details Sidebar */}
        {selectedLog && (
          <div className="w-96 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Audit Log Details
              </h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  User
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {selectedLog.user?.email}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Action
                </label>
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getActionColor(selectedLog.action)}`}
                >
                  {formatAction(selectedLog.action)}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Module
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {selectedLog.targetType}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Branch
                </label>
                <p className="text-sm font-medium text-gray-900">
                  {selectedLog.branch?.branchName || "System"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Timestamp
                </label>
                <p className="text-sm text-gray-900">
                  {formatDate(selectedLog.createdAt).date}{" "}
                  {formatDate(selectedLog.createdAt).time}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                  Target ID
                </label>
                <p className="text-sm font-medium text-gray-900">
                  #{selectedLog.targetId}
                </p>
              </div>

              {selectedLog.oldValues && (
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Changes
                  </label>
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg space-y-1">
                    <div>
                      <strong>Before:</strong>{" "}
                      {JSON.stringify(selectedLog.oldValues)}
                    </div>
                    <div>
                      <strong>After:</strong>{" "}
                      {JSON.stringify(selectedLog.newValues)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
