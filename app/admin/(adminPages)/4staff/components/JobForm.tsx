// admin/(adminPages)/4staff/career/components/JobForm.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Job, Branch } from "./types";

interface JobFormProps {
  job?: Job | null;
  onClose: () => void;
  onSave: () => void;
}

export default function JobForm({ job, onClose, onSave }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    location: "",
    type: "Full-time" as const,
    experienceLevel: "Mid" as const,
    salaryRange: "Competitive" as const,
    deadline: "",
    responsibilities: [""],
    requirements: [""],
    published: false,
    branchIds: [] as number[],
  });

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/branches");
        const data = await response.json();
        console.log("🏨 Fetched branches:", data);
        setBranches(data);
      } catch (error) {
        console.error("Failed to fetch branches:", error);
      }
    };
    fetchBranches();
  }, []);

  // Populate form if editing
  useEffect(() => {
    if (job) {
      console.log("🔄 Populating form with job data:", {
        jobBranchIds: job.branchIds,
      });

      setFormData({
        title: job.title || "",
        department: job.department || "",
        description: job.description || "",
        location: job.location || "",
        type: job.type || "Full-time",
        experienceLevel: job.experienceLevel || "Mid",
        salaryRange: job.salaryRange || "Competitive",
        deadline: job.deadline || "",
        responsibilities: job.responsibilities?.length
          ? job.responsibilities
          : [""],
        requirements: job.requirements?.length ? job.requirements : [""],
        published: job.published || false,
        branchIds: job.branchIds?.length ? job.branchIds : [],
      });
    }
  }, [job]);

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (formData.branchIds.length === 0) {
      newErrors.branches = "Select at least one branch";
    }

    // Validate deadline if provided
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (deadlineDate < today) {
        newErrors.deadline = "Deadline cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("🚀 Submitting form with branchIds:", formData.branchIds);

    if (!validateForm()) {
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const element = document.querySelector(`[data-error="${firstError}"]`);
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);

    try {
      const url = job
        ? `/api/admin/career/jobs/${job.id}`
        : "/api/admin/career/jobs";

      const method = job ? "PUT" : "POST";

      // Filter out empty array items and prepare data
      const payload = {
        ...formData,
        responsibilities: formData.responsibilities
          .filter((r) => r.trim())
          .map((r) => r.trim()),
        requirements: formData.requirements
          .filter((r) => r.trim())
          .map((r) => r.trim()),
        deadline: formData.deadline || "",
      };

      console.log("📦 Final payload:", payload);

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to save job");
      }

      onSave();
    } catch (error) {
      console.error("Error saving job:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to save job. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fixed branch selection handler
  const handleBranchToggle = (branchId: number, checked: boolean) => {
    console.log("🔴 Branch toggle:", {
      branchId,
      checked,
      currentBranchIds: formData.branchIds,
    });

    if (checked) {
      // Add branch if not already in the array
      if (!formData.branchIds.includes(branchId)) {
        setFormData((prev) => ({
          ...prev,
          branchIds: [...prev.branchIds, branchId],
        }));
      }
    } else {
      // Remove branch from array
      setFormData((prev) => ({
        ...prev,
        branchIds: prev.branchIds.filter((id) => id !== branchId),
      }));
    }

    // Clear branch errors when user interacts
    if (errors.branches) {
      setErrors((prev) => ({ ...prev, branches: "" }));
    }
  };

  // Array field handlers
  const addResponsibility = () => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: [...prev.responsibilities, ""],
    }));
  };

  const updateResponsibility = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      responsibilities: prev.responsibilities.map((r, i) =>
        i === index ? value : r
      ),
    }));
  };

  const removeResponsibility = (index: number) => {
    if (formData.responsibilities.length > 1) {
      setFormData((prev) => ({
        ...prev,
        responsibilities: prev.responsibilities.filter((_, i) => i !== index),
      }));
    }
  };

  const addRequirement = () => {
    setFormData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }));
  };

  const updateRequirement = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      requirements: prev.requirements.map((r, i) => (i === index ? value : r)),
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      setFormData((prev) => ({
        ...prev,
        requirements: prev.requirements.filter((_, i) => i !== index),
      }));
    }
  };

  // Format date for input field (YYYY-MM-DD)
  const getTodayDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  if (!isMounted) {
    return null;
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {job ? "Edit Job Posting" : "Create New Job Posting"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {job
                  ? "Update the job details"
                  : "Fill in the job details to create a new posting"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Form Content - Scrollable */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Basic Information Section */}
              <div className="bg-gray-50 rounded-lg p-4" data-error="title">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }));
                        if (errors.title)
                          setErrors((prev) => ({ ...prev, title: "" }));
                      }}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.title ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="e.g., Front Desk Supervisor"
                    />
                    {errors.title && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department
                    </label>
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Reception"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Haile Hawassa Resort"
                    />
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          type: e.target.value as typeof formData.type,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={formData.experienceLevel}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          experienceLevel: e.target
                            .value as typeof formData.experienceLevel,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Entry">Entry Level</option>
                      <option value="Mid">Mid Level</option>
                      <option value="Senior">Senior Level</option>
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Salary Range
                    </label>
                    <select
                      value={formData.salaryRange}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          salaryRange: e.target
                            .value as typeof formData.salaryRange,
                        }))
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="Competitive">Competitive</option>
                      <option value="Negotiable">Negotiable</option>
                      <option value="Hourly">Hourly</option>
                      <option value="Commission">Commission Based</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div data-error="description">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                    if (errors.description)
                      setErrors((prev) => ({ ...prev, description: "" }));
                  }}
                  rows={4}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Branches Selection - FIXED VERSION */}
              <div data-error="branches">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Branches *
                </label>
                <div
                  className={`border rounded-lg p-4 ${
                    errors.branches
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {branches.length === 0 ? (
                    <p className="text-gray-500 text-sm">Loading branches...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {branches.map((branch) => (
                        <div
                          key={branch.id}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded transition-colors"
                        >
                          <input
                            type="checkbox"
                            id={`branch-${branch.id}`}
                            checked={formData.branchIds.includes(branch.id)}
                            onChange={(e) =>
                              handleBranchToggle(branch.id, e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                          />
                          <label
                            htmlFor={`branch-${branch.id}`}
                            className="text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            {branch.branchName}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.branches && (
                    <p className="text-red-600 text-xs mt-2">
                      {errors.branches}
                    </p>
                  )}

                  {/* Selection Summary */}
                  {formData.branchIds.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Selected: {formData.branchIds.length} branch
                        {formData.branchIds.length !== 1 ? "es" : ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-500 mt-2">
                  Select the branches where this job position is available
                </p>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Key Responsibilities
                </label>
                <div className="space-y-3">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div
                      key={`responsibility-${index}`}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={responsibility}
                          onChange={(e) =>
                            updateResponsibility(index, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Manage front desk operations"
                        />
                      </div>
                      {formData.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResponsibility(index)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addResponsibility}
                    disabled={loading}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Add Responsibility</span>
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Requirements
                </label>
                <div className="space-y-3">
                  {formData.requirements.map((requirement, index) => (
                    <div
                      key={`requirement-${index}`}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-1">
                        <input
                          type="text"
                          value={requirement}
                          onChange={(e) =>
                            updateRequirement(index, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 2+ years experience in hospitality"
                        />
                      </div>
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRequirement}
                    disabled={loading}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <span>Add Requirement</span>
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label
                      htmlFor="published"
                      className="text-sm font-medium text-gray-700"
                    >
                      Publish this job posting
                    </label>
                    <p className="text-sm text-gray-500 mt-1">
                      Published jobs will be visible on the career page
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        published: e.target.checked,
                      }))
                    }
                    disabled={loading}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                {/* Deadline */}
                <div className="mt-4" data-error="deadline">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Application Deadline (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        deadline: e.target.value,
                      }));
                      if (errors.deadline)
                        setErrors((prev) => ({ ...prev, deadline: "" }));
                    }}
                    min={getTodayDate()}
                    className={`w-full max-w-xs border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.deadline ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                  {errors.deadline && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.deadline}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed Footer with Actions */}
            <div className="border-t border-gray-200 bg-white p-6 sticky bottom-0">
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{job ? "Update Job" : "Create Job"}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
