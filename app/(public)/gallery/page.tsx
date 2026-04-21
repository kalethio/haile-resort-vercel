"use client";

import { useState, useEffect } from "react";
import { categories, photos, Photo } from "../../data/galleryData";

interface Branch {
  id: string;
  branchName: string;
  slug: string;
}

export default function CreativeGalleryWithCategories() {
  const [activeBranch, setActiveBranch] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [showBranchSelector, setShowBranchSelector] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    fetch("/api/admin/branches-list")
      .then((res) => res.json())
      .then((data) => setBranches(data.branches));
  }, []);

  const filteredPhotos = photos.filter((item) => {
    if (activeBranch !== "all" && item.branch !== activeBranch) return false;
    if (activeCategory === "All") return true;
    return item.categories.includes(activeCategory);
  });

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxPhoto) return;
      const currentIndex = filteredPhotos.findIndex(
        (i) => i.id === lightboxPhoto.id
      );

      if (e.key === "ArrowRight") {
        let nextIndex = (currentIndex + 1) % filteredPhotos.length;
        while (filteredPhotos[nextIndex].type !== "photo")
          nextIndex = (nextIndex + 1) % filteredPhotos.length;
        setLightboxPhoto(filteredPhotos[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        let prevIndex =
          (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        while (filteredPhotos[prevIndex].type !== "photo")
          prevIndex =
            (prevIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
        setLightboxPhoto(filteredPhotos[prevIndex]);
      } else if (e.key === "Escape") {
        setLightboxPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxPhoto, filteredPhotos]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".branch-selector")) {
        setShowBranchSelector(false);
      }
    };
    if (showBranchSelector) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showBranchSelector]);

  return (
    <div className="flex mt-24 relative">
      {/* Main Gallery Section */}
      <div className="flex-1">
        {/* Branch Selector Section */}
        <div className="sticky top-[88px] z-20 bg-transparent py-2 px-6 max-w-[1200px] mx-auto">
          <div className="branch-selector">
            <button
              onClick={() => setShowBranchSelector(!showBranchSelector)}
              className="px-4 py-1 rounded-full border-2 border-gray-300 font-semibold text-sm cursor-pointer hover:scale-105 bg-white text-gray-700"
            >
              {activeBranch === "all"
                ? "Choose a branch"
                : branches.find((b) => b.slug === activeBranch)?.branchName ||
                  "Choose a branch"}
            </button>

            {/* Branch List - stays open after selection */}
            {showBranchSelector && (
              <div className="flex flex-wrap gap-4 mt-3">
                <button
                  onClick={() => {
                    setActiveBranch("all");
                    // Do NOT close popup
                  }}
                  className={`text-sm cursor-pointer hover:scale-105 ${
                    activeBranch === "all"
                      ? "font-bold text-primary"
                      : "text-gray-600"
                  }`}
                >
                  All Branches
                </button>
                {branches.map((branch) => (
                  <button
                    key={branch.id}
                    onClick={() => {
                      setActiveBranch(branch.slug);
                      // Do NOT close popup
                    }}
                    className={`text-sm cursor-pointer hover:scale-105 ${
                      activeBranch === branch.slug
                        ? "font-bold text-primary"
                        : "text-gray-600"
                    }`}
                  >
                    {branch.branchName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="sticky top-[136px] z-20 backdrop-blur-md py-2 px-6 flex flex-wrap gap-3 max-w-[1200px] mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxPhoto(null);
              }}
              className={`px-4 py-1 rounded-full border-2 font-semibold text-sm cursor-pointer transition hover:scale-105 ${
                activeCategory === cat
                  ? "bg-primary border-primary text-white shadow-md"
                  : "border-gray-300 text-gray-700 bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Masonry */}
        <div
          className="relative max-w-[1200px] mx-auto px-4 py-8 columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6"
          style={{ columnFill: "balance" }}
        >
          {filteredPhotos.map((item, idx) =>
            item.type === "photo" ? (
              <div
                key={item.id}
                className={`break-inside-avoid relative rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 ${
                  (idx + 1) % 7 === 0 ? "lg:col-span-2 lg:row-span-2" : ""
                }`}
                onClick={() => setLightboxPhoto(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && setLightboxPhoto(item)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full rounded-lg object-cover aspect-[4/3]"
                  loading="lazy"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white font-semibold text-sm">
                  {item.title}
                </div>
              </div>
            ) : (
              <div
                key={`story-${idx}`}
                className="break-inside-avoid relative rounded-lg bg-primary text-white p-6 font-serif text-lg shadow-lg overflow-hidden mb-6"
              >
                <h3 className="mb-2 font-bold tracking-wide">{item.title}</h3>
                <p className="opacity-90">{item.description}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-6"
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-primary transition"
          >
            &times;
          </button>
          <img
            src={lightboxPhoto.src}
            alt={lightboxPhoto.title}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="absolute bottom-10 left-0 right-0 text-center text-white font-serif text-lg">
            {lightboxPhoto.title}
          </div>
        </div>
      )}
    </div>
  );
}
