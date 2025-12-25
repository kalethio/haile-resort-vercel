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

  const [branches, setBranches] = useState<Branch[]>([]);
  const [branch, setBranch] = useState<string>("");
  const [branchSlug, setBranchSlug] = useState<string>("");

  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 1),
    key: "selection",
  });

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

    setIsOpen(false);
    router.push(`/booking?${params.toString()}`);
  };

  if (!isOpen) return null;

  return (
    <div className="flex justify-center items-center min-h-0 p-2">
      <form
        className="space-y-6 text-sm text-primary w-fit mx-auto bg-white/10 backdrop-blur-lg rounded-3xl p-6 md:p-8 border border-white/20 shadow-xl"
        onSubmit={handleSubmit}
      >
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-2 items-start">
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
              className="w-full px-3 py-2 text-sm rounded-xl bg-white/5 border border-primary/30 focus:ring-1 focus:ring-primary outline-none"
            >
              {branches.map((b) => (
                <option key={b.slug} value={b.slug}>
                  {b.branchName}
                </option>
              ))}
            </select>
          </div>

          {/* Dates */}
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block font-medium mb-2 text-sm">Dates</label>
            <div className="rounded-xl bg-white/5 border border-primary/30 overflow-hidden w-fit scale-75 origin-left md:scale-90">
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

          {/* Guests */}
          <div className="lg:col-span-1">
            <label className="block font-medium mb-2 text-xs">Guests</label>
            <div className="space-y-4 bg-white/5 border border-primary/30 rounded-xl p-4">
              {/* Adults Dropdown */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-gray-300">Adults</div>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="bg-white/5 border border-primary/30 rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Children Dropdown */}
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-gray-300">
                  Children (0–12)
                </div>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="bg-white/5 border border-primary/30 rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                >
                  {Array.from({ length: 13 }, (_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>

              {/* Children Ages Dropdowns */}
              {children > 0 && (
                <div className="space-y-2 pt-3 border-t border-primary/20">
                  <div className="text-xs font-medium text-gray-300">
                    Children Ages
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Array.from({ length: children }).map((_, i) => (
                      <div key={i} className="flex flex-col">
                        <label className="text-xs text-gray-400 mb-1">
                          Child {i + 1}
                        </label>
                        <select
                          value={childrenAges[i] ?? ""}
                          onChange={(e) =>
                            setChildAge(i, Number(e.target.value))
                          }
                          className="bg-white/5 border border-primary/30 rounded-lg px-3 py-1 text-sm focus:ring-1 focus:ring-primary outline-none"
                        >
                          <option value="">Age</option>
                          {Array.from({ length: 13 }, (_, age) => (
                            <option key={age} value={age}>
                              {age}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            className="w-full md:w-auto px-10 py-3 rounded-xl font-medium bg-primary text-white text-sm shadow-md hover:brightness-90 transition mt-3"
          >
            Book Now
          </button>
        </div>
      </form>
    </div>
  );
}
