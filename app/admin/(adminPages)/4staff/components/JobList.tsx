// admin/(adminPages)/4staff/career/components/JobList.tsx
"use client";

import { Job } from "./types";

interface JobListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onRefresh: () => void;
}

export default function JobList({ jobs, onEdit, onRefresh }: JobListProps) {
  const handleTogglePublish = async (job: Job, published: boolean) => {
    try {
      const response = await fetch(`/api/admin/career/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published }),
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to update job:", error);
    }
  };

  const handleDelete = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      const response = await fetch(`/api/admin/career/jobs/${jobId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onRefresh();
      }
    } catch (error) {
      console.error("Failed to delete job:", error);
    }
  };

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-gray-500">
          <svg
            className="mx-auto h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900">No jobs posted</h3>
          <p className="mt-1 text-gray-500">
            Get started by creating your first job posting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <li key={job.id}>
            <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {job.title}
                      {!job.published && (
                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Draft
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {job.department} • {job.location} • {job.type}
                    </p>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="text-xs text-gray-500">
                        Branches: {job.branches.join(", ")}
                      </span>
                      <span className="text-xs text-gray-500">
                        • Applicants: {job.applicants || 0}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Publish Toggle */}
                    <button
                      onClick={() => handleTogglePublish(job, !job.published)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        job.published
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {job.published ? "Published" : "Draft"}
                    </button>

                    {/* Edit Button */}
                    <button
                      onClick={() => onEdit(job)}
                      className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                    >
                      Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
