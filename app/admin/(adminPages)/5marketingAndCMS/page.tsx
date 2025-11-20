"use client";

import React, { useEffect, useRef, useState } from "react";
import { IconType } from "react-icons";
import {
  FaBuilding,
  FaRobot,
  FaNewspaper,
  FaStar,
  FaEnvelope,
} from "react-icons/fa";
import { useSession } from "next-auth/react";

// Import CMS content components
import BranchManagerContent from "./CMS/sections/BranchManagerModal";
import ChatbotContent from "./CMS/sections/ChatbotModal";
import NewsContent from "./CMS/sections/NewsModal";
import ReviewsContent from "./CMS/sections/ReviewModal";
import EmailMarketingContent from "./emailMarketing/page";

type SectionDef = {
  id: string;
  title: string;
  icon: IconType;
  Component: React.ComponentType<{ onClose: () => void }>;
  type: "cms" | "marketing";
  requiredPermission?: string; // Add permission requirement for each section
};

const SECTIONS: SectionDef[] = [
  {
    id: "branch",
    title: "Branch Manager",
    icon: FaBuilding,
    Component: BranchManagerContent,
    type: "cms",
    requiredPermission: "cms_branch_manager",
  },
  {
    id: "chatbot",
    title: "Chatbot Editor",
    icon: FaRobot,
    Component: ChatbotContent,
    type: "cms",
    requiredPermission: "cms_chatbot",
  },
  {
    id: "news",
    title: "Latest News",
    icon: FaNewspaper,
    Component: NewsContent,
    type: "cms",
    requiredPermission: "cms_news",
  },
  {
    id: "reviews",
    title: "Reviews",
    icon: FaStar,
    Component: ReviewsContent,
    type: "cms",
    requiredPermission: "cms_review",
  },
  {
    id: "email",
    title: "Email Marketing",
    icon: FaEnvelope,
    Component: EmailMarketingContent,
    type: "marketing",
    requiredPermission: "email_marketing",
  },
];

export default function MarketingAndCMS() {
  const { data: session } = useSession();
  const [openId, setOpenId] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const open = openId !== null;
  const active = SECTIONS.find((s) => s.id === openId) ?? null;

  const modalRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  const close = () => setOpenId(null);

  // Build permissions object (same logic as layout)
  const buildPermissions = () => {
    const permissions: { [key: string]: boolean } = {};

    if (session?.user.role === "SUPER_ADMIN") {
      // Super admin has all permissions
      SECTIONS.forEach((section) => {
        if (section.requiredPermission) {
          permissions[section.requiredPermission] = true;
        }
      });
      return permissions;
    }

    // Build permissions based on actual module permissions
    session?.user.permissions.forEach((permission) => {
      const key = `${permission.module}.${permission.action}`;
      permissions[key] = true;
    });

    return permissions;
  };

  const userPermissions = buildPermissions();

  // Filter sections based on permissions
  const filteredSections = SECTIONS.filter((section) => {
    if (!section.requiredPermission) return true;
    if (session?.user.role === "SUPER_ADMIN") return true;
    return userPermissions[section.requiredPermission];
  });

  const cmsSections = filteredSections.filter((s) => s.type === "cms");
  const marketingSections = filteredSections.filter(
    (s) => s.type === "marketing"
  );

  // ... rest of your existing useEffect and handlers remain the same
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
        {cmsSections.length > 0 && (
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
        )}

        {/* Marketing Sections */}
        {marketingSections.length > 0 && (
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Marketing
            </h2>
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
        )}

        {/* Show message if no sections available */}
        {filteredSections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No marketing or CMS modules available with your current
              permissions.
            </p>
          </div>
        )}

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
