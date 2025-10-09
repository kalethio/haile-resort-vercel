"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import jobOpenings from "../../data/jobs.json"; // <- JSON data prototype
import { v4 as uuidv4 } from "uuid";

/** -----------------------
 * Types
 * ------------------------ */
type Job = {
  id: string;
  title: string;
  department: string;
  branches: string[];
  type: string;
  location: string;
  experienceLevel?: string;
  salaryRange?: string;
  deadline?: string;
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  applicants?: number;
};

type Application = {
  id: string;
  jobId: string;
  jobTitle: string;
  appliedBranch: string;
  fullName: string;
  email: string;
  phone?: string;
  currentLocation?: string;
  educationLevel?: string;
  yearsExperience?: number;
  skills?: string[]; // normalized tags
  languages?: string[];
  certifications?: string[];
  availabilityDate?: string;
  willingToRelocate?: boolean;
  expectedSalary?: string;
  coverLetter?: string;
  resumeName?: string;
  resumeBase64?: string | null;
  submittedAt: string;
};

/** -----------------------
 * Local storage (mock API)
 * ------------------------ */
const LS_KEY = "career_applications_v1";

function loadApplications(): Application[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveApplications(apps: Application[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(apps));
}

/** -----------------------
 * Component
 * ------------------------ */
export default function CareerPage(): JSX.Element {
  // UI state
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null); // optional in-card expansion for quick preview
  const [detailsJob, setDetailsJob] = useState<Job | null>(null); // Job details modal
  const [applyJob, setApplyJob] = useState<Job | null>(null); // Apply modal

  // Branch filter
  const branches = useMemo(() => {
    const s = new Set<string>();
    (jobOpenings as Job[]).forEach((j) => j.branches.forEach((b) => s.add(b)));
    return ["All Branches", ...Array.from(s)];
  }, []);

  const [branchFilter, setBranchFilter] = useState<string>("All Branches");

  // Applications (mock DB)
  const [applications, setApplications] = useState<Application[]>(() =>
    typeof window !== "undefined" ? loadApplications() : []
  );

  // Apply form state
  const [formState, setFormState] = useState<Partial<Application>>({});
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs for outside-click detection (one per modal)
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const applyRef = useRef<HTMLDivElement | null>(null);

  // Filtered jobs by branch
  const filteredJobs: Job[] = useMemo(() => {
    if (branchFilter === "All Branches") return jobOpenings as Job[];
    return (jobOpenings as Job[]).filter((j) =>
      j.branches.includes(branchFilter)
    );
  }, [branchFilter]);

  // Close modals on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        detailsJob &&
        detailsRef.current &&
        !detailsRef.current.contains(e.target as Node)
      ) {
        setDetailsJob(null);
      }
      if (
        applyJob &&
        applyRef.current &&
        !applyRef.current.contains(e.target as Node)
      ) {
        setApplyJob(null);
      }
    }
    if (detailsJob || applyJob)
      document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [detailsJob, applyJob]);

  // Clear success message timeout
  useEffect(() => {
    if (!successMessage) return;
    const t = setTimeout(() => setSuccessMessage(null), 4500);
    return () => clearTimeout(t);
  }, [successMessage]);

  // Helper: convert file to base64 (prototype only)
  function fileToBase64(file: File): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(String(reader.result));
      reader.onerror = (err) => rej(err);
      reader.readAsDataURL(file);
    });
  }

  // Utility: parse CSV to array
  function csvToArray(s?: string | string[]): string[] {
    if (!s) return [];
    if (Array.isArray(s)) return s;
    return s
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }

  // Submit application (mock persist)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!applyJob) return;
    setSubmitting(true);

    try {
      if (!formState.fullName || !formState.email) {
        alert("Please provide at least full name and email.");
        setSubmitting(false);
        return;
      }

      const id = uuidv4();
      const resumeBase64 = resumeFile ? await fileToBase64(resumeFile) : null;

      const newApp: Application = {
        id,
        jobId: applyJob.id,
        jobTitle: applyJob.title,
        appliedBranch:
          (formState.appliedBranch as string) ||
          applyJob.branches[0] ||
          "Unspecified",
        fullName: String(formState.fullName || ""),
        email: String(formState.email || ""),
        phone: String(formState.phone || ""),
        currentLocation: String(formState.currentLocation || ""),
        educationLevel: String(formState.educationLevel || ""),
        yearsExperience: formState.yearsExperience
          ? Number(formState.yearsExperience)
          : 0,
        skills: csvToArray(formState.skills as string),
        languages: csvToArray(formState.languages as string),
        certifications: csvToArray(formState.certifications as string),
        availabilityDate: String(formState.availabilityDate || ""),
        willingToRelocate: Boolean(formState.willingToRelocate),
        expectedSalary: String(formState.expectedSalary || ""),
        coverLetter: String(formState.coverLetter || ""),
        resumeName: resumeFile ? resumeFile.name : undefined,
        resumeBase64,
        submittedAt: new Date().toISOString(),
      };

      const updated = [newApp, ...applications];
      setApplications(updated);
      saveApplications(updated);

      // Prototype: update in-memory job applicant count (backend will own this later)
      const idx = (jobOpenings as Job[]).findIndex((j) => j.id === applyJob.id);
      if (idx >= 0) {
        (jobOpenings as any)[idx].applicants =
          ((jobOpenings as any)[idx].applicants || 0) + 1;
      }

      setSuccessMessage("Application submitted successfully.");
      setApplyJob(null);
      setFormState({});
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      alert("Submission failed — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Short description for card
  function shortDesc(text?: string, n = 120) {
    if (!text) return "";
    return text.length > n ? `${text.slice(0, n).trim()}…` : text;
  }

  return (
    <main className="w-full min-h-screen bg-bg text-gray-900">
      {/* HERO */}
      <section className="w-full text-center mt-16 py-16 px-4 bg-primary/20 text-text/80">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Discover opportunities to grow your career and make an impact with us.
        </p>
      </section>

      {/* JOB OPENINGS + FILTER */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-primary">Job Openings</h2>

          {/* Branch filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Branch</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="border rounded-lg p-2"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {filteredJobs.length === 0 && (
            <div className="col-span-full text-center text-gray-600">
              No openings for selected branch.
            </div>
          )}

          {filteredJobs.map((job: Job) => (
            <motion.article
              key={job.id}
              whileHover={{ scale: 1.02 }}
              className="p-6 rounded-2xl shadow-lg border border-gray-200 bg-white flex flex-col justify-between"
            >
              <div>
                <h3
                  className="text-xl font-semibold text-primary mb-2"
                  title={job.title}
                >
                  {job.title}
                </h3>

                <div className="text-sm text-gray-600 mb-2">
                  <span>{job.location}</span> · <span>{job.type}</span> ·{" "}
                  <span>{job.experienceLevel ?? "Any"}</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  {job.branches.map((b) => (
                    <span
                      key={b}
                      className="text-xs px-2 py-1 rounded-full border bg-white/50"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                <p className="text-sm text-gray-700">
                  {shortDesc(job.description)}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Applicants: <strong>{(job as any).applicants ?? 0}</strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDetailsJob(job)}
                    className="py-2 px-4 border rounded-lg text-sm text-primary hover:bg-primary/5 transition"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      setApplyJob(job);
                      setFormState((s) => ({
                        ...s,
                        appliedBranch:
                          branchFilter !== "All Branches" &&
                          job.branches.includes(branchFilter)
                            ? branchFilter
                            : job.branches[0],
                      }));
                    }}
                    className="py-2 px-4 bg-accent text-white rounded-lg hover:opacity-95 transition"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {detailsJob && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={detailsRef}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full overflow-auto max-h-[90vh]"
            >
              <header className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {detailsJob.title}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {detailsJob.location} · {detailsJob.type}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setDetailsJob(null)}
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
              </header>

              <section className="text-sm text-gray-700 space-y-4">
                <div>
                  <strong>Branches:</strong> {detailsJob.branches.join(", ")}
                </div>

                <div>
                  <strong>Experience Level:</strong>{" "}
                  {detailsJob.experienceLevel ?? "Any"}
                </div>

                <div>
                  <strong>Salary:</strong>{" "}
                  {detailsJob.salaryRange ?? "Competitive"}
                </div>

                <div>
                  <strong>Deadline:</strong>{" "}
                  {detailsJob.deadline ?? "Open until filled"}
                </div>

                <div>
                  <h3 className="mt-2 font-semibold text-gray-800">
                    Description
                  </h3>
                  <p>{detailsJob.description}</p>
                </div>

                {detailsJob.responsibilities?.length ? (
                  <div>
                    <h3 className="mt-2 font-semibold text-gray-800">
                      Responsibilities
                    </h3>
                    <ul className="list-disc ml-5">
                      {detailsJob.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {detailsJob.requirements?.length ? (
                  <div>
                    <h3 className="mt-2 font-semibold text-gray-800">
                      Requirements
                    </h3>
                    <ul className="list-disc ml-5">
                      {detailsJob.requirements.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>

              <footer className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setApplyJob(detailsJob);
                    setDetailsJob(null);
                    setFormState((s) => ({
                      ...s,
                      appliedBranch:
                        branchFilter !== "All Branches" &&
                        detailsJob.branches.includes(branchFilter)
                          ? branchFilter
                          : detailsJob.branches[0],
                    }));
                  }}
                  className="py-2 px-6 bg-primary text-white rounded-lg hover:opacity-95"
                >
                  Apply for this job
                </button>
              </footer>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* APPLY MODAL */}
      <AnimatePresence>
        {applyJob && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={applyRef}
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="bg-white p-6 rounded-2xl shadow-lg max-w-3xl w-full overflow-auto max-h-[90vh]"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Apply — {applyJob.title}
                  </h2>
                  <p className="text-sm text-gray-600">{applyJob.location}</p>
                </div>
                <div>
                  <button
                    onClick={() => setApplyJob(null)}
                    className="text-sm text-gray-500 hover:text-gray-800"
                  >
                    Close
                  </button>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-4"
              >
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
                    Preferred Branch (if applicable)
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
                    {applyJob.branches.map((b) => (
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
                    value={(formState.skills || []).join(", ")}
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
                    value={(formState.languages || []).join(", ")}
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
                    value={(formState.certifications || []).join(", ")}
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
                      setFormState({
                        ...formState,
                        coverLetter: e.target.value,
                      })
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
                      onClick={() => setApplyJob(null)}
                      className="py-2 px-4 rounded-lg border text-gray-700 hover:bg-gray-100"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="py-2 px-6 bg-primary text-white rounded-lg hover:opacity-95"
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

      {/* EVP SECTION (unchanged) */}
      <section className="py-20 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          Our Employee Value Proposition
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              title: "Strength in Unity",
              tagline: "United for excellence",
              description:
                "We value the distinctive talents of individuals and foster a culture of partnership, aligning collective strengths to deliver outstanding results.",
            },
            {
              title: "Career Growth & Personal Enrichment",
              tagline: "Empowering your potential",
              description:
                "We provide a dynamic environment that blends challenge with opportunity, empowering our people to advance their careers while nurturing creativity and personal enrichment.",
            },
            {
              title: "Inclusive by Nature, United by Purpose",
              tagline: "Belong. Grow. Thrive",
              description:
                "We embrace diversity and foster an inclusive environment where every individual feels valued, supported, and empowered to grow and succeed.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white shadow-md border border-gray-200"
            >
              <h3 className="text-xl font-semibold text-primary mb-1">
                {item.title}
              </h3>
              <p className="text-sm font-medium text-accent mb-2">
                {item.tagline}
              </p>
              <p className="text-gray-700 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Success toast */}
      {successMessage && (
        <div className="fixed right-6 bottom-6 bg-green-600 text-white px-4 py-2 rounded-lg shadow">
          {successMessage}
        </div>
      )}
    </main>
  );
}
