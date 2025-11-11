// D:\(adminPages)\8systemAdmin\audit-logs\page.tsx
"use client";
import { useState } from "react";

const mockLogs = [
  {
    id: 1,
    user: "admin@hotel.com",
    action: "user_created",
    module: "User Management",
    timestamp: "2024-01-15 14:30:25",
    ip: "192.168.1.1",
  },
  {
    id: 2,
    user: "manager@hotel.com",
    action: "room_updated",
    module: "Room Management",
    timestamp: "2024-01-15 13:15:42",
    ip: "192.168.1.2",
  },
];

export default function AuditLogs() {
  const [selectedLog, setSelectedLog] = useState(null);
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    user: "",
    action: "",
    module: "",
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-accent mb-6">Audit Logs</h1>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date From
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={filters.dateFrom}
              onChange={(e) =>
                setFilters({ ...filters, dateFrom: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date To
            </label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2"
              value={filters.dateTo}
              onChange={(e) =>
                setFilters({ ...filters, dateTo: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="Filter by user..."
              value={filters.user}
              onChange={(e) => setFilters({ ...filters, user: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Module
            </label>
            <select
              className="w-full border rounded px-3 py-2"
              value={filters.module}
              onChange={(e) =>
                setFilters({ ...filters, module: e.target.value })
              }
            >
              <option value="">All Modules</option>
              <option value="User Management">User Management</option>
              <option value="Room Management">Room Management</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-accent text-white px-4 py-2 rounded">
            Apply Filters
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
            Clear
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Logs Table */}
        <div className="flex-1">
          <div className="border rounded-lg">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Timestamp</th>
                  <th className="p-3 text-left">User</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Module</th>
                  <th className="p-3 text-left">IP</th>
                </tr>
              </thead>
              <tbody>
                {mockLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-t hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="p-3 text-sm">{log.timestamp}</td>
                    <td className="p-3">{log.user}</td>
                    <td className="p-3">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">{log.module}</td>
                    <td className="p-3 text-sm">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Log Details Sidebar */}
        {selectedLog && (
          <div className="w-80 border-l pl-6">
            <h3 className="text-lg font-semibold text-accent mb-4">
              Log Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <p className="text-sm">{selectedLog.user}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Action
                </label>
                <p className="text-sm">{selectedLog.action}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Module
                </label>
                <p className="text-sm">{selectedLog.module}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Timestamp
                </label>
                <p className="text-sm">{selectedLog.timestamp}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  IP Address
                </label>
                <p className="text-sm">{selectedLog.ip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
