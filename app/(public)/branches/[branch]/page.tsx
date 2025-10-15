"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BranchTemplate from "../../../components/branches/branchTemplate";

// ---------------------------
// Types
// ---------------------------
export interface Attraction {
  id: number;
  externalId?: string;
  label: string;
  image?: string;
}

export interface Accommodation {
  id: number;
  title: string;
  description?: string;
  image?: string;
}

export interface ExperiencePackage {
  id: number;
  externalId?: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaLabel?: string;
}

export interface Experience {
  id: number;
  externalId?: string;
  title: string;
  description?: string;
  highlightImage?: string;
  packages?: ExperiencePackage[];
}

export interface BranchType {
  branchName: string;
  description?: string;
  heroImage?: string;
  directionsUrl?: string;
  attractions?: Attraction[];
  accommodations?: Accommodation[];
  experiences?: Experience[];
}

// ---------------------------
// Component
// ---------------------------
export default function BranchPage() {
  const params = useParams();
  const branchSlug = params?.branch as string;

  const [branchData, setBranchData] = useState<BranchType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBranch() {
      try {
        const res = await fetch(`/api/branches/${branchSlug}`);
        if (!res.ok) throw new Error("Branch not found");

        const data: BranchType = await res.json();

        // map experiences to always include packages array
        const mappedData: BranchType = {
          ...data,
          attractions: data.attractions ?? [],
          accommodations: data.accommodations ?? [],
          experiences:
            data.experiences?.map((exp) => ({
              ...exp,
              packages: exp.packages ?? [],
            })) ?? [],
        };

        setBranchData(mappedData);
      } catch (err) {
        console.error(err);
        setBranchData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBranch();
  }, [branchSlug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-xl font-semibold text-gray-700">Loading branch...</p>
      </div>
    );
  }

  if (!branchData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-center">
        <p className="text-xl font-semibold text-red-600">
          Branch not found. Please check the URL.
        </p>
      </div>
    );
  }

  return <BranchTemplate branch={branchData} />;
}
