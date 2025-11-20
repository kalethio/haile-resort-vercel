// app/layout.tsx or components/SiteLayout.tsx
"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import ChatBot from "../components/chatBot";
import Footer from "../components/footer";
import { motion, AnimatePresence } from "framer-motion";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  // Simulate initial page load
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200); // minimum loader duration
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Loader */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            className="fixed inset-0 z-50 flex items-center justify-center bg-premium/20 backdrop-blur-sm"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.5 } }}
          >
            {/* Rotating circle */}
            <motion.div
              className="w-16 h-16 border-4 border-t-transparent border-white rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            />
            {/* Loading text */}
            <motion.p
              className="absolute bottom-10 text-white text-sm sm:text-base tracking-wide uppercase animate-pulse"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Loading...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <Navbar />

      {/* ChatBot */}
      <ChatBot />

      {/* Hero / Main section */}
      <main className="flex-1 w-full">
        <div>{children}</div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
