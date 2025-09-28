// app/about/page.tsx
"use client";
import React from "react";
import Headline from "@/app/components/2aboutusSections/headline";
import { CEOMessage } from "@/app/components/2aboutusSections/message";
import { StatsGrid } from "@/app/components/2aboutusSections/stats";
import { HistorySection } from "@/app/components/2aboutusSections/history";

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      <CEOMessage />
      <StatsGrid />
      <HistorySection />
      <Headline />
    </main>
  );
}
