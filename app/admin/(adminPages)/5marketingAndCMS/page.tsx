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
  FaEnvelope,
} from "react-icons/fa";

// Import CMS content components
import BranchManagerContent from "./CMS/sections/BranchManagerModal";
import ChatbotContent from "./CMS/sections/ChatbotModal";
import PackagesContent from "./CMS/sections/PackagesModal";
import NewsContent from "./CMS/sections/NewsModal";
import GalleryContent from "./CMS/sections/GalleryModal";
import ReviewsContent from "./CMS/sections/ReviewModal";

type SectionDef = {
  id: string;
  title: string;
  icon: IconType;
  Component: React.ComponentType<{ onClose: () => void }>;
  type: "cms" | "marketing";
};

const SECTIONS: SectionDef[] = [
  {
    id: "branch",
    title: "Branch Manager",
    icon: FaBuilding,
    Component: BranchManagerContent,
    type: "cms",
  },
  {
    id: "chatbot",
    title: "Chatbot Editor",
    icon: FaRobot,
    Component: ChatbotContent,
    type: "cms",
  },

  {
    id: "news",
    title: "Latest News",
    icon: FaNewspaper,
    Component: NewsContent,
    type: "cms",
  },
  {
    id: "reviews",
    title: "Reviews",
    icon: FaStar,
    Component: ReviewsContent,
    type: "cms",
  },
  {
    id: "email",
    title: "Email Marketing",
    icon: FaEnvelope,
    Component: ({ onClose }) => (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Email Marketing
        </h2>
        <p className="text-gray-600 mb-6">
          Manage your email campaigns and templates
        </p>
        <button
          onClick={onClose}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Close
        </button>
      </div>
    ),
    type: "marketing",
  },
];

export default function MarketingAndCMS() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const open = openId !== null;
  const active = SECTIONS.find((s) => s.id === openId) ?? null;

  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = () => setOpenId(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }

    if (open) {
      previouslyFocused.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKey);
      setTimeout(() => modalRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      previouslyFocused.current?.focus?.();
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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
      } catch {}
    }

    load();
    return () => {
      mounted = false;
      ac.abort();
    };
  }, []);

  function onBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  const cmsSections = SECTIONS.filter((s) => s.type === "cms");
  const marketingSections = SECTIONS.filter((s) => s.type === "marketing");

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-normal text-gray-900">
            Marketing & CMS
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Website content and marketing campaigns
          </p>
        </div>

        {/* CMS Sections */}
        <div className="mb-12">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Content Management
          </h2>
          <div className="space-y-3">
            {cmsSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setOpenId(section.id)}
                  className="flex items-center w-md cursor-pointer p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <Icon className="text-gray-700 mr-4 text-xl flex-shrink-0" />
                  <span className="text-gray-900">{section.title}</span>
                  {section.id === "reviews" && pendingCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-semibold bg-red-600 text-white min-w-[20px]">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Marketing Sections */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Marketing</h2>
          <div className="space-y-3">
            {marketingSections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setOpenId(section.id)}
                  className="flex items-center w-md cursor-pointer p-4 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <Icon className="text-gray-700 mr-4 text-xl flex-shrink-0" />
                  <span className="text-gray-900">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Modal */}
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
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative z-10 w-full h-full max-h-screen overflow-auto bg-white">
              <div className="sticky top-0 z-20 flex items-center justify-between p-6 border-b bg-white/95 backdrop-blur-md shadow-sm">
                <button
                  onClick={close}
                  className="flex items-center gap-3 cursor-pointer px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors font-semibold"
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
                <div className="absolute left-1/2 transform -translate-x-1/2">
                  <h1 className="text-2xl font-bold text-gray-900">
                    {active.title}
                  </h1>
                </div>
                <div className="w-24"></div>
              </div>
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
