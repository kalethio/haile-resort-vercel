"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ======================
// Job Openings Data
// ======================
const jobOpenings = [
  {
    id: 1,
    title: "Front Desk Manager",
    location: "Addis Ababa",
    type: "Full-Time",
    description:
      "Oversee front office operations, manage guest relations, and ensure exceptional service delivery.",
  },
  {
    id: 2,
    title: "Sous Chef",
    location: "Bahir Dar",
    type: "Full-Time",
    description:
      "Assist in kitchen management, menu planning, and supervision of junior chefs.",
  },
  {
    id: 3,
    title: "Marketing Associate",
    location: "Hawassa",
    type: "Contract",
    description:
      "Support marketing campaigns, manage social media, and engage with local partners.",
  },
];

// ======================
// Employee Value Proposition (EVP) Data
// ======================
const evp = [
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
  {
    title: "Recognizing Contributions, Rewarding Impact",
    tagline: "Acknowledging Success",
    description:
      "We recognize and celebrate contributions through thoughtful reward and recognition programs that inspire, motivate, and provide meaningful benefits.",
  },
  {
    title: "Empathy in Action",
    tagline: "Care that Creates Impact",
    description:
      "We cultivate a culture of empathy and proactive support, committed to making a meaningful impact on the lives of our colleagues.",
  },
];

export default function CareerPage() {
  // ======================
  // Local Component State
  // ======================
  const [expandedJob, setExpandedJob] = useState<number | null>(null); // Track which job is expanded
  const [selectedJob, setSelectedJob] = useState<any>(null); // Track which job is selected for application
  const modalRef = useRef<HTMLDivElement>(null); // Ref for detecting outside clicks on modal

  // ======================
  // Close Modal on Outside Click
  // ======================
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setSelectedJob(null); // Close modal if clicked outside
      }
    }

    if (selectedJob) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedJob]);

  return (
    <main className="w-full min-h-screen bg-bg text-gray-900">
      {/* ======================
          HERO SECTION
          ====================== */}
      <section className="w-full text-center mt-16 py-16 px-4 bg-primary/20 text-text/80">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Join Our Team</h1>
        <p className="max-w-2xl mx-auto text-lg opacity-90">
          Discover opportunities to grow your career and make an impact with us.
        </p>
      </section>

      {/* ======================
          JOB OPENINGS SECTION
          ====================== */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10 text-primary">
          Job Openings
        </h2>

        {/* Job Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {jobOpenings.map((job) => (
            <motion.div
              key={job.id}
              whileHover={{ scale: 1.03 }}
              className="p-6 rounded-2xl shadow-lg border border-gray-200 bg-white flex flex-col justify-between"
            >
              {/* Job Title & Meta */}
              <div>
                <h3
                  // Toggle expand/collapse when job title is clicked
                  onClick={() =>
                    setExpandedJob(expandedJob === job.id ? null : job.id)
                  }
                  className="text-xl font-semibold text-primary mb-2 cursor-pointer"
                >
                  {job.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {job.location} · {job.type}
                </p>

                {/* Expandable Job Description */}
                <AnimatePresence mode="wait">
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ maxHeight: 0, opacity: 0 }}
                      animate={{ maxHeight: 500, opacity: 1 }}
                      exit={{ maxHeight: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="text-sm text-gray-700 mt-4">
                        {job.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => setSelectedJob(job)}
                className="mt-6 py-2 px-4 bg-accent text-white rounded-lg hover:opacity-90 transition"
              >
                Apply Now
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ======================
          APPLICATION FORM MODAL
          ====================== */}
      <AnimatePresence>
        {selectedJob && (
          <motion.div
            // Dark overlay background
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Modal Card */}
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-2xl shadow-lg max-w-lg w-full"
            >
              {/* Modal Title */}
              <h2 className="text-2xl font-bold text-primary mb-6">
                Apply for {selectedJob.title}
              </h2>

              {/* Application Form */}
              {/* Application Form */}
              <form className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Resume
                  </label>
                  <input
                    type="file"
                    className="w-full border rounded-lg p-3 cursor-pointer"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Why are you a good fit?
                  </label>
                  <textarea
                    placeholder="Tell us why you’re the right candidate for this role"
                    className="w-full border rounded-lg p-3 h-32"
                  ></textarea>
                </div>

                {/* Form Actions */}
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="py-2 px-4 rounded-lg border text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-6 bg-primary text-white rounded-lg hover:opacity-90"
                  >
                    Submit Application
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================
          EVP SECTION
          ====================== */}
      <section className="py-20 px-4 bg-gray-50">
        <h2 className="text-3xl font-bold text-center text-primary mb-12">
          Our Employee Value Proposition
        </h2>

        {/* EVP Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {evp.map((item, i) => (
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
    </main>
  );
}
