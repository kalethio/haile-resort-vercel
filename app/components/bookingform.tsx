"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, format } from "date-fns";
import { DateRange, RangeKeyDict } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface Branch {
  slug: string;
  branchName: string;
}

export default function BookingForm() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

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

  // Guests
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);
  const [childrenAges, setChildrenAges] = useState<(number | null)[]>([]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!branchSlug) {
      alert("Please select a branch.");
      return;
    }

    if (children > 0 && !validateChildrenAges()) {
      alert("Please enter valid ages for all children (0–12).");
      return;
    }

    const totalGuests = adults + children;
    if (isNaN(totalGuests) || totalGuests > 3) {
      alert(`Max 3 guests allowed (you have ${totalGuests}).`);
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

    // Close form immediately when Book Now is clicked
    setIsOpen(false);
    router.push(`/booking?${params.toString()}`);
  };

  if (!isOpen) {
    return null; // Form completely disappears when closed
  }

  return (
    <div className="flex justify-center items-center min-h-0 p-1">
      <form
        className="space-y-4 text-sm text-primary w-fit mx-auto bg-white/10 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/20 shadow-lg"
        onSubmit={handleSubmit}
      >
        {/* Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
          {/* Destination */}
          <div className="lg:col-span-1">
            <label className="block font-medium mb-2 text-sm">
              Destination
            </label>
            <select
              value={branchSlug}
              onChange={(e) => {
                const selectedBranch = branches.find(
                  (b) => b.slug === e.target.value
                );
                if (selectedBranch) {
                  setBranch(selectedBranch.branchName);
                  setBranchSlug(selectedBranch.slug);
                }
              }}
              className="w-full px-3 py-2 text-sm rounded-lg bg-white/5 border border-primary/30 focus:ring-1 focus:ring-primary outline-none"
            >
              {branches.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.branchName}
                </option>
              ))}
            </select>
          </div>

          {/* Dates - Full width on mobile, 2 cols on desktop */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block font-medium mb-2 text-sm">Dates</label>
            <div className="w-full rounded-lg bg-white/5 border border-primary/30 overflow-hidden scale-90 md:scale-100 origin-left">
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
            <div className="text-xs text-gray-400 mt-1 text-center">
              {nights} night{nights > 1 ? "s" : ""}
            </div>
          </div>

          {/* Guests - Full width on mobile, 1 col on desktop */}
          <div className="lg:col-span-1">
            <label className="block font-medium mb-2 text-xs">Guests</label>
            <div className="space-y-3 bg-white/5 border border-primary/30 rounded-lg p-4">
              {/* Adults */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-300">
                    Adults
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeAdults(-1)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 border border-primary/30 rounded-full text-primary hover:bg-primary hover:text-white transition text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium min-w-6 text-center">
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeAdults(1)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 border border-primary/30 rounded-full text-primary hover:bg-primary hover:text-white transition text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-gray-300">
                    Children (0–12)
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => changeChildren(-1)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 border border-primary/30 rounded-full text-primary hover:bg-primary hover:text-white transition text-sm"
                  >
                    -
                  </button>
                  <span className="text-sm font-medium min-w-6 text-center">
                    {children}
                  </span>
                  <button
                    type="button"
                    onClick={() => changeChildren(1)}
                    className="w-8 h-8 flex items-center justify-center bg-white/5 border border-primary/30 rounded-full text-primary hover:bg-primary hover:text-white transition text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children Ages */}
              {children > 0 && (
                <div className="space-y-2 pt-2 border-t border-primary/20">
                  <div className="text-xs font-medium text-gray-300">
                    Children Ages
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from({ length: children }).map((_, i) => (
                      <div key={i} className="flex flex-col">
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
                          placeholder="Age"
                          className="w-full px-2 py-1 text-sm rounded-lg bg-white/5 border border-primary/30 placeholder-primary/50 focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button - Full width on mobile, auto on desktop */}
        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-2.5 rounded-lg font-medium bg-primary text-white text-sm shadow-sm hover:brightness-90 transition mt-2"
          >
            Book Now
          </button>
        </div>
      </form>
    </div>
  );
}
