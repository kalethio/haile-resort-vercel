// admin/(adminPages)/4staff/career/components/Applications.tsx
"use client";

import { useState } from "react";
import { Application, Job, Branch } from "../types";

interface ApplicationsProps {
  applications: Application[];
  jobs: Job[];
  branches: Branch[];
  selectedApplications: number[];
  onSelectionChange: (id: number) => void;
  onSelectAll: () => void;
  onRefresh: () => void;
}

export default function Applications({
  applications,
  jobs,
  branches,
  selectedApplications,
  onSelectionChange,
  onSelectAll,
  onRefresh,
}: ApplicationsProps) {
  const [filters, setFilters] = useState({
    status: "",
    job: "",
    branch: "",
    search: "",
  });
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

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
      await fetch(`/api/admin/career/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onRefresh();
    } catch (error) {
      console.error("Failed to update application:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "REVIEWED":
        return "bg-blue-100 text-blue-800";
      case "ACCEPTED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            Job
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

      {/* Applications Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      selectedApplications.length ===
                        filteredApplications.length &&
                      filteredApplications.length > 0
                    }
                    onChange={onSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job & Branch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(application.id)}
                      onChange={() => onSelectionChange(application.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {application.fullName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {application.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {application.job?.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.job?.department}
                    </div>
                    <div className="text-sm text-gray-500">
                      {application.job?.branch?.branchName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      <div>Exp: {application.yearsExperience} years</div>
                      <div>Location: {application.currentLocation}</div>
                      <div>Education: {application.educationLevel}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={application.status}
                      onChange={(e) =>
                        updateApplicationStatus(
                          application.id,
                          e.target.value as Application["status"]
                        )
                      }
                      className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(application.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="ACCEPTED">Accepted</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      View
                    </button>
                    {application.resumeUrl && (
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-900"
                      >
                        Resume
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
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
              <p className="text-gray-600">
                {Object.values(filters).some((f) => f)
                  ? "Try adjusting your filters to see more results"
                  : "Applications will appear here when candidates apply to your job postings"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onStatusUpdate={updateApplicationStatus}
        />
      )}
    </div>
  );
}

// Application Detail Modal Component
const ApplicationDetailModal = ({
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
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Application Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Personal Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <p className="text-gray-900">{application.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <p className="text-gray-900">{application.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <p className="text-gray-900">
                    {application.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Current Location
                  </label>
                  <p className="text-gray-900">
                    {application.currentLocation || "Not provided"}
                  </p>
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Professional Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Education Level
                  </label>
                  <p className="text-gray-900">
                    {application.educationLevel || "Not provided"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <p className="text-gray-900">
                    {application.yearsExperience || 0} years
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Expected Salary
                  </label>
                  <p className="text-gray-900">
                    {application.expectedSalary || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Willing to Relocate
                  </label>
                  <p className="text-gray-900">
                    {application.willingToRelocate ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            </div>

            {/* Skills & Qualifications */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Skills & Qualifications
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Skills
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.isArray(application.skills) &&
                      application.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Languages
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.isArray(application.languages) &&
                      application.languages.map((language, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                        >
                          {language}
                        </span>
                      ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Certifications
                  </label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Array.isArray(application.certifications) &&
                      application.certifications.map((cert, index) => (
                        <span
                          key={index}
                          className="inline-block bg-green-100 text-green-700 text-xs px-2 py-1 rounded"
                        >
                          {cert}
                        </span>
                      ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Job & Application Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Job & Application</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Applied Position
                  </label>
                  <p className="text-gray-900">{application.job?.title}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <p className="text-gray-900">{application.job?.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Branch
                  </label>
                  <p className="text-gray-900">
                    {application.job?.branch?.branchName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Availability Date
                  </label>
                  <p className="text-gray-900">
                    {application.availabilityDate
                      ? new Date(
                          application.availabilityDate
                        ).toLocaleDateString()
                      : "Not specified"}
                  </p>
                </div>
              </div>
            </div>

            {/* Cover Letter */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Cover Letter</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.coverLetter || "No cover letter provided."}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <div>
              {application.resumeUrl && (
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-2"
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
            </div>
            <div className="flex space-x-3">
              <select
                value={application.status}
                onChange={(e) =>
                  onStatusUpdate(
                    application.id,
                    e.target.value as Application["status"]
                  )
                }
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="PENDING">Pending</option>
                <option value="REVIEWED">Reviewed</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
