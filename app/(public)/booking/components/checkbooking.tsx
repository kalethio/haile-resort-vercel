"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Branch {
  slug: string;
  branchName: string;
  externalBookingUrl: string | null;
}

export default function CheckBookingLuxuryBar() {
  const router = useRouter();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showBranchModal, setShowBranchModal] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/branches");
        if (!res.ok) throw new Error("Failed to fetch branches");
        const data = await res.json();
        setBranches(data);
        if (data.length) {
          setSelectedBranch(data[0]);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleBookNow = () => {
    if (!selectedBranch) {
      setPopupMessage("Please select a branch.");
      setShowPopup(true);
      return;
    }

    if (!selectedBranch.externalBookingUrl) {
      setPopupMessage(
        "Booking link not configured for this branch. Please contact us."
      );
      setShowPopup(true);
      return;
    }

    // Open in new tab
    window.open(selectedBranch.externalBookingUrl, "_blank");
  };

  return (
    <>
      <div className="absolute left-4 right-4 lg:left-10 bottom-4 lg:bottom-10 w-auto max-w-md flex justify-start z-50">
        <div className="w-full flex flex-col lg:flex-row bg-white/50 rounded-3xl p-2 shadow-2xl backdrop-blur-md border border-white/20 gap-2">
          {/* Branch Selector - Mobile & Desktop */}
          <div className="flex-1 min-w-0 relative">
            <button
              type="button"
              onClick={() => setShowBranchModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-white/10 transition-all"
            >
              <div className="flex flex-col text-left flex-1">
                <span className="text-xs tracking-wide font-medium text-gray-600 uppercase">
                  Select Branch
                </span>
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {selectedBranch?.branchName || "Choose a branch"}
                </span>
              </div>
              <div className="ml-auto text-gray-400">▾</div>
            </button>
          </div>

          <div className="w-full lg:w-[160px]">
            <button
              onClick={handleBookNow}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary/70 to-primary/90 text-white font-semibold shadow-lg hover:scale-105 transform transition-all"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Branch Selection Modal */}
      {showBranchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white rounded-t-xl z-10">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Branch
              </h3>
              <button
                onClick={() => setShowBranchModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-1 gap-2">
                {branches.map((branch) => (
                  <button
                    key={branch.slug}
                    type="button"
                    onClick={() => {
                      setSelectedBranch(branch);
                      setShowBranchModal(false);
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors active:bg-gray-100"
                  >
                    <div className="font-semibold text-gray-900">
                      {branch.branchName}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popup Message */}
      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <div className="font-semibold text-gray-900 mb-2">Notice</div>
            <div className="text-gray-600 mb-4">{popupMessage}</div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
