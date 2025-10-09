"use client";

import { useState, useEffect } from "react";

// === Types ===
type Branch = { id: string; name: string; thumbnail: string };
type PhotoType = "photo" | "story";

interface Photo {
  id: number;
  src?: string;
  title: string;
  description?: string;
  branch: string;
  categories: string[];
  type: PhotoType;
}

// === Data (can move to a separate file for cleanliness) ===
const branches: Branch[] = [
  {
    id: "addis",
    name: "Addis Ababa",
    thumbnail:
      "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: "hawassa",
    name: "Hawassa",
    thumbnail:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=80&q=80",
  },
  {
    id: "jimma",
    name: "Jimma",
    thumbnail:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=80&q=80",
  },
];

const categories = [
  "All",
  "Pool",
  "Rooms",
  "Dining",
  "Events",
  "Nature Views",
  "Relaxation",
];

const photos: Photo[] = [
  // Addis
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=600&q=80",
    title: "Lobby Elegance",
    branch: "addis",
    categories: ["Rooms"],
    type: "photo",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
    title: "Pool View",
    branch: "addis",
    categories: ["Pool", "Relaxation"],
    type: "photo",
  },
  {
    id: 3,
    title: "Sunset Yoga",
    description: "Relax your mind with our evening sessions",
    branch: "addis",
    categories: ["Events", "Relaxation"],
    type: "story",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    title: "Luxurious Suite",
    branch: "addis",
    categories: ["Rooms"],
    type: "photo",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
    title: "Rooftop Lounge",
    branch: "addis",
    categories: ["Dining", "Relaxation"],
    type: "photo",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1501183638714-9e3c0e6f86a6?auto=format&fit=crop&w=600&q=80",
    title: "Garden Patio",
    branch: "addis",
    categories: ["Nature Views", "Relaxation"],
    type: "photo",
  },
  {
    id: 7,
    title: "Cultural Evenings",
    description: "Experience local traditions & music",
    branch: "addis",
    categories: ["Events"],
    type: "story",
  },
  // Hawassa
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    title: "Lakefront Views",
    branch: "hawassa",
    categories: ["Nature Views"],
    type: "photo",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
    title: "Dining Experience",
    branch: "hawassa",
    categories: ["Dining"],
    type: "photo",
  },
  {
    id: 13,
    title: "Morning Kayaking",
    description: "Start your day with fresh water adventures",
    branch: "hawassa",
    categories: ["Events", "Relaxation"],
    type: "story",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1502920514311-28b5d6e3a4a4?auto=format&fit=crop&w=600&q=80",
    title: "Poolside Relaxation",
    branch: "hawassa",
    categories: ["Pool", "Relaxation"],
    type: "photo",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1494522204914-87c794b7bc97?auto=format&fit=crop&w=600&q=80",
    title: "Sunset Deck",
    branch: "hawassa",
    categories: ["Nature Views", "Dining"],
    type: "photo",
  },
  // Bahir Dar
  {
    id: 21,
    src: "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=600&q=80",
    title: "Riverfront Charm",
    branch: "jimma",
    categories: ["Nature Views"],
    type: "photo",
  },
  {
    id: 22,
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
    title: "Elegant Rooms",
    branch: "jimma",
    categories: ["Rooms"],
    type: "photo",
  },
  {
    id: 23,
    title: "Cultural Evenings",
    description: "Immerse in local music and dance",
    branch: "jimma",
    categories: ["Events"],
    type: "story",
  },
  {
    id: 24,
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    title: "Balcony Views",
    branch: "jimma",
    categories: ["Nature Views"],
    type: "photo",
  },
];

// === Component ===
export default function CreativeGalleryWithCategories() {
  const [activeBranch, setActiveBranch] = useState(branches[0].id);
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);

  const filteredPhotos = photos.filter((item) => {
    if (item.branch !== activeBranch) return false;
    if (activeCategory === "All") return true;
    return item.categories.includes(activeCategory);
  });

  // === Lightbox Navigation ===
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
    <>
      {/* Branch Carousel */}
      <div className="sticky mt-24 mb-6 mx-auto max-w-fit top-0 z-30 bg-white/80 backdrop-blur-md py-4 flex space-x-6 overflow-x-auto px-6 scrollbar-hide shadow-sm">
        {branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => {
              setActiveBranch(branch.id);
              setLightboxPhoto(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex flex-col items-center flex-shrink-0 transition-transform transform ${activeBranch === branch.id ? "scale-110 shadow-lg" : "hover:scale-105"}`}
            aria-label={`Select branch ${branch.name}`}
          >
            <div
              className={`w-20 h-20 rounded-full overflow-hidden border-4 ${activeBranch === branch.id ? "border-green-800" : "border-gray-300"} shadow-md`}
            >
              <img
                src={branch.thumbnail}
                alt={branch.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </div>
            <span
              className={`mt-2 text-sm font-semibold ${activeBranch === branch.id ? "text-green-800" : "text-gray-700"}`}
            >
              {branch.name}
            </span>
          </button>
        ))}
      </div>

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
                : "border-gray-300 text-gray-700 hover:bg-green-100 hover:border-green-300"
            }`}
            aria-label={`Filter by category ${cat}`}
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
              className={`break-inside-avoid relative rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-2xl ${(idx + 1) % 7 === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
              onClick={() => setLightboxPhoto(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setLightboxPhoto(item)}
              aria-label={`View photo ${item.title}`}
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

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`Viewing photo: ${lightboxPhoto.title}`}
          onClick={() => setLightboxPhoto(null)}
        >
          <button
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-6 right-6 text-white text-3xl font-bold hover:text-primary transition"
            aria-label="Close lightbox"
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
    </>
  );
}
