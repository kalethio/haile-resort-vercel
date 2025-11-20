"use client";
import { useState, useEffect } from "react";
import CareerHeader from "./components/careerHeader";
import JobListings from "./components/JobListings";
import JobDetailsModal from "./components/JobDetails";
import ApplicationForm from "./components/ApplicationForm";
import ValuesSection from "./components/ValueSection";
import { Job, Branch } from "./components/types";

export default function CareerPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [detailsJob, setDetailsJob] = useState<Job | null>(null);
  const [applyJob, setApplyJob] = useState<Job | null>(null);

  // Fetch branches from API (like navbar)
  useEffect(() => {
    async function fetchBranches() {
      const res = await fetch("/api/branches");
      const data = await res.json();
      setBranches(data);
    }
    fetchBranches();
  }, []);

  return (
    <main className="w-full min-h-screen bg-bg text-gray-900">
      <CareerHeader
        branchFilter={branchFilter}
        onBranchFilterChange={setBranchFilter}
        branches={branches}
      />

      <JobListings
        branchFilter={branchFilter}
        branches={branches}
        onViewDetails={setDetailsJob}
        onApplyNow={setApplyJob}
      />

      <JobDetailsModal
        job={detailsJob}
        onClose={() => setDetailsJob(null)}
        onApply={(job) => {
          setDetailsJob(null);
          setApplyJob(job);
        }}
        branchFilter={branchFilter}
      />

      <ApplicationForm
        job={applyJob}
        onClose={() => setApplyJob(null)}
        branches={branches}
        branchFilter={branchFilter}
      />

      <ValuesSection />
    </main>
  );
}
