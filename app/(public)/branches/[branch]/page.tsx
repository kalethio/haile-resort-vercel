"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BranchTemplate from "../../../components/branches/branchTemplate";
import { BranchType } from "@/types";

// ---------------------------
// Component
// ---------------------------
export default function BranchPage() {
  const params = useParams();
  const branchSlug = params?.branch as string;

  const [branchData, setBranchData] = useState<BranchType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Mark when component is mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch after component is mounted on client
    if (!isMounted) return;

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
  }, [branchSlug, isMounted]);

  // Show loading on both server and client initially (no mismatch)
  if (loading || !isMounted) {
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
