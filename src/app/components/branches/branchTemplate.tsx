"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import BranchHero from "@/app/components/branches/1branchHero";
import Accommodations from "@/app/components/branches/3accomodations";
import Experience from "@/app/components/branches/4experience";
import BookingForm from "@/app/components/bookingform";

interface BranchTemplateProps {
  branch: {
    branchName: string;
    heroImage: string;
    shortDescription?: string;
    location?: { mapsUrl?: string };
    attractions?: { image: string; label: string }[];
    accommodations: any[];
    experiences?: {
      // Make optional
      highlightImage: string;
      packages: any[];
    };
  };
}

export default function BranchTemplate({ branch }: BranchTemplateProps) {
  const [heroImage, setHeroImage] = useState(branch.heroImage);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleAttractionSelect = (image?: string) => {
    if (image) setHeroImage(image);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="min-h-screen bg-bg text-text">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <BranchHero
          branch={{
            heroImage: heroImage,
            branchName: branch.branchName,
            shortDescription: branch.shortDescription,
            locationUrl: branch.location?.mapsUrl,
            attractions: branch.attractions,
          }}
          onOpenBooking={() => setBookingOpen(true)}
        />
      </motion.div>

      {/* Accommodations Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <Accommodations items={branch.accommodations} />
      </motion.div>

      {/* Experiences Section */}
      {branch.experiences && (
        <Experience packages={branch.experiences.packages} />
      )}

      {/* Booking Form Modal */}
      {bookingOpen && <BookingForm onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
