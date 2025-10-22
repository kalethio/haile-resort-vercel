"use client";

import { useState, useEffect } from "react";
import { branches, categories, photos, Photo } from "../../data/galleryData";

export default function CreativeGalleryWithCategories() {
  const [activeBranch, setActiveBranch] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [showBranchSelector, setShowBranchSelector] = useState(false);

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

  return (
    <div className="flex mt-24 relative">
      {/* Main Gallery Section */}
      <div className="flex-1">
        {/* Category Pills */}
        <div className="sticky top-[88px] z-20 bg-white/90 backdrop-blur-md py-2 px-6 flex flex-wrap gap-3 max-w-[1200px] mx-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setLightboxPhoto(null);
              }}
              className={`px-4 py-1 rounded-full border-2 font-semibold text-sm cursor-pointer transition ${
                activeCategory === cat
                  ? "bg-primary border-primary text-white shadow-md"
                  : "border-gray-300 text-gray-700 hover:bg-primary/10 hover:text-primary hover:border-primary"
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
                className={`break-inside-avoid relative rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl ${
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

      {/* Branch Selector Toggle Button - Now on the Right */}
      <div className="sticky top-24 z-30 h-fit">
        <button
          onClick={() => setShowBranchSelector(!showBranchSelector)}
          className="mr-4 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-300 rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <span className="font-semibold text-gray-700">Branches</span>
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform duration-200 ${
              showBranchSelector ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Branch Selector Dropdown */}
        {showBranchSelector && (
          <div className="absolute top-full right-4 mt-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl shadow-lg py-3 w-48 z-40">
            {/* All Branches */}
            <button
              onClick={() => {
                setActiveBranch("all");
                setShowBranchSelector(false);
                setLightboxPhoto(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex items-center gap-3 w-full px-4 py-2 transition-all ${
                activeBranch === "all"
                  ? "bg-green-50 text-green-800 font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-gray-100">
                🌍
              </div>
              <span>All Branches</span>
            </button>

            {branches.map((branch) => (
              <button
                key={branch.id}
                onClick={() => {
                  setActiveBranch(branch.id);
                  setShowBranchSelector(false);
                  setLightboxPhoto(null);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`flex items-center gap-3 w-full px-4 py-2 transition-all ${
                  activeBranch === branch.id
                    ? "bg-green-50 text-green-800 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 shadow-sm">
                  <img
                    src={branch.thumbnail}
                    alt={branch.name}
                    className="object-cover w-full h-full"
                    loading="lazy"
                  />
                </div>
                <span>{branch.name}</span>
              </button>
            ))}
          </div>
        )}
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
