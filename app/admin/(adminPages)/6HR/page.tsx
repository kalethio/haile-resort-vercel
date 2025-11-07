"use client";

import { useState } from "react";
import JobManager from "./components/JobManager";
import Applications from "./components/Applications";
import StaffManagement from "./components/staff";

export default function CareerAdminPage() {
  const [activePopup, setActivePopup] = useState<
    "jobs" | "applications" | "staff" | null
  >(null);

  const cards = [
    {
      id: "jobs",
      title: "Job Postings",
      description: "Manage and create job listings",
      icon: "💼",
    },
    {
      id: "applications",
      title: "Applications",
      description: "View and manage job applications",
      icon: "📄",
    },
    {
      id: "staff",
      title: "Staff Management",
      description: "Employee records and scheduling",
      icon: "👥",
    },
  ];

  const closePopup = () => setActivePopup(null);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-2xl font-normal text-gray-900">
            Career Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage job postings and track applications
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() =>
                setActivePopup(card.id as "jobs" | "applications" | "staff")
              }
              className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="text-3xl mb-4">{card.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>

        {/* Full Screen Popup */}
        {activePopup && (
          <div className="fixed inset-0 z-50 bg-white">
            {/* Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center gap-4">
                  <button
                    onClick={closePopup}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
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
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                      />
                    </svg>
                    Back
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activePopup === "jobs" && "Job Postings"}
                    {activePopup === "applications" && "Applications"}
                    {activePopup === "staff" && "Staff Management"}
                  </h2>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="h-[calc(100vh-80px)] overflow-auto">
              <div className="max-w-7xl mx-auto p-6">
                {activePopup === "jobs" && <JobManager />}
                {activePopup === "applications" && <Applications />}
                {activePopup === "staff" && <StaffManagement />}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
