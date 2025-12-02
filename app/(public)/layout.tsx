// app/(public)/layout.tsx
"use client";

import React from "react";
import Navbar from "../components/navbar";
import ChatBot from "../components/chatBot";
import Footer from "../components/footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <ChatBot />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
    </div>
  );
}
