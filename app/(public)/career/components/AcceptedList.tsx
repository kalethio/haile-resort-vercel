"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AcceptedEntry {
  id: number;
  fullName: string;
  jobTitle: string;
  branchName: string;
}

export default function AcceptedList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<AcceptedEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    if (data.length > 0) return;

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/career/accepted");
        if (!res.ok) throw new Error("Failed to load accepted list");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [open, data.length]);

  // Group by branch, then by job title
  const grouped: Record<string, Record<string, AcceptedEntry[]>> = {};
  for (const entry of data) {
    if (!grouped[entry.branchName]) grouped[entry.branchName] = {};
    if (!grouped[entry.branchName][entry.jobTitle]) {
      grouped[entry.branchName][entry.jobTitle] = [];
    }
    grouped[entry.branchName][entry.jobTitle].push(entry);
  }

  return (
    <>
      <div className="w-full flex justify-center py-6 px-4">
        <button
          onClick={() => setOpen(true)}
          className="py-3 px-6 bg-primary text-white rounded-lg hover:opacity-95 transition shadow"
        >
          View Accepted Applicants
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
            >
              <div className="flex items-start justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    Accepted Applicants
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Candidates who have advanced to the interview stage.
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
              </div>

              <div className="p-6 overflow-auto">
                {loading && (
                  <div className="text-center text-gray-600 py-8">
                    Loading...
                  </div>
                )}

                {error && (
                  <div className="text-center text-red-600 py-8">{error}</div>
                )}

                {!loading && !error && data.length === 0 && (
                  <div className="text-center text-gray-600 py-8">
                    No accepted applicants yet.
                  </div>
                )}

                {!loading &&
                  !error &&
                  Object.entries(grouped).map(([branchName, jobs]) => (
                    <div key={branchName} className="mb-8 last:mb-0">
                      <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4">
                        🏢 {branchName}
                      </h3>

                      {Object.entries(jobs).map(([jobTitle, entries]) => (
                        <div key={jobTitle} className="mb-4 last:mb-0">
                          <h4 className="text-md font-medium text-primary mb-2">
                            💼 {jobTitle}
                          </h4>
                          <ul className="space-y-1 pl-4">
                            {entries.map((e) => (
                              <li
                                key={e.id}
                                className="text-sm text-gray-700 list-disc"
                              >
                                {e.fullName}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
