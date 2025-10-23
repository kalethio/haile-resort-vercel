// /app/admin/(adminPages)/7finance/page.tsx
"use client";
import React, { useState, useEffect } from "react";

interface FinanceStats {
  totalRevenue: number;
  monthlyRevenue: number;
  pendingPayments: number;
  averageBookingValue: number;
  revenueByBranch: { branchName: string; revenue: number }[];
  recentTransactions: {
    id: string;
    guestName: string;
    amount: number;
    status: string;
    date: string;
    branch: string;
  }[];
}

interface Branch {
  id: number;
  branchName: string;
  slug: string;
}

export default function FinancePage() {
  const [stats, setStats] = useState<FinanceStats | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
    fetchFinanceData();
  }, [selectedBranch, dateRange]);

  const fetchBranches = async () => {
    try {
      const response = await fetch("/api/admin/branches-list");
      if (response.ok) {
        const data = await response.json();
        setBranches(data.branches || []);
      }
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  };

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBranch !== "all") params.append("branch", selectedBranch);
      params.append("period", dateRange);

      const response = await fetch(`/api/admin/finance?${params}`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch finance data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Finance Dashboard
          </h1>
          <p className="text-gray-600">
            Revenue, payments, and financial analytics
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="all">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.slug}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading finance data...</p>
        </div>
      ) : (
        stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Total Revenue</div>
                <div className="text-2xl font-bold text-gray-900">
                  ${stats.totalRevenue?.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Monthly Revenue</div>
                <div className="text-2xl font-bold text-green-600">
                  ${stats.monthlyRevenue?.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Pending Payments</div>
                <div className="text-2xl font-bold text-yellow-600">
                  ${stats.pendingPayments?.toLocaleString()}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600">Avg Booking Value</div>
                <div className="text-2xl font-bold text-blue-600">
                  ${stats.averageBookingValue?.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Revenue by Branch */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Revenue by Branch
                </h3>
                <div className="space-y-3">
                  {stats.revenueByBranch?.map((branch, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">
                        {branch.branchName}
                      </span>
                      <span className="font-medium">
                        ${branch.revenue?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">
                  Recent Transactions
                </h3>
                <div className="space-y-3">
                  {stats.recentTransactions?.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {transaction.guestName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.branch}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          ${transaction.amount}
                        </div>
                        <div
                          className={`text-xs ${
                            transaction.status === "COMPLETED"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {transaction.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
