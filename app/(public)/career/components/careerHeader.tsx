"use client";
import { Branch } from "./types";

interface CareerHeaderProps {
  branchFilter: string;
  onBranchFilterChange: (branch: string) => void;
  branches: Branch[];
}

export default function CareerHeader({
  branchFilter,
  onBranchFilterChange,
  branches,
}: CareerHeaderProps) {
  const branchOptions = ["All Branches", ...branches.map((b) => b.branchName)];

  return (
    <>
      {/* HERO */}
      <section className="w-full text-center mt-16 py-16 px-4 bg-primary/20 text-text/80">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Discover opportunities to grow your career and make an impact with us.
        </p>
      </section>

      {/* FILTER HEADER */}
      <section className="py-12 px-4 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-primary">Job Openings</h2>

          {/* Branch filter */}
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600">Branch</label>
            <select
              value={branchFilter}
              onChange={(e) => onBranchFilterChange(e.target.value)}
              className="border rounded-lg p-2"
            >
              {branchOptions.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
    </>
  );
}
