// admin/(adminPages)/4staff/career/components/Applications.tsx
"use client";

import { useState, useEffect } from "react";
import { Application, Job, Branch } from "./types";

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<number[]>(
    []
  );
  const [filters, setFilters] = useState({
    status: "",
    job: "",
    branch: "",
    search: "",
  });
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [appsRes, jobsRes, branchesRes] = await Promise.all([
        fetch("/api/admin/career/applications"),
        fetch("/api/admin/career/jobs"),
        fetch("/api/branches"),
      ]);

      if (!appsRes.ok || !jobsRes.ok || !branchesRes.ok) {
        throw new Error("Failed to fetch data");
      }

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
      setError(
        "Unable to load applications. Please check your authentication and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Enhanced CSV export with branch filtering
  const exportToCSV = async (exportAll: boolean = false) => {
    if (applications.length === 0) {
      showNotification("No applications available to export", "info");
      return;
    }

    setIsExporting(true);
    try {
      let applicationsToExport = applications;

      // If not exporting all, use current filters
      if (!exportAll && filters.branch) {
        applicationsToExport = applications.filter(
          (app) => app.job?.branch?.branchName === filters.branch
        );
      }

      if (applicationsToExport.length === 0) {
        showNotification(
          "No applications to export with current filters",
          "info"
        );
        return;
      }

      const headers = [
        "ID",
        "Full Name",
        "Email",
        "Phone",
        "Job Title",
        "Department",
        "Branch",
        "Current Location",
        "Education Level",
        "Years of Experience",
        "Skills",
        "Languages",
        "Certifications",
        "Availability Date",
        "Willing to Relocate",
        "Expected Salary",
        "Cover Letter",
        "Resume URL",
        "Status",
        "Submitted At",
      ];

      const csvData = applicationsToExport.map((app) => [
        app.id,
        `"${app.fullName}"`,
        `"${app.email}"`,
        `"${app.phone || ""}"`,
        `"${app.job?.title || ""}"`,
        `"${app.job?.department || ""}"`,
        `"${app.job?.branch?.branchName || ""}"`,
        `"${app.currentLocation || ""}"`,
        `"${app.educationLevel || ""}"`,
        app.yearsExperience || 0,
        `"${Array.isArray(app.skills) ? app.skills.join("; ") : app.skills}"`,
        `"${Array.isArray(app.languages) ? app.languages.join("; ") : app.languages}"`,
        `"${Array.isArray(app.certifications) ? app.certifications.join("; ") : app.certifications}"`,
        `"${app.availabilityDate || ""}"`,
        app.willingToRelocate ? "Yes" : "No",
        `"${app.expectedSalary || ""}"`,
        `"${(app.coverLetter || "").replace(/"/g, '""')}"`,
        `"${app.resumeUrl || ""}"`,
        app.status,
        `"${new Date(app.submittedAt).toLocaleString()}"`,
      ]);

      const csvContent = [
        headers.join(","),
        ...csvData.map((row) => row.join(",")),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);

      const branchSuffix =
        filters.branch && !exportAll
          ? `-${filters.branch.replace(/\s+/g, "-")}`
          : "";
      link.setAttribute(
        "download",
        `job-applications${branchSuffix}-${new Date().toISOString().split("T")[0]}.csv`
      );

      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showNotification(
        `Exported ${applicationsToExport.length} applications successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Export failed:", error);
      showNotification("Failed to export applications", "error");
    } finally {
      setIsExporting(false);
      setShowExportMenu(false);
    }
  };

  // Notification system
  const showNotification = (
    message: string,
    type: "success" | "error" | "info"
  ) => {
    // Simple notification - you can replace with a proper toast library
    console.log(`${type.toUpperCase()}: ${message}`);
    // For now, we'll use alert for simplicity
    if (type === "error") {
      alert(`Error: ${message}`);
    } else if (type === "success") {
      alert(`Success: ${message}`);
    }
  };

  // Filter applications based on current filters
  const filteredApplications = applications.filter((app) => {
    if (filters.status && app.status !== filters.status) return false;
    if (filters.job && app.job?.title !== filters.job) return false;
    if (filters.branch && app.job?.branch?.branchName !== filters.branch)
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        app.fullName.toLowerCase().includes(searchLower) ||
        app.email.toLowerCase().includes(searchLower) ||
        app.phone?.toLowerCase().includes(searchLower) ||
        app.job?.title.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const updateApplicationStatus = async (
    id: number,
    status: Application["status"]
  ) => {
    try {
      const response = await fetch(`/api/admin/career/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update application status");
      }

      // Update local state
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
      );

      showNotification("Application status updated successfully", "success");
    } catch (error) {
      console.error("Failed to update application:", error);
      showNotification("Failed to update application status", "error");
    }
  };

  // Bulk status update
  const bulkUpdateStatus = async (status: Application["status"]) => {
    if (selectedApplications.length === 0) return;

    try {
      await Promise.all(
        selectedApplications.map((id) =>
          fetch(`/api/admin/career/applications/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          })
        )
      );

      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          selectedApplications.includes(app.id) ? { ...app, status } : app
        )
      );

      setSelectedApplications([]);
      showNotification(
        `Updated ${selectedApplications.length} applications`,
        "success"
      );
    } catch (error) {
      console.error("Bulk update failed:", error);
      showNotification("Failed to update applications", "error");
    }
  };

  // Select/deselect all applications
  const toggleSelectAll = () => {
    if (selectedApplications.length === filteredApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(filteredApplications.map((app) => app.id));
    }
  };

  // Toggle single application selection
  const toggleApplicationSelection = (id: number) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return "⏳";
      case "REVIEWED":
        return "👁️";
      case "ACCEPTED":
        return "✅";
      case "REJECTED":
        return "❌";
      default:
        return "📄";
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({ status: "", job: "", branch: "", search: "" });
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  // Show error state if there's an issue
  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Unable to load applications
        </h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Stats and Controls */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Applications Dashboard
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and review job applications from candidates
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "table"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📊 Table
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === "card"
                    ? "bg-blue-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                🗂️ Cards
              </button>
            </div>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={isExporting || applications.length === 0}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <span>Export CSV</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </>
                )}
              </button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                  <div className="p-2">
                    <button
                      onClick={() => exportToCSV(false)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center space-x-2"
                    >
                      <span>📊</span>
                      <span>
                        Export {filters.branch ? filters.branch : "Filtered"}(
                        {filteredApplications.length})
                      </span>
                    </button>
                    <button
                      onClick={() => exportToCSV(true)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center space-x-2"
                    >
                      <span>💾</span>
                      <span>Export All ({applications.length})</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg border border-transparent hover:border-blue-200 transition-all"
              title="Refresh data"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">
              {applications.length}
            </div>
            <div className="text-sm text-gray-600">Total Applications</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter((a) => a.status === "PENDING").length}
            </div>
            <div className="text-sm text-gray-600">Pending Review</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter((a) => a.status === "REVIEWED").length}
            </div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter((a) => a.status === "ACCEPTED").length}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedApplications.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-blue-700">
                {selectedApplications.length} application(s) selected
              </span>
              <div className="flex space-x-2">
                <select
                  onChange={(e) =>
                    bulkUpdateStatus(e.target.value as Application["status"])
                  }
                  className="text-sm border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Update Status</option>
                  <option value="PENDING">Mark as Pending</option>
                  <option value="REVIEWED">Mark as Reviewed</option>
                  <option value="ACCEPTED">Mark as Accepted</option>
                  <option value="REJECTED">Mark as Rejected</option>
                </select>
                <button
                  onClick={() => setSelectedApplications([])}
                  className="text-sm text-blue-600 hover:text-blue-800 px-3 py-2 border border-blue-300 rounded-lg hover:bg-white"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🔍 Search
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, search: e.target.value }))
                  }
                  placeholder="Search applicants..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📊 Status
              </label>
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, status: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Status</option>
                <option value="PENDING">⏳ Pending</option>
                <option value="REVIEWED">👁️ Reviewed</option>
                <option value="ACCEPTED">✅ Accepted</option>
                <option value="REJECTED">❌ Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💼 Job Position
              </label>
              <select
                value={filters.job}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, job: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🏢 Branch
              </label>
              <select
                value={filters.branch}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, branch: e.target.value }))
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.branchName}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(filters.status ||
            filters.job ||
            filters.branch ||
            filters.search) && (
            <button
              onClick={clearFilters}
              className="lg:self-end px-4 py-3 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 hover:border-gray-400 rounded-xl transition-colors flex items-center space-x-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>
            Showing <strong>{filteredApplications.length}</strong> of{" "}
            <strong>{applications.length}</strong> applications
            {filters.branch && ` in ${filters.branch}`}
          </span>
          {selectedApplications.length > 0 && (
            <span className="text-blue-600 font-medium">
              {selectedApplications.length} selected
            </span>
          )}
        </div>
      </div>

      {/* Applications Display */}
      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-gray-400 mb-4 text-6xl">📄</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No applications yet
          </h3>
          <p className="text-gray-600 mb-4">
            Applications will appear here when candidates apply to your job
            postings.
          </p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      ) : viewMode === "table" ? (
        <EnhancedTableView
          applications={filteredApplications}
          selectedApplications={selectedApplications}
          onSelectionChange={toggleApplicationSelection}
          onSelectAll={toggleSelectAll}
          onStatusUpdate={updateApplicationStatus}
          onViewDetails={setSelectedApplication}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      ) : (
        <CardView
          applications={filteredApplications}
          onStatusUpdate={updateApplicationStatus}
          onViewDetails={setSelectedApplication}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
        />
      )}

      {/* Application Detail Modal */}
      {selectedApplication && (
        <EnhancedApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdate={updateApplicationStatus}
        />
      )}
    </div>
  );
}

// Enhanced Table View Component (keep the same as before)
const EnhancedTableView = ({
  applications,
  selectedApplications,
  onSelectionChange,
  onSelectAll,
  onStatusUpdate,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
}: any) => (
  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <input
                type="checkbox"
                checked={
                  selectedApplications.length === applications.length &&
                  applications.length > 0
                }
                onChange={onSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
              />
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              👤 Applicant
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              💼 Position & Branch
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              📋 Details
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              📊 Status
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              📅 Date
            </th>
            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ⚡ Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map((application: Application) => (
            <tr
              key={application.id}
              className="hover:bg-blue-50 transition-colors duration-200 group"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={selectedApplications.includes(application.id)}
                  onChange={() => onSelectionChange(application.id)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors group-hover:border-blue-300"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {application.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {application.fullName}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.email}
                    </div>
                    <div className="text-sm text-gray-400">
                      {application.phone}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {application.job?.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {application.job?.department}
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    {application.job?.branch?.branchName}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">🎓</span>
                    <span>{application.educationLevel || "Not specified"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">⏱️</span>
                    <span>{application.yearsExperience || 0} years exp</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">📍</span>
                    <span>
                      {application.currentLocation || "Not specified"}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={application.status}
                  onChange={(e) =>
                    onStatusUpdate(application.id, e.target.value)
                  }
                  className={`text-sm font-medium px-3 py-2 rounded-lg border-2 transition-all cursor-pointer ${getStatusColor(application.status)} hover:shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="PENDING">⏳ Pending</option>
                  <option value="REVIEWED">👁️ Reviewed</option>
                  <option value="ACCEPTED">✅ Accepted</option>
                  <option value="REJECTED">❌ Rejected</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(application.submittedAt).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(application.submittedAt).toLocaleTimeString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewDetails(application)}
                    className="inline-flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View
                  </button>
                  {application.resumeUrl && (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Resume
                    </a>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Empty State for filtered results */}
    {applications.length === 0 && (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4 text-6xl">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No matching applications
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Try adjusting your search criteria or filters to find what you're
          looking for.
        </p>
      </div>
    )}
  </div>
);

// Card View Component (keep the same as before)
const CardView = ({
  applications,
  onStatusUpdate,
  onViewDetails,
  getStatusColor,
  getStatusIcon,
}: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {applications.map((application: Application) => (
      <div
        key={application.id}
        className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300 group"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {application.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {application.fullName}
              </h3>
              <p className="text-sm text-gray-500">{application.email}</p>
            </div>
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}
          >
            {getStatusIcon(application.status)} {application.status}
          </span>
        </div>

        {/* Job Info */}
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-1">
            {application.job?.title}
          </h4>
          <div className="flex items-center text-sm text-gray-600 space-x-4">
            <span>{application.job?.department}</span>
            <span>•</span>
            <span className="text-blue-600">
              {application.job?.branch?.branchName}
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">🎓</span>
            <span className="truncate">
              {application.educationLevel || "N/A"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">⏱️</span>
            <span>{application.yearsExperience || 0}y exp</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">📍</span>
            <span className="truncate">
              {application.currentLocation || "N/A"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">💵</span>
            <span className="truncate">
              {application.expectedSalary || "N/A"}
            </span>
          </div>
        </div>

        {/* Skills Preview */}
        {application.skills && application.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
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

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            {new Date(application.submittedAt).toLocaleDateString()}
          </span>
          <div className="flex items-center space-x-2">
            <select
              value={application.status}
              onChange={(e) => onStatusUpdate(application.id, e.target.value)}
              className={`text-xs border-0 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 ${getStatusColor(application.status)}`}
            >
              <option value="PENDING">⏳</option>
              <option value="REVIEWED">👁️</option>
              <option value="ACCEPTED">✅</option>
              <option value="REJECTED">❌</option>
            </select>
            <button
              onClick={() => onViewDetails(application)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              View
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Enhanced Application Detail Modal Component (keep the same as before)
const EnhancedApplicationDetailModal = ({
  application,
  onClose,
  onStatusUpdate,
}: {
  application: Application;
  onClose: () => void;
  onStatusUpdate: (id: number, status: Application["status"]) => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {application.fullName}
              </h2>
              <p className="text-blue-100">
                {application.job?.title} • {application.job?.branch?.branchName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/10"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Cover Letter */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📝</span> Cover Letter
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {application.coverLetter || "No cover letter provided."}
                  </p>
                </div>
              </div>

              {/* Skills & Qualifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🛠️</span> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(application.skills) &&
                      application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">🌐</span> Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(application.languages) &&
                      application.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                        >
                          {language}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Info
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      📧 Email
                    </label>
                    <p className="text-gray-900">{application.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      📞 Phone
                    </label>
                    <p className="text-gray-900">
                      {application.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      📍 Location
                    </label>
                    <p className="text-gray-900">
                      {application.currentLocation || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      🎓 Education
                    </label>
                    <p className="text-gray-900">
                      {application.educationLevel || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      ⏱️ Experience
                    </label>
                    <p className="text-gray-900">
                      {application.yearsExperience || 0} years
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      💵 Expected Salary
                    </label>
                    <p className="text-gray-900">
                      {application.expectedSalary || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      🚗 Willing to Relocate
                    </label>
                    <p className="text-gray-900">
                      {application.willingToRelocate ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Actions
                </h3>
                <div className="space-y-3">
                  {application.resumeUrl && (
                    <a
                      href={application.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Download Resume
                    </a>
                  )}

                  <select
                    value={application.status}
                    onChange={(e) =>
                      onStatusUpdate(
                        application.id,
                        e.target.value as Application["status"]
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="PENDING">⏳ Mark as Pending</option>
                    <option value="REVIEWED">👁️ Mark as Reviewed</option>
                    <option value="ACCEPTED">✅ Mark as Accepted</option>
                    <option value="REJECTED">❌ Mark as Rejected</option>
                  </select>

                  <button
                    onClick={onClose}
                    className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
