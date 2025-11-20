// app/admin/3roomAndPrice/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Branch {
  id: number;
  slug: string;
  branchName: string;
  description?: string;
  roomCount: number;
  occupancyRate: number;
  totalRevenue: number;
}

export default function InventoryDashboard() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("/api/admin/rooms-prices/branches-overview");
      const data = await res.json();
      setBranches(data);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Room & Price Management
        </h1>
        <p className="text-gray-600">
          Manage rooms and pricing across all branches
        </p>
      </div>

      {/* Quick Stats - MOVED TO TOP */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {branches.length}
            </div>
            <div className="text-gray-600">Branches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {branches.reduce((sum, b) => sum + b.roomCount, 0)}
            </div>
            <div className="text-gray-600">Total Rooms</div>
          </div>
          {/* REMOVED: Avg Occupancy and Total Revenue stats */}
        </div>
      </div>

      {/* Branch Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.map((branch) => (
          <BranchCard key={branch.id} branch={branch} />
        ))}
      </div>
    </div>
  );
}

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <Link
      href={`/admin/3roomAndPrice/${branch.slug}`}
      className="block border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white hover:border-primary/30"
    >
      {/* Branch Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-900">{branch.branchName}</h3>
            <p className="text-sm text-gray-600">{branch.description}</p>
          </div>
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
            Manage →
          </span>
        </div>
      </div>

      {/* Branch Stats */}
      <div className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Rooms:</span>
            <span className="font-medium text-gray-700">
              {branch.roomCount}
            </span>
          </div>
          {/* REMOVED: Occupancy percentage text line */}
          {/* REMOVED: Revenue line */}

          {/* Occupancy Bar - KEPT */}
          <div className="pt-2">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Occupancy</span>
              <span>{branch.occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  branch.occupancyRate > 70
                    ? "bg-green-500"
                    : branch.occupancyRate > 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${branch.occupancyRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
