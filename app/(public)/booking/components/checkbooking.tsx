"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Branch {
  slug: string;
  branchName: string;
}

export default function CheckBookingLuxuryBar() {
  const router = useRouter();

  // Branches
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branch, setBranch] = useState<string>("");
  const [branchSlug, setBranchSlug] = useState<string>("");

  // Dates
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });
  const [openPanel, setOpenPanel] = useState<
    "where" | "dates" | "guests" | null
  >(null);

  // Guests
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [childrenAges, setChildrenAges] = useState<(number | null)[]>([]);

  // UI & refs
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [popupMessage, setPopupMessage] = useState<string>("");
  const [showPopup, setShowPopup] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/branches");
        if (!res.ok) throw new Error("Failed to fetch branches");
        const data = await res.json();
        setBranches(data);
        if (data.length) {
          setBranch(data[0].branchName);
          setBranchSlug(data[0].slug);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Close popovers when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpenPanel(null);
    }
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const nights = Math.max(
    1,
    Math.ceil(
      (selectionRange.endDate.getTime() - selectionRange.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const changeAdults = (delta: number) =>
    setAdults((a) => Math.max(1, a + delta));
  const changeChildren = (delta: number) => {
    setChildren((c) => {
      const next = Math.max(0, c + delta);
      setChildrenAges((ages) => {
        const copy = ages.slice(0, next);
        while (copy.length < next) copy.push(null);
        return copy;
      });
      return next;
    });
  };

  const setChildAge = (index: number, value: number | null) => {
    setChildrenAges((ages) => {
      const copy = [...ages];
      copy[index] = value;
      return copy;
    });
  };

  const validateChildrenAges = () => {
    for (let i = 0; i < children; i++) {
      const age = childrenAges[i];
      if (age === null || isNaN(age) || age < 0 || age > 12) return false;
    }
    return true;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!branchSlug) {
      setPopupMessage("Please select a branch.");
      setShowPopup(true);
      return;
    }

    if (children > 0 && !validateChildrenAges()) {
      setPopupMessage("Please enter valid ages for all children (0–12).");
      setShowPopup(true);
      return;
    }

    const totalGuests = adults + children;
    if (isNaN(totalGuests) || totalGuests > 3) {
      setPopupMessage(`Max 3 guests allowed (you have ${totalGuests}).`);
      setShowPopup(true);
      return;
    }

    const params = new URLSearchParams({
      branch: branchSlug,
      checkIn: format(selectionRange.startDate, "yyyy-MM-dd"),
      checkOut: format(selectionRange.endDate, "yyyy-MM-dd"),
      adults: String(adults),
      children: String(children),
      childrenAges: childrenAges
        .slice(0, children)
        .map((a) => (a === null ? "" : String(a)))
        .join(","),
    });

    router.push(`/booking?${params.toString()}`);
  };

  return (
    <div
      className="absolute left-4 right-4 lg:left-10 bottom-4 lg:bottom-10 w-auto max-w-4xl flex justify-start z-50"
      ref={wrapperRef}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col lg:flex-row bg-white/50 rounded-3xl p-2 shadow-2xl backdrop-blur-md border border-white/20 gap-2"
      >
        {/* Where */}
        <div className="flex-1 min-w-0 relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "where" ? null : "where")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-white/10 transition-all"
          >
            <div className="flex flex-col text-left flex-1">
              <span className="text-xs tracking-wide font-medium text-gray-600 uppercase">
                Where
              </span>
              <span className="text-sm font-semibold text-gray-900 truncate">
                {branch || "Select branch"}
              </span>
            </div>
            <div className="ml-auto text-gray-400">▾</div>
          </button>

          {openPanel === "where" && (
            <div className="absolute bottom-full mb-2 bg-white rounded-xl shadow-xl border border-gray-100 w-full p-3 z-50">
              {branches.map((b) => (
                <button
                  key={b.slug}
                  type="button"
                  onClick={() => {
                    setBranch(b.branchName);
                    setBranchSlug(b.slug);
                    setOpenPanel(null);
                  }}
                  className="text-left px-3 py-2 rounded-lg hover:bg-gray-50 w-full"
                >
                  <div className="font-semibold text-gray-900">
                    {b.branchName}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200/40 mx-2" />

        {/* Dates */}
        <div className="flex-1 min-w-0 relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "dates" ? null : "dates")}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-white/10 transition-all"
          >
            <div className="flex-1 min-w-0">
              <div className="text-xs tracking-wide font-medium text-gray-600 uppercase">
                When
              </div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {format(selectionRange.startDate, "MMM dd")} →{" "}
                {format(selectionRange.endDate, "MMM dd")}
              </div>
            </div>
            <div className="text-sm text-gray-500 whitespace-nowrap">
              {nights} night{nights > 1 ? "s" : ""}
            </div>
          </button>

          {openPanel === "dates" && (
            <div className="absolute bottom-full mb-2 left-0 right-0 z-50">
              <DateRange
                ranges={[selectionRange]}
                onChange={(ranges: RangeKeyDict) => {
                  const range = ranges.selection;
                  if (range.startDate && range.endDate) {
                    setSelectionRange({
                      startDate: range.startDate,
                      endDate: range.endDate,
                      key: "selection",
                    });
                  }
                }}
                minDate={new Date()}
                rangeColors={["#F59E0B"]}
              />
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200/40 mx-2" />

        {/* Guests */}
        <div className="min-w-0 lg:min-w-[200px] relative">
          <button
            type="button"
            onClick={() =>
              setOpenPanel(openPanel === "guests" ? null : "guests")
            }
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-transparent hover:bg-white/10 transition-all"
          >
            <div className="flex-1 text-left min-w-0">
              <div className="text-xs tracking-wide font-medium text-gray-600 uppercase">
                Guests
              </div>
              <div className="text-sm font-semibold text-gray-900 truncate">
                {adults} adult{adults > 1 ? "s" : ""}
                {children
                  ? ` · ${children} child${children > 1 ? "ren" : ""}`
                  : ""}
              </div>
            </div>
            <div className="text-gray-400">▾</div>
          </button>

          {openPanel === "guests" && (
            <div className="absolute top-full mt-2 lg:bottom-full lg:top-auto lg:mb-2 bg-white rounded-xl shadow-xl border border-gray-100 w-full lg:w-[360px] p-4 z-50">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Adults
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeAdults(-1)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-700"
                    >
                      −
                    </button>
                    <div className="w-8 text-center font-semibold text-gray-900">
                      {adults}
                    </div>
                    <button
                      type="button"
                      onClick={() => changeAdults(1)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Children (0–12 yrs)
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeChildren(-1)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-700"
                    >
                      −
                    </button>
                    <div className="w-8 text-center font-semibold text-gray-900">
                      {children}
                    </div>
                    <button
                      type="button"
                      onClick={() => changeChildren(1)}
                      className="w-8 h-8 rounded-lg border flex items-center justify-center text-gray-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {children > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Array.from({ length: children }).map((_, i) => (
                      <div key={i} className="flex flex-col">
                        <label className="text-xs text-gray-600">
                          Child {i + 1} age
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={12}
                          value={childrenAges[i] ?? ""}
                          onChange={(e) =>
                            setChildAge(
                              i,
                              e.target.value === ""
                                ? null
                                : Math.max(
                                    0,
                                    Math.min(12, Number(e.target.value))
                                  )
                            )
                          }
                          placeholder="0 - 12"
                          className="px-3 py-2 border rounded-md text-gray-900 placeholder-gray-400"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-200/40 mx-2" />

        <div className="w-full lg:w-[160px]">
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-gradient-to-r from-primary/70 to-primary/90 text-white font-semibold shadow-lg hover:scale-105 transform transition-all"
          >
            Book Now
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl p-6 shadow-xl max-w-sm w-full">
            <div className="font-semibold text-gray-900 mb-2">Notice</div>
            <div className="text-gray-600 mb-4">{popupMessage}</div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowPopup(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded-md"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
