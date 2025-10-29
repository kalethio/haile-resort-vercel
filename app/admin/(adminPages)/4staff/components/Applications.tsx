// admin/(adminPages)/4staff/career/components/Applications.tsx
"use client";

import { useState, useEffect } from "react";
import { Application, Job, Branch } from "./types";

interface ApplicationsDashboardProps {
  applications: Application[];
  jobs: Job[];
  branches: Branch[];
  stats: {
    total: number;
    pending: number;
    reviewed: number;
    accepted: number;
    rejected: number;
    byBranch: Record<string, number>;
    byJob: Record<string, number>;
  };
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  // Advanced filters
  const [filters, setFilters] = useState({
    branch: "",
    job: "",
    status: "",
    dateRange: "",
    search: "",
  });

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch applications with filters
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const [appsRes, jobsRes, branchesRes] = await Promise.all([
        fetch(`/api/admin/career/applications?${queryParams}`),
        fetch("/api/admin/career/jobs"),
        fetch("/api/branches"),
      ]);

      const [appsData, jobsData, branchesData] = await Promise.all([
        appsRes.json(),
        jobsRes.json(),
        branchesRes.json(),
      ]);

      setApplications(appsData);
      setJobs(jobsData);
      setBranches(branchesData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters]);

  // Calculate statistics
  const stats = {
    total: applications.length,
    pending: applications.filter((app) => app.status === "PENDING").length,
    reviewed: applications.filter((app) => app.status === "REVIEWED").length,
    accepted: applications.filter((app) => app.status === "ACCEPTED").length,
    rejected: applications.filter((app) => app.status === "REJECTED").length,
    byBranch: applications.reduce(
      (acc, app) => {
        const branch = app.appliedBranch;
        acc[branch] = (acc[branch] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
    byJob: applications.reduce(
      (acc, app) => {
        const job = app.jobTitle;
        acc[job] = (acc[job] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
  };

  // Quick actions
  const bulkUpdateStatus = async (applicationIds: string[], status: string) => {
    try {
      await Promise.all(
        applicationIds.map((id) =>
          fetch(`/api/admin/career/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        )
      );
      fetchData();
    } catch (error) {
      console.error("Bulk update failed:", error);
    }
  };

  const exportApplications = () => {
    // CSV export functionality
    const csvContent = applications
      .map(
        (app) =>
          `"${app.fullName}","${app.email}","${app.jobTitle}","${app.appliedBranch}","${app.status}","${app.submittedAt}"`
      )
      .join("\n");

    const blob = new Blob(
      [`Name,Email,Job,Branch,Status,Submitted\n${csvContent}`],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "applications.csv";
    a.click();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <StatCard title="Total" value={stats.total} color="blue" />
        <StatCard title="Pending" value={stats.pending} color="yellow" />
        <StatCard title="Reviewed" value={stats.reviewed} color="blue" />
        <StatCard title="Accepted" value={stats.accepted} color="green" />
        <StatCard title="Rejected" value={stats.rejected} color="red" />
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="text-center">
            <button
              onClick={exportApplications}
              className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Branch
            </label>
            <select
              value={filters.branch}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, branch: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.branchName}>
                  {branch.branchName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Position
            </label>
            <select
              value={filters.job}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, job: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.title}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, status: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Time</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Name, email, phone..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() =>
              setFilters({
                branch: "",
                job: "",
                status: "",
                dateRange: "",
                search: "",
              })
            }
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Clear all filters
          </button>
          <span className="text-sm text-gray-500">
            Showing {applications.length} of {stats.total} applications
          </span>
        </div>
      </div>

      {/* Applications Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onSelect={setSelectedApplication}
            onStatusUpdate={(id, status) => bulkUpdateStatus([id], status)}
          />
        ))}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdate={(id, status) => {
            bulkUpdateStatus([id], status);
            setSelectedApplication(null);
          }}
        />
      )}

      {/* Empty State */}
      {applications.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-gray-500">
            <svg
              className="mx-auto h-16 w-16 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No applications found
            </h3>
            <p className="text-gray-600 mb-4">
              {Object.values(filters).some((f) => f)
                ? "Try adjusting your filters to see more results"
                : "Applications will appear here when candidates apply to your job postings"}
            </p>
            {!Object.values(filters).some((f) => f) && (
              <button
                onClick={() =>
                  (window.location.href = "/admin/4staff/career?tab=jobs")
                }
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Job Posting
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Supporting Components
const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    green: "bg-green-50 text-green-700 border-green-200",
    red: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <div
      className={`bg-white p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]} shadow-sm`}
    >
      <div className="text-center">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm font-medium">{title}</div>
      </div>
    </div>
  );
};

const ApplicationCard = ({
  application,
  onSelect,
  onStatusUpdate,
}: {
  application: Application;
  onSelect: (app: Application) => void;
  onStatusUpdate: (id: string, status: string) => void;
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "REJECTED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">
            {application.fullName}
          </h3>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status || "PENDING")}`}
          >
            {application.status || "PENDING"}
          </span>
        </div>
        <p className="text-gray-600 text-sm">{application.email}</p>
        <p className="text-gray-500 text-sm">{application.phone}</p>
      </div>

      {/* Body */}
      <div className="p-4 space-y-3">
        <div>
          <span className="text-sm font-medium text-gray-700">
            Applied for:
          </span>
          <p className="text-sm text-gray-900">{application.jobTitle}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700">
            Preferred Branch:
          </span>
          <p className="text-sm text-gray-900">{application.appliedBranch}</p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700">Location:</span>
          <p className="text-sm text-gray-900">
            {application.currentLocation || "Not specified"}
          </p>
        </div>

        <div>
          <span className="text-sm font-medium text-gray-700">Experience:</span>
          <p className="text-sm text-gray-900">
            {application.yearsExperience
              ? `${application.yearsExperience} years`
              : "Not specified"}
          </p>
        </div>

        {application.skills && application.skills.length > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-700">Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {application.skills.slice(0, 3).map((skill, index) => (
                <span
                  key={index}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                >
                  {skill}
                </span>
              ))}
              {application.skills.length > 3 && (
                <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                  +{application.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(application.submittedAt).toLocaleDateString()}
          </span>

          <div className="flex space-x-2">
            <select
              value={application.status || "PENDING"}
              onChange={(e) => onStatusUpdate(application.id, e.target.value)}
              className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="PENDING">Pending</option>
              <option value="REVIEWED">Reviewed</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <button
              onClick={() => onSelect(application)}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              View
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Application Detail Modal Component
const ApplicationDetailModal = ({
  application,
  onClose,
  onStatusUpdate,
}: {
  application: Application;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal content would go here */}
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Application Details</h2>
          {/* Detailed application view */}
        </div>
      </div>
    </div>
  );
};
