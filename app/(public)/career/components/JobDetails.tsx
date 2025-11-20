"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect } from "react";
import { Job } from "./types";

interface JobDetailsModalProps {
  job: Job | null;
  onClose: () => void;
  onApply: (job: Job) => void;
  branchFilter: string;
}

export default function JobDetailsModal({
  job,
  onClose,
  onApply,
  branchFilter,
}: JobDetailsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (job) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [job, onClose]);

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
            className="bg-white p-8 rounded-2xl shadow-xl max-w-3xl w-full overflow-auto max-h-[90vh]"
          >
            <header className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold text-primary">{job.title}</h2>
                <p className="text-sm text-gray-600">
                  {job.location} · {job.type}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-sm text-gray-500 hover:text-gray-800"
              >
                Close
              </button>
            </header>

            <section className="text-sm text-gray-700 space-y-4">
              <div>
                <strong>Branches:</strong> {job.branches.join(", ")}
              </div>
              <div>
                <strong>Experience Level:</strong>{" "}
                {job.experienceLevel ?? "Any"}
              </div>
              <div>
                <strong>Salary:</strong> {job.salaryRange ?? "Competitive"}
              </div>
              <div>
                <strong>Deadline:</strong> {job.deadline ?? "Open until filled"}
              </div>

              <div>
                <h3 className="mt-2 font-semibold text-gray-800">
                  Description
                </h3>
                <p>{job.description}</p>
              </div>

              {job.responsibilities?.length ? (
                <div>
                  <h3 className="mt-2 font-semibold text-gray-800">
                    Responsibilities
                  </h3>
                  <ul className="list-disc ml-5">
                    {job.responsibilities.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {job.requirements?.length ? (
                <div>
                  <h3 className="mt-2 font-semibold text-gray-800">
                    Requirements
                  </h3>
                  <ul className="list-disc ml-5">
                    {job.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            <footer className="mt-6 flex justify-end">
              <button
                onClick={() => onApply(job)}
                className="py-2 px-6 bg-primary text-white rounded-lg hover:opacity-95"
              >
                Apply for this job
              </button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
