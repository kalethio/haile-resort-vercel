"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import BookingForm from "./bookingform";
import { BRANCHES } from "@/app/data/branches";

// ---------------------------
// Static navigation links
// ---------------------------
const navLinks = [
  { label: "Home", path: "/" },
  { label: "About Us", path: "/about-us" },
  { label: "Gallery", path: "/gallery" },
  { label: "Career", path: "/career" },
];

// ---------------------------
// Destination dropdown links
// ---------------------------
const destinations = Object.keys(BRANCHES).map((slug) => ({
  label: BRANCHES[slug].name,
  path: `/branches/${slug}`,
}));

export default function Navbar() {
  // ---------------------------
  // Local state
  // ---------------------------
  const [scrolled, setScrolled] = useState(false); // track if user scrolled past threshold
  const [menuOpen, setMenuOpen] = useState(false); // mobile menu toggle
  const [bookingOpen, setBookingOpen] = useState(false); // booking modal toggle
  const [destOpen, setDestOpen] = useState(false); // destinations dropdown toggle

  const pathname = usePathname(); // current route for active link highlighting

  // ---------------------------
  // Scroll handler: adds shadow and background to navbar when scrolling
  // ---------------------------
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------------------------
  // Prevent background scroll when overlays are open
  // ---------------------------
  useEffect(() => {
    document.body.style.overflow = menuOpen || bookingOpen ? "hidden" : "auto";
  }, [menuOpen, bookingOpen]);

  // ---------------------------
  // Close overlays with Escape key
  // ---------------------------
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setBookingOpen(false);
        setDestOpen(false);
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ---------------------------
  // Toggle functions
  // ---------------------------
  const toggleMenu = useCallback(() => setMenuOpen((p) => !p), []);
  const toggleBooking = () => setBookingOpen((p) => !p);
  const closeBooking = () => setBookingOpen(false);

  // ---------------------------
  // Active link checker
  // ---------------------------
  const isActive = (path: string) => pathname === path;

  // ---------------------------
  // Class generator for links
  // ---------------------------
  const linkCls = (active = false) =>
    `block px-4 rounded-md transition-all duration-200 ease-out hover:scale-105 hover:shadow-sm hover:text-primary-dark ${
      active
        ? "font-semibold underline underline-offset-4 text-primary-dark"
        : ""
    }`;

  // ---------------------------
  // Destination dropdown links
  // ---------------------------
  const destinations = Object.keys(BRANCHES).map((slug) => ({
    label: BRANCHES[slug].branchName, // <-- use branchName
    path: `/branches/${slug}`,
  }));

  // ---------------------------
  // Navigation links component
  // Accepts `isMobile` to auto-close menu when a link is clicked
  // ---------------------------
  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {/* Primary navigation links */}
      {navLinks.map(({ label, path }) => (
        <Link
          key={path}
          href={path}
          onClick={() => isMobile && setMenuOpen(false)}
          className={linkCls(isActive(path))}
        >
          {label}
        </Link>
      ))}

      {/* Destinations dropdown */}
      <div className="relative">
        <button
          onClick={() => setDestOpen((p) => !p)}
          className={linkCls(false) + " flex items-center gap-1 cursor-pointer"}
        >
          Destinations <span className="text-sm">&#9662;</span>
        </button>

        {destOpen && (
          <div className="absolute left-0 mt-2 w-52 bg-white/70 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg flex flex-col z-50">
            {destinations.map((dest) => (
              <Link
                key={dest.path}
                href={dest.path}
                onClick={() => {
                  setDestOpen(false);
                  isMobile && setMenuOpen(false);
                }}
                className="px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-primary/20 hover:text-primary-dark"
              >
                {dest.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Booking CTA button */}
      <button
        onClick={() => {
          if (isMobile) setMenuOpen(false);
          toggleBooking();
        }}
        className="block px-4 py-2 cursor-pointer rounded-md font-semibold bg-gradient-to-r from-primary/40 to-primary/80 text-text shadow transition-all duration-300 hover:scale-105 hover:from-primary/50 hover:to-primary/90"
        aria-expanded={bookingOpen}
      >
        Reserve Your Stay
      </button>
    </>
  );

  return (
    <>
      {/* ---------------------------
          Sticky Navbar
      --------------------------- */}
      <nav
        aria-label="Main Navigation"
        className={`w-full max-w-screen z-40 transition-all duration-500 fixed top-0 ${
          scrolled ? "bg-white/60 backdrop-blur-lg shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-screen-xl mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.svg"
              alt="Company Logo"
              width={120}
              height={60}
              className="object-contain hover:opacity-90 transition"
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-6 text-primary font-medium items-center">
            <NavLinks />
          </div>

          {/* Mobile hamburger menu */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle Menu"
              className="text-primary focus:outline-none hover:scale-110 transition-transform"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ---------------------------
          Mobile Menu Panel
      --------------------------- */}
      <div
        id="mobile-menu"
        className={`md:hidden fixed top-14 right-4 rounded-xl bg-white/80 backdrop-blur-lg shadow-xl transform transition-all duration-300 z-40 p-4 ${
          menuOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col space-y-2 text-primary font-medium text-base">
          <NavLinks isMobile />
        </nav>
      </div>

      {/* ---------------------------
          Backdrop for mobile menu or destinations dropdown
      --------------------------- */}
      {(menuOpen || destOpen) && (
        <div
          className="fixed inset-0 z-30 cursor-pointer"
          onClick={() => {
            setMenuOpen(false);
            setDestOpen(false);
          }}
          aria-hidden="true"
        >
          {/* Backdrop image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300 opacity-100"
            style={{
              backgroundImage: "url('/images/backdrop.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}

      {/* ---------------------------
          Booking Modal
      --------------------------- */}
      {bookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setBookingOpen(false)}
            aria-hidden="true"
          />
          {/* Modal content */}
          <div
            className="relative bg-bg rounded-2xl shadow-2xl max-w-3xl w-full mx-4 overflow-hidden transform transition-all duration-300 hover:scale-[1.01]"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Booking modal"
          >
            {/* Close button */}
            <button
              onClick={closeBooking}
              className="absolute top-4 right-4 z-20 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Close booking"
            >
              ✕
            </button>

            {/* Modal header */}
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-red-900">
                Reserve Your Stay
              </h2>
            </div>

            {/* Booking form */}
            <div className="p-6 sm:p-8 bg-white/10">
              <BookingForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
