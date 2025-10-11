// src/app/(public)/branches/[branch]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { BRANCHES } from "../../../data/branches";
import BranchTemplate from "../../../components/branches/branchTemplate";

export default function BranchPage() {
  const params = useParams();
  const branchKey = params?.branch as string;

  const branchData = BRANCHES[branchKey];

  console.log("branchData:", branchData);

  if (!branchData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-xl font-semibold text-red-600">
          Branch not found. Please check the URL.
        </p>
      </div>
    );
  }

  // MAP the branch to the expected shape
  const mappedBranch = {
    branchName: branchData.branchName,
    shortDescription: branchData.description,
    heroImage: branchData.heroImage,
    attractions: branchData.attractions, // if BranchHero needs it
    location: { mapsUrl: branchData.directionsUrl },
    accommodations: branchData.accommodations,
    experiences: branchData.experiences,
  };

  return <BranchTemplate branch={mappedBranch} />;
}
