"use client";

import { useState } from "react";
import HeroSection from "../branches/1branchHero";
import AttractionsSection from "../branches/2attraction";
import Accommodations from "../branches/3accomodations";
import BookingForm from "../bookingform";
import { BranchTemplateProps } from "@/types";

export default function BranchTemplate({ branch }: BranchTemplateProps) {
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* 1. Hero Section (New Design) */}
      <HeroSection
        branch={{
          branchName: branch.branchName,
          heroVideoUrl: branch.heroVideoUrl,
          heroTagline: branch.heroTagline,
          contact: branch.contact,
          directionsUrl: branch.directionsUrl,
        }}
      />

      {/* 2. Attractions Section (New Design) */}
      <AttractionsSection
        attractions={branch.attractions || []}
        description={branch.description} // Uses branch description for attractions section
        branchName={branch.branchName}
      />

      {/* 3. Services Section (Existing - No Changes) */}
      <Accommodations items={branch.accommodations} />

      {/* Booking Form Modal */}
      {bookingOpen && <BookingForm onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
