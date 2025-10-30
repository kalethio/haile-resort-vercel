"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import {
  FaBuilding,
  FaRobot,
  FaGift,
  FaNewspaper,
  FaImages,
  FaStar,
} from "react-icons/fa";

/*
  IMPORTANT CONTRACT:
  Each file in `./sections/*` must export a default React component of the
  shape: React.FC<{ onClose: () => void }>.
  CMSList will always pass a concrete `onClose` function so runtime calls
  like `onClose()` will never be undefined.
*/

/* Import only content components (these are content-only; no modal shell inside them) */
import BranchManagerContent from "./sections/BranchManagerModal";
import ChatbotContent from "./sections/ChatbotModal";
import PackagesContent from "./sections/PackagesModal";
import NewsContent from "./sections/NewsModal";
import GalleryContent from "./sections/GalleryModal";
import ReviewsContent from "./sections/ReviewModal";

type SectionDef = {
  id: string;
  title: string;
  icon: IconType;
  Component: React.ComponentType<{ onClose: () => void }>;
};

const SECTIONS: SectionDef[] = [
  {
    id: "branch",
    title: "Branch Manager",
    icon: FaBuilding,
    Component: BranchManagerContent,
  },
  {
    id: "chatbot",
    title: "Chatbot Editor",
    icon: FaRobot,
    Component: ChatbotContent,
  },
  {
    id: "packages",
    title: "Favourite Packages",
    icon: FaGift,
    Component: PackagesContent,
  },
  {
    id: "news",
    title: "Latest News",
    icon: FaNewspaper,
    Component: NewsContent,
  },
  {
    id: "gallery",
    title: "Gallery",
    icon: FaImages,
    Component: GalleryContent,
  },
  { id: "reviews", title: "Reviews", icon: FaStar, Component: ReviewsContent },
];

export default function CMSList() {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = openId !== null;
  const active = SECTIONS.find((s) => s.id === openId) ?? null;

  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  // Close handler (guaranteed function passed to children)
  const close = () => setOpenId(null);

  // Keyboard (Esc) and body scroll lock + focus management
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      // Optional: add ArrowLeft/ArrowRight navigation between sections if needed
    }

    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
      // put focus into the modal for accessibility
      setTimeout(() => modalRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      // restore focus if possible
      previouslyFocused.current?.focus?.();
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Prevent backdrop clicks from closing when clicking inside modal content
  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  // --- ADDED: small state + effect to fetch pending count for reviews badge ---
  const [pendingCount, setPendingCount] = useState<number>(0);
  useEffect(() => {
    let mounted = true;
    const ac = new AbortController();

    async function load() {
      try {
        const res = await fetch("/api/review", {
          cache: "no-store",
          signal: ac.signal,
        });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const pending = Array.isArray(data)
          ? data.filter((r: any) => !r.approved).length
          : 0;
        setPendingCount(pending);
      } catch {
        // ignore errors silently — badge is optional
      }
    }

    load();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);
  // --- end added section ---

  return (
    <div className="p-8 bg-gray-50 min-h-screen flex justify-start overflow-hidden">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Content Management System
        </h1>

        <ul className="space-y-3 list-none p-0 m-0">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.id} className="w-full">
                <button
                  type="button"
                  onClick={() => setOpenId(s.id)}
                  className="flex items-center w-full p-4 bg-white rounded-lg border border-gray-100 hover:bg-gray-100 transition cursor-pointer text-left"
                >
                  <Icon className="text-gray-700 mr-4 text-xl flex-shrink-0" />
                  <div>
                    <h2 className="text-lg font-medium text-gray-800">
                      {s.title}
                    </h2>
                  </div>

                  {/* ONLY special-case UI: show badge for Reviews when there are pending */}
                  {s.id === "reviews" && pendingCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-600 text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* FULLSCREEN MODAL SHELL (owned by this page) */}
        {open && active && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            tabIndex={-1}
            ref={modalRef}
            className="fixed inset-0 z-50 flex items-start justify-center"
            onClick={onBackdropClick}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal container */}
            <div className="relative z-10 w-full h-full max-h-screen overflow-auto bg-white">
              {/* Sticky Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b bg-white/95 backdrop-blur-md shadow-sm">
                {/* Back Button - Left Side */}
                <button
                  onClick={close}
                  className="flex items-center gap-3 cursor-pointer px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200 font-semibold"
                  aria-label="Go back"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back
                </button>

                {/* Centered Title */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h1 className="text-2xl font-bold text-gray-900 text-center">
                    {active.title}
                  </h1>
                </div>

                {/* Right side spacer for balance */}
                <div className="w-24"></div>
              </div>

              {/* Content area */}
              <main className="flex-1 overflow-auto bg-gray-50">
                <div className="p-6 max-w-7xl mx-auto w-full">
                  <active.Component onClose={close} />
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
