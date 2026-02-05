"use client";

import { useState, useEffect } from "react";
import HeroSection from "../branches/1branchHero";
import AttractionsSection from "../branches/2attraction";
import Accommodations from "../branches/3accomodations";
import BookingForm from "../bookingform";
import { BranchTemplateProps } from "@/types";

export default function BranchTemplate({ branch }: BranchTemplateProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [attractions, setAttractions] = useState<typeof branch.attractions>([]);

  // FIX: Ensure attractions is always a proper array and remove duplicates
  useEffect(() => {
    if (!branch?.attractions) {
      setAttractions([]);
      return;
    }

    // Ensure it's an array
    const attractionsArray = Array.isArray(branch.attractions)
      ? branch.attractions
      : [];

    // Remove duplicates by id using Set
    const uniqueAttractions = Array.from(
      new Map(attractionsArray.map((item) => [item.id, item])).values()
    );

    setAttractions(uniqueAttractions);
  }, [branch]);

  // Debug log
  useEffect(() => {
    console.log("Branch attractions processed:", attractions);
    console.log("Original attractions:", branch?.attractions);
  }, [attractions, branch]);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* 1. Hero Section */}
      <HeroSection
        branch={{
          branchName: branch.branchName,
          heroVideoUrl: branch.heroVideoUrl,
          heroTagline: branch.heroTagline,
          contact: branch.contact,
          directionsUrl: branch.directionsUrl,
        }}
      />

      {/* 2. Attractions Section - ONLY render if we have attractions */}
      {attractions.length > 0 ? (
        <AttractionsSection
          attractions={attractions}
          description={branch.description}
          branchName={branch.branchName}
        />
      ) : (
        // Optional: Show a placeholder when no attractions
        <div className="w-full py-12 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">
              Discover {branch.branchName}
            </h3>
            <p className="text-gray-500">
              Attractions information will be available soon.
            </p>
          </div>
        </div>
      )}

      {/* 3. Services Section */}
      <Accommodations items={branch.accommodations || []} />

      {/* Booking Form Modal */}
      {bookingOpen && <BookingForm onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
