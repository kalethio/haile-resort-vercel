// === Types ===
export type Branch = { id: string; name: string; thumbnail: string };
export type PhotoType = "photo" | "story";

export interface Photo {
  id: number;
  src?: string;
  title: string;
  description?: string;
  branch: string;
  categories: string[];
  type: PhotoType;
}

// === Branches ===
export const branches: Branch[] = [
  {
    id: "addis",
    name: "Haile Grand — Addis Ababa",
    thumbnail: "/images/gallery/AddisGrand.jpg",
  },
  {
    id: "hawassa",
    name: "Haile Resort — Hawassaa",
    thumbnail: "/images/gallery/Hawassa.JPG",
  },
  {
    id: "jimma",
    name: "Haile Resort — Jimma",
    thumbnail: "/images/gallery/Jimma.jpg",
  },
  {
    id: "Arbaminch",
    name: "Haile Resort — Arba Minch",
    thumbnail: "/images/gallery/arbaminchi.jpg",
  },
  {
    id: "Adama",
    name: "Haile Resort — Adama",
    thumbnail: "/images/gallery/Adama.JPG",
  },
  {
    id: "Batu",
    name: "Haile Resort — Batu",
    thumbnail: "/images/gallery/Batu.JPG",
  },
  {
    id: "Sululta",
    name: " Haile Village — Sululta",
    thumbnail: "/images/gallery/yaya_7_layer1.jpeg",
  },
  {
    id: "Wolaita",
    name: "Haile Hotel — Wolaita",
    thumbnail: "/images/gallery/wolaita-sodo.jpeg",
  },
  {
    id: "Gondar",
    name: "Haile Resort — Gondar",
    thumbnail: "/images/gallery/gonder_6_layer.jpeg",
  },
  {
    id: "Shashemene",
    name: "Haile Resort — Shashemene",
    thumbnail: "/images/gallery/Shashemene.jpg",
  },
];

// === Categories ===
export const categories = [
  "All",
  "Accommodation",
  "Dining",
  "Activities",
  "Nature",
];

// === Photos/Stories ===
export const photos: Photo[] = [
  // Addis
  {
    id: 1,
    src: "/images/gallery/Accommodation/lobby1.jpg",
    title: "Lobby Elegance",
    branch: "addis",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 2,
    src: "/images/gallery/Activities/Grand-wellness-2.jpg",
    title: "Pool View",
    branch: "addis",
    categories: ["Activities"],
    type: "photo",
  },
  {
    id: 3,
    src: "/images/gallery/Activities/curture.jpg",
    title: "Sunset Yoga",
    description: "Relax your mind with our evening sessions",
    branch: "addis",
    categories: ["Activities", "Nature"],
    type: "story",
  },
  {
    id: 4,
    src: "/images/gallery/Accommodation/beutiy1.jpg",
    title: "Luxurious Suite",
    branch: "addis",
    categories: ["Accommodation"],
    type: "photo",
  },
  // Hawassa
  {
    id: 5,
    src: "/images/gallery/Dining/haile-resorts-drone-photo-17.jpg",
    title: "Rooftop Lounge",
    branch: "hawassa",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  {
    id: 6,
    src: "/images/gallery/Nature/sunset.jpg",
    title: "Garden Patio",
    branch: "hawassa",
    categories: ["Nature"],
    type: "photo",
  },
  {
    id: 7,
    src: "/images/gallery/Activities/hawassa pool.jpg",
    title: "Cultural Evenings",
    description: "Experience local traditions & music",
    branch: "hawassa",
    categories: ["Activities"],
    type: "story",
  },
  {
    id: 8,
    src: "/images/gallery/Nature/sunset.jpg",
    title: "Lakefront Views",
    branch: "hawassa",
    categories: ["Nature"],
    type: "photo",
  },
  // Jimma
  {
    id: 9,
    src: "/images/gallery/Dining/haile-resorts-drone-photo-17.jpg",
    title: "Dining Experience",
    branch: "jimma",
    categories: ["Dining"],
    type: "photo",
  },
  {
    id: 10,
    src: "/images/gallery/Activities/Pool.jpg",
    title: "Morning Kayaking",
    description: "Start your day with fresh water adventures",
    branch: "jimma",
    categories: ["Activities", "Nature"],
    type: "story",
  },
  {
    id: 11,
    src: "/images/gallery/Activities/Pool2.jpg",
    title: "Poolside Relaxation",
    branch: "jimma",
    categories: ["Activities"],
    type: "photo",
  },
  {
    id: 12,
    src: "/images/gallery/Dining/haile-resorts-rooms-6-4.jpg",
    title: "Sunset Deck",
    branch: "jimma",
    categories: ["Nature", "Dining"],
    type: "photo",
  },
  // arba minch
  {
    id: 13,
    src: "/images/gallery/Nature/arbaminch03.jpg",
    title: "Riverfront Charm",
    branch: "Arbaminch",
    categories: ["Nature"],
    type: "photo",
  },
  {
    id: 14,
    src: "/images/gallery/Accommodation/gum.jpg",
    title: "Elegant Rooms",
    branch: "Arbaminch",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 15,
    src: "/images/gallery/Activities/Pool1.jpg",
    title: "Cultural Evenings",
    description: "Immerse in local music and dance",
    branch: "Arbaminch",
    categories: ["Activities"],
    type: "story",
  },
  {
    id: 16,
    src: "/images/gallery/Nature/arbaminch5.jpg",
    title: "Balcony Views",
    branch: "Arbaminch",
    categories: ["Nature"],
    type: "photo",
  },

  // Adama
  {
    id: 21,
    src: "/images/gallery/Nature/sunset.jpg",
    title: "Lake View",
    branch: "adama",
    categories: ["Nature"],
    type: "photo",
  },
  {
    id: 22,
    src: "/images/gallery/Accommodation/restorant2.jpg",
    title: "Private Villa",
    branch: "adama",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 23,
    src: "/images/gallery/Activities/Pool.jpg",
    title: "Swimming Pool",
    branch: "Adama",
    categories: ["Activities"],
    type: "photo",
  },
  {
    id: 24,
    src: "/images/gallery/Dining/haile-resorts-rooms-1-4.jpg",
    title: "Pool Bar",
    branch: "Adama",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  // Batu
  {
    id: 25,
    src: "/images/gallery/Nature/batu1.jpg",
    title: "Botanical Garden",
    branch: "Batu",
    categories: ["Nature"],
    type: "photo",
  },
  {
    id: 26,
    src: "/images/gallery/Dining/haile-resorts-rooms-1-4.jpg",
    title: "Pool Bar",
    branch: "Batu",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  {
    id: 27,
    src: "/images/gallery/Accommodation/restorant.jpg",
    title: "Private Villa",
    branch: "Batu",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 28,
    src: "/images/gallery/Activities/Pool1.jpg",
    title: "Swimming Pool",
    branch: "Batu",
    categories: ["Activities"],
    type: "photo",
  },
  // Sululta
  {
    id: 29,
    src: "/images/gallery/Accommodation/gum.jpg",
    title: "Cozy Cottage",
    branch: "Sululta",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 30,
    src: "/images/gallery/Dining/DSC01329-scaled.jpg",
    title: "Pool Bar",
    branch: "Sululta",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  {
    id: 31,
    src: "/images/gallery/Accommodation/Meeting2.jpg",
    title: "Private Villa",
    branch: "Sululta",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 32,
    src: "/images/gallery/Activities/Pool1.jpg",
    title: "Swimming Pool",
    branch: "Sululta",
    categories: ["Activities"],
    type: "photo",
  },
  // Wolaita
  {
    id: 33,
    src: "/images/gallery/Accommodation/restorant2.jpg",
    title: "Hotel Room",
    branch: "Wolaita",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 34,
    src: "/images/gallery/Dining/DSC01329-scaled.jpg",
    title: "Pool Bar",
    branch: "Wolaita",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  {
    id: 35,
    src: "/images/gallery/Accommodation/room.jpg",
    title: "Private Villa",
    branch: "Wolaita",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 36,
    src: "/images/gallery/Activities/Pool1.jpg",
    title: "Swimming Pool",
    branch: "Wolaita",
    categories: ["Activities"],
    type: "photo",
  },

  // Gondar
  {
    id: 37,
    src: "/images/gallery/Nature/gonder.jpg",
    title: "Historic Courtyard",
    branch: "Gondar",
    categories: ["Nature"],
    type: "photo",
  },
  {
    id: 38,
    src: "/images/gallery/Dining/haile-resorts-drone-photo-17.jpg",
    title: "Pool Bar",
    branch: "Gondar",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  {
    id: 39,
    src: "/images/gallery/Accommodation/Meeting2.jpg",
    title: "Private Villa",
    branch: "Gondar",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 40,
    src: "/images/gallery/Activities/Pool1.jpg",
    title: "Swimming Pool",
    branch: "Gondar",
    categories: ["Activities"],
    type: "photo",
  },
  // Shashemene
  {
    id: 41,
    src: "/images/gallery/shashemene/activities/golf.jpg",
    title: "Golf Course",
    branch: "Shashemene",
    categories: ["Activities"],
    type: "photo",
  },
  {
    id: 42,
    src: "/images/gallery/Dining/DSC01329-scaled.jpg",
    title: "Pool Bar",
    branch: "Shashemene",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  {
    id: 43,
    src: "/images/gallery/Accommodation/Meeting2.jpg",
    title: "Private Villa",
    branch: "Shashemene",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 44,
    src: "/images/gallery/Activities/Pool1.jpg",
    title: "Swimming Pool",
    branch: "Shashemene",
    categories: ["Activities"],
    type: "photo",
  },
];
