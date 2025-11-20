"use client";
import { motion } from "framer-motion";
import { Job, Branch } from "./types";
import { useState, useEffect } from "react";

interface JobListingsProps {
  branchFilter: string;
  branches: Branch[];
  onViewDetails: (job: Job) => void;
  onApplyNow: (job: Job) => void;
}

export default function JobListings({
  branchFilter,
  branches,
  onViewDetails,
  onApplyNow,
}: JobListingsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch jobs from API
  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch("/api/career/jobs");
        if (!res.ok) throw new Error("Failed to fetch jobs");
        const data = await res.json();
        setJobs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      branchFilter === "All Branches" || job.branches.includes(branchFilter)
  );

  const shortDesc = (text?: string, n = 120) => {
    if (!text) return "";
    return text.length > n ? `${text.slice(0, n).trim()}…` : text;
  };

  if (loading) {
    return (
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl shadow-lg border border-gray-200 bg-white animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="text-center text-red-600">
          Error loading jobs: {error}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
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
              <h3 className="text-xl font-semibold text-primary mb-2">
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
                Applicants: <strong>{job.applicants ?? 0}</strong>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewDetails(job)}
                  className="py-2 px-4 border rounded-lg text-sm text-primary hover:bg-primary/5 transition"
                >
                  View Details
                </button>

                <button
                  onClick={() => onApplyNow(job)}
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
  );
}
