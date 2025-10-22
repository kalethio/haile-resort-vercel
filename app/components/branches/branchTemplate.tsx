"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import BranchHero from "../branches/1branchHero";
import Accommodations from "../branches/3accomodations";
import Experience from "../branches/4experience";
import BookingForm from "../bookingform";
import { BranchTemplateProps } from "@/types";

export default function BranchTemplate({ branch }: BranchTemplateProps) {
  console.log("Branch data:", branch);
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
            description: branch.description || branch.shortDescription || "",
            directionsUrl: branch.directionsUrl ?? branch.location?.mapsUrl,
            contact: branch.contact,
            attractions: branch.attractions || [],
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
      {branch.experiences && branch.experiences.length > 0 && (
        <>
          {branch.experiences.map((exp, index) => (
            <Experience
              key={exp.id || index}
              image={exp.highlightImage}
              packages={exp.packages}
              serviceDescription={[exp.title, exp.description || ""]}
            />
          ))}
        </>
      )}

      {/* Booking Form Modal */}
      {bookingOpen && <BookingForm onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
