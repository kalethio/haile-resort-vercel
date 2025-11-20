"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Job, Branch, Application } from "./types";

interface ApplicationFormProps {
  job: Job | null;
  onClose: () => void;
  branches: Branch[];
  branchFilter: string;
}

export default function ApplicationForm({
  job,
  onClose,
  branches,
  branchFilter,
}: ApplicationFormProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState<Partial<Application>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (job) {
      document.addEventListener("mousedown", handleClickOutside);
      // Initialize form with branch selection
      setFormState((prev) => ({
        ...prev,
        appliedBranch:
          branchFilter !== "All Branches" && job.branches.includes(branchFilter)
            ? branchFilter
            : job.branches[0],
      }));
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [job, onClose, branchFilter]);

  // Helper function to safely get array or string value for display
  const getDisplayValue = (value: any): string => {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return value || "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;
    setSubmitting(true);

    try {
      const formData = new FormData();

      // Add all form fields
      Object.entries(formState).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, value.join(", "));
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      // Add job reference
      formData.append("jobId", job.id);
      formData.append("jobTitle", job.title);

      // Add resume file
      if (resumeFile) {
        formData.append("resume", resumeFile);
      }

      const response = await fetch("/api/career/applications", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        // Success - show confirmation
        alert("Application submitted successfully!");
        onClose();
        setFormState({});
        setResumeFile(null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to submit application. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <AnimatePresence>
      {job && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl w-full overflow-auto max-h-[90vh]"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">
                  Apply — {job.title}
                </h2>
                <p className="text-sm text-gray-600">{job.location}</p>
              </div>
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
              {/* Left column */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={formState.fullName ?? ""}
                  onChange={(e) =>
                    setFormState({ ...formState, fullName: e.target.value })
                  }
                  type="text"
                  placeholder="First Last"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  required
                  value={formState.email ?? ""}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  type="email"
                  placeholder="name@example.com"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  value={formState.phone ?? ""}
                  onChange={(e) =>
                    setFormState({ ...formState, phone: e.target.value })
                  }
                  type="tel"
                  placeholder="+251 9xx xxx xxx"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Branch
                </label>
                <select
                  value={formState.appliedBranch ?? ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      appliedBranch: e.target.value,
                    })
                  }
                  className="w-full border rounded-lg p-3 mb-3"
                >
                  {job.branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Location
                </label>
                <input
                  value={formState.currentLocation ?? ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      currentLocation: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="City / Town"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <input
                  value={formState.educationLevel ?? ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      educationLevel: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="e.g., Diploma in Hospitality"
                  className="w-full border rounded-lg p-3 mb-3"
                />
              </div>

              {/* Right column */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  value={String(formState.yearsExperience ?? "")}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      yearsExperience: e.target.value
                        ? Number(e.target.value)
                        : 0,
                    })
                  }
                  type="number"
                  min={0}
                  placeholder="0"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <input
                  value={getDisplayValue(formState.skills)}
                  onChange={(e) =>
                    setFormState({ ...formState, skills: e.target.value })
                  }
                  type="text"
                  placeholder="Customer service, POS, Housekeeping, Food Safety"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages (comma separated)
                </label>
                <input
                  value={getDisplayValue(formState.languages)}
                  onChange={(e) =>
                    setFormState({ ...formState, languages: e.target.value })
                  }
                  type="text"
                  placeholder="Amharic, English"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications (comma separated)
                </label>
                <input
                  value={getDisplayValue(formState.certifications)}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      certifications: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="First Aid, Food Safety Certificate"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability Date
                </label>
                <input
                  value={formState.availabilityDate ?? ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      availabilityDate: e.target.value,
                    })
                  }
                  type="date"
                  className="w-full border rounded-lg p-3 mb-3"
                />

                <label className="flex items-center gap-3 text-sm mb-3">
                  <input
                    type="checkbox"
                    checked={Boolean(formState.willingToRelocate)}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        willingToRelocate: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  Willing to relocate?
                </label>

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expected Salary
                </label>
                <input
                  value={formState.expectedSalary ?? ""}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      expectedSalary: e.target.value,
                    })
                  }
                  type="text"
                  placeholder="E.g., Negotiable / 80,000 ETB"
                  className="w-full border rounded-lg p-3 mb-3"
                />
              </div>

              {/* Full width */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter / Short Summary
                </label>
                <textarea
                  value={formState.coverLetter ?? ""}
                  onChange={(e) =>
                    setFormState({ ...formState, coverLetter: e.target.value })
                  }
                  placeholder="Briefly explain why you're a good fit (max 300 words)"
                  className="w-full border rounded-lg p-3 h-28 mb-3"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Resume (PDF or DOC)
                </label>
                <input
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  type="file"
                  className="w-full border rounded-lg p-3 mb-3 cursor-pointer"
                />

                <div className="flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 rounded-lg border text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="py-2 px-6 bg-primary text-white rounded-lg hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
