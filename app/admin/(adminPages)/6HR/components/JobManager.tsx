// admin/(adminPages)/4staff/career/components/JobManager.tsx
"use client";

import { useState, useEffect } from "react";
import { Job } from "@/components/career/types";
import JobList from "./JobList";
import JobForm from "./JobForm";

export default function JobManager() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/admin/career/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleCreateJob = () => {
    setEditingJob(null);
    setShowForm(true);
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingJob(null);
    fetchJobs();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header with Stats and Create Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Job Postings</h2>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-sm text-gray-600">
              Total: <span className="font-medium">{jobs.length}</span>
            </span>
            <span className="text-sm text-gray-600">
              Published:{" "}
              <span className="font-medium text-green-600">
                {jobs.filter((j) => j.published).length}
              </span>
            </span>
            <span className="text-sm text-gray-600">
              Drafts:{" "}
              <span className="font-medium text-yellow-600">
                {jobs.filter((j) => !j.published).length}
              </span>
            </span>
          </div>
        </div>

        <button
          onClick={handleCreateJob}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Create Job</span>
        </button>
      </div>

      {/* Job List */}
      <JobList jobs={jobs} onEdit={handleEditJob} onRefresh={fetchJobs} />

      {/* Job Form Modal */}
      {showForm && (
        <JobForm
          job={editingJob}
          onClose={handleFormClose}
          onSave={handleFormClose}
        />
      )}
    </div>
  );
}
