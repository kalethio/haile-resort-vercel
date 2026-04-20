"use client";
import { useState, useEffect } from "react";

interface AuditLog {
  id: number;
  action: string;
  userEmail: string;
  targetType: string;
  targetId: number;
  createdAt: string;
  ipAddress: string | null;
  oldValues: any;
  newValues: any;
  user?: {
    email: string;
    name: string;
  };
  branch?: {
    branchName: string;
  };
}

const actionTypes = [
  { value: "", label: "All Actions" },
  { value: "USER_CREATED", label: "User Created" },
  { value: "USER_UPDATED", label: "User Updated" },
  { value: "USER_DELETED", label: "User Deleted" },
  { value: "ROLE_CREATED", label: "Role Created" },
  { value: "ROLE_UPDATED", label: "Role Updated" },
  { value: "BOOKING_CREATED", label: "Booking Created" },
  { value: "BOOKING_UPDATED", label: "Booking Updated" },
  { value: "BOOKING_CANCELLED", label: "Booking Cancelled" },
  { value: "ROOM_CREATED", label: "Room Created" },
  { value: "ROOM_UPDATED", label: "Room Updated" },
  { value: "PASSWORD_CHANGED", label: "Password Changed" },
];

const modules = [
  { value: "", label: "All Modules" },
  { value: "User", label: "User Management" },
  { value: "Role", label: "Role Management" },
  { value: "Room", label: "Room Management" },
  { value: "Booking", label: "Reservations" },
];

export default function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    user: "",
    action: "",
    targetType: "",
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.user) params.append("user", filters.user);
      if (filters.action) params.append("action", filters.action);
      if (filters.targetType) params.append("targetType", filters.targetType);
      params.append("page", pagination.page.toString());
      params.append("limit", pagination.limit.toString());

      const res = await fetch(`/api/admin/system/audit-logs?${params}`);
      const data = await res.json();
      setLogs(data.auditLogs || []);
      setPagination(
        data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 }
      );
    } catch (err) {
      console.error(err);
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
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const exportCSV = () => {
    const headers = ["Date", "User", "Action", "Module", "Target ID"];
    const rows = logs.map((log) => [
      new Date(log.createdAt).toLocaleString(),
      log.user?.email || log.userEmail || "System",
      log.action,
      log.targetType || "-",
      log.targetId || "-",
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    fetchLogs();
  }, [filters.action, filters.targetType, pagination.page]);

  const getActionColor = (action: string) => {
    if (action.includes("CREATED")) return "bg-green-100 text-green-800";
    if (action.includes("UPDATED")) return "bg-blue-100 text-blue-800";
    if (action.includes("DELETED")) return "bg-red-100 text-red-800";
    if (action.includes("CANCELLED")) return "bg-orange-100 text-orange-800";
    if (action.includes("CHANGED")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  const formatValue = (value: any) => {
    if (value === null || value === undefined) return "—";
    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Track system activities</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={logs.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-gray-900"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
          />
          <input
            type="date"
            className="border rounded-lg px-3 py-2 text-gray-900"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="User email"
            className="border rounded-lg px-3 py-2 text-gray-900 placeholder-gray-400"
            value={filters.user}
            onChange={(e) => setFilters({ ...filters, user: e.target.value })}
          />
          <select
            className="border rounded-lg px-3 py-2 text-gray-900"
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value })}
          >
            {actionTypes.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <select
            className="border rounded-lg px-3 py-2 text-gray-900"
            value={filters.targetType}
            onChange={(e) =>
              setFilters({ ...filters, targetType: e.target.value })
            }
          >
            {modules.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2 mt-3">
          <button
            onClick={fetchLogs}
            className="px-4 py-2 bg-black text-white rounded-lg"
          >
            Apply
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 border rounded-lg text-gray-700"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Table and Details */}
      <div className="flex gap-6">
        <div className="flex-1 bg-white border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Date & Time
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Module
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                    Branch
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No logs found
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.user?.email || log.userEmail || "System"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${getActionColor(log.action)}`}
                        >
                          {log.action.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.targetType || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {log.branch?.branchName || "System"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 border-t">
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded text-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded text-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Details Sidebar */}
        {selectedLog && (
          <div className="w-96 bg-white border rounded-lg p-4 sticky top-4 h-fit max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-900">Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-700">User:</span>{" "}
                <span className="text-gray-900">
                  {selectedLog.user?.email || selectedLog.userEmail}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Action:</span>{" "}
                <span className="text-gray-900">{selectedLog.action}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Module:</span>{" "}
                <span className="text-gray-900">
                  {selectedLog.targetType || "-"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Target ID:</span>{" "}
                <span className="text-gray-900">#{selectedLog.targetId}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">IP Address:</span>{" "}
                <span className="text-gray-900">
                  {selectedLog.ipAddress || "Not recorded"}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Time:</span>{" "}
                <span className="text-gray-900">
                  {new Date(selectedLog.createdAt).toLocaleString()}
                </span>
              </div>

              {selectedLog.oldValues && (
                <div>
                  <div className="font-semibold text-gray-700 mb-1">
                    Before:
                  </div>
                  <pre className="text-xs text-gray-900 bg-gray-50 p-2 rounded border overflow-x-auto whitespace-pre-wrap">
                    {formatValue(selectedLog.oldValues)}
                  </pre>
                </div>
              )}

              {selectedLog.newValues && (
                <div>
                  <div className="font-semibold text-gray-700 mb-1">After:</div>
                  <pre className="text-xs text-gray-900 bg-gray-50 p-2 rounded border overflow-x-auto whitespace-pre-wrap">
                    {formatValue(selectedLog.newValues)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
