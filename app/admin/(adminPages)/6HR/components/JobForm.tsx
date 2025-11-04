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

  // Fixed branch selection handler - SIMPLIFIED
  const handleBranchToggle = (branchId: number) => {
    console.log(
      "Toggling branch:",
      branchId,
      "Current branchIds:",
      formData.branchIds
    );

    setFormData((prev) => {
      const isSelected = prev.branchIds.includes(branchId);
      console.log("Is currently selected:", isSelected);

      if (isSelected) {
        return {
          ...prev,
          branchIds: prev.branchIds.filter((id) => id !== branchId),
        };
      } else {
        return {
          ...prev,
          branchIds: [...prev.branchIds, branchId],
        };
      }
    });
  };
  // Select all branches
  const handleSelectAllBranches = () => {
    const allBranchIds = branches.map((branch) => branch.id);
    setFormData((prev) => ({
      ...prev,
      branchIds: allBranchIds,
    }));
  };

  // Clear all branch selections
  const handleClearAllBranches = () => {
    setFormData((prev) => ({
      ...prev,
      branchIds: [],
    }));
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
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-gray-300"
        >
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-300 bg-white">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {job ? "Edit Job Posting" : "Create New Job Posting"}
              </h2>
              <p className="text-gray-700 text-sm mt-1">
                {job
                  ? "Update the job details and requirements"
                  : "Fill in the job details to create a new posting"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
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
              <div
                className="bg-gray-50 rounded-lg p-6 border border-gray-300"
                data-error="title"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                      className={`w-full border bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., Front Desk Supervisor"
                    />
                    {errors.title && (
                      <p className="text-red-600 text-sm font-medium">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                      className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Reception & Front Desk"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                      className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-500"
                      placeholder="e.g., Haile Hawassa Resort"
                    />
                  </div>

                  {/* Job Type */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                      className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Seasonal">Seasonal</option>
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                      className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
                    >
                      <option value="Entry">Entry Level (0-2 years)</option>
                      <option value="Mid">Mid Level (2-5 years)</option>
                      <option value="Senior">Senior Level (5+ years)</option>
                    </select>
                  </div>

                  {/* Salary Range */}
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
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
                      className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900"
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
              <div className="space-y-3" data-error="description">
                <label className="block text-sm font-semibold text-gray-900">
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
                  rows={5}
                  className={`w-full border bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none text-gray-900 placeholder-gray-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe the role, responsibilities, team environment, and what makes this position exciting for potential candidates..."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm font-medium">
                    {errors.description}
                  </p>
                )}
                <p className="text-sm text-gray-700">
                  Provide a compelling description that highlights the role's
                  impact and opportunities
                </p>
              </div>

              {/* Branches Selection - FIXED VERSION */}
              <div className="space-y-3" data-error="branches">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-gray-900">
                    Available Branches *
                  </label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handleSelectAllBranches}
                      disabled={loading || branches.length === 0}
                      className="text-xs text-primary hover:text-primary/80 font-medium px-3 py-1 border border-primary rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllBranches}
                      disabled={loading || formData.branchIds.length === 0}
                      className="text-xs text-gray-600 hover:text-gray-800 font-medium px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                <div
                  className={`border rounded-lg p-4 ${
                    errors.branches
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {branches.length === 0 ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                      <span className="ml-2 text-gray-700">
                        Loading branches...
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {branches.map((branch) => (
                        <div
                          key={`branch-${branch.id}`}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-all"
                        >
                          <input
                            type="checkbox"
                            id={`branch-${branch.id}`}
                            checked={formData.branchIds.includes(branch.id)}
                            onChange={() => handleBranchToggle(branch.id)}
                            className="w-4 h-4 text-primary rounded focus:ring-primary border-gray-400 cursor-pointer"
                          />
                          <label
                            htmlFor={`branch-${branch.id}`}
                            className="text-sm font-medium text-gray-900 cursor-pointer flex-1"
                          >
                            {branch.branchName}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.branches && (
                    <p className="text-red-600 text-sm font-medium mt-3">
                      {errors.branches}
                    </p>
                  )}

                  {/* Selection Summary */}
                  {formData.branchIds.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-gray-300">
                      <p className="text-sm font-medium text-gray-900">
                        Selected {formData.branchIds.length} out of{" "}
                        {branches.length} branch
                        {formData.branchIds.length !== 1 ? "es" : ""}
                      </p>
                    </div>
                  )}
                </div>

                {/* Help Text */}
                <p className="text-sm text-gray-700">
                  Select the branches where this job position is available.
                  Candidates will see these locations when applying.
                </p>
              </div>

              {/* Rest of the form remains the same */}
              {/* Responsibilities */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Key Responsibilities
                </label>
                <div className="space-y-3">
                  {formData.responsibilities.map((responsibility, index) => (
                    <div
                      key={`responsibility-${index}`}
                      className="flex items-center space-x-3 group"
                    >
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={responsibility}
                            onChange={(e) =>
                              updateResponsibility(index, e.target.value)
                            }
                            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-500 pl-10"
                            placeholder="Describe a key responsibility..."
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            {index + 1}.
                          </div>
                        </div>
                      </div>
                      {formData.responsibilities.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeResponsibility(index)}
                          disabled={loading}
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                          title="Remove responsibility"
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
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium py-3 px-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
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
                    <span>Add Another Responsibility</span>
                  </button>
                </div>
              </div>

              {/* Requirements */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-900">
                  Requirements & Qualifications
                </label>
                <div className="space-y-3">
                  {formData.requirements.map((requirement, index) => (
                    <div
                      key={`requirement-${index}`}
                      className="flex items-center space-x-3 group"
                    >
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="text"
                            value={requirement}
                            onChange={(e) =>
                              updateRequirement(index, e.target.value)
                            }
                            className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 placeholder-gray-500 pl-10"
                            placeholder="List a requirement or qualification..."
                          />
                          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                            {index + 1}.
                          </div>
                        </div>
                      </div>
                      {formData.requirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRequirement(index)}
                          disabled={loading}
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-gray-300"
                          title="Remove requirement"
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
                    className="flex items-center space-x-2 text-primary hover:text-primary/80 text-sm font-medium py-3 px-4 border border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full justify-center"
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
                    <span>Add Another Requirement</span>
                  </button>
                </div>
              </div>

              {/* Additional Options */}
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <label
                      htmlFor="published"
                      className="text-sm font-semibold text-gray-900"
                    >
                      Publish this job posting
                    </label>
                    <p className="text-sm text-gray-700 mt-1">
                      Published jobs will be visible on the career page
                      immediately
                    </p>
                  </div>
                  <div className="relative">
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
                      className="sr-only"
                    />
                    <label
                      htmlFor="published"
                      className={`block w-12 h-6 rounded-full transition-all duration-300 ease-in-out cursor-pointer border ${
                        formData.published
                          ? "bg-primary border-primary"
                          : "bg-gray-300 border-gray-400"
                      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <span
                        className={`block w-4 h-4 mt-1 ml-1 rounded-full bg-white transition-all duration-300 ease-in-out ${
                          formData.published ? "transform translate-x-6" : ""
                        }`}
                      />
                    </label>
                  </div>
                </div>

                {/* Deadline */}
                <div className="space-y-3" data-error="deadline">
                  <label className="block text-sm font-semibold text-gray-900">
                    Application Deadline (Optional)
                  </label>
                  <div className="flex items-center space-x-3">
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
                      className={`border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 ${
                        errors.deadline ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {formData.deadline && (
                      <span className="text-sm text-gray-700">
                        Applications close on{" "}
                        {new Date(formData.deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {errors.deadline && (
                    <p className="text-red-600 text-sm font-medium">
                      {errors.deadline}
                    </p>
                  )}
                  <p className="text-sm text-gray-700">
                    Leave empty to keep the job posting open indefinitely
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Footer with Actions */}
            <div className="border-t border-gray-300 bg-white p-6 sticky bottom-0">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-700">
                  {formData.branchIds.length > 0 && (
                    <span>
                      Available at {formData.branchIds.length} branch
                      {formData.branchIds.length !== 1 ? "es" : ""}
                    </span>
                  )}
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>
                        {job ? "Update Job Posting" : "Create Job Posting"}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
