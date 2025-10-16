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
    src: "/images/gallery/adama.jpg",
    title: "Lobby Elegance",
    branch: "addis",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80",
    title: "Pool View",
    branch: "addis",
    categories: ["Activities"],
    type: "photo",
  },
  {
    id: 3,
    title: "Sunset Yoga",
    description: "Relax your mind with our evening sessions",
    branch: "addis",
    categories: ["Activities", "Nature"],
    type: "story",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80",
    title: "Luxurious Suite",
    branch: "addis",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
    title: "Rooftop Lounge",
    branch: "addis",
    categories: ["Dining", "Activities"],
    type: "photo",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1501183638714-9e3c0e6f86a6?auto=format&fit=crop&w=600&q=80",
    title: "Garden Patio",
    branch: "addis",
    categories: ["Nature"],
    type: "photo",
  },
  {
    id: 7,
    title: "Cultural Evenings",
    description: "Experience local traditions & music",
    branch: "addis",
    categories: ["Activities"],
    type: "story",
  },

  // Hawassa
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=600&q=80",
    title: "Lakefront Views",
    branch: "hawassa",
    categories: ["Nature"],
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
    categories: ["Activities", "Nature"],
    type: "story",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1502920514311-28b5d6e3a4a4?auto=format&fit=crop&w=600&q=80",
    title: "Poolside Relaxation",
    branch: "hawassa",
    categories: ["Activities"],
    type: "photo",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1494522204914-87c794b7bc97?auto=format&fit=crop&w=600&q=80",
    title: "Sunset Deck",
    branch: "hawassa",
    categories: ["Nature", "Dining"],
    type: "photo",
  },

  // Jimma
  {
    id: 21,
    src: "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=600&q=80",
    title: "Riverfront Charm",
    branch: "jimma",
    categories: ["Nature"],
    type: "photo",
  },
  {
    id: 22,
    src: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=600&q=80",
    title: "Elegant Rooms",
    branch: "jimma",
    categories: ["Accommodation"],
    type: "photo",
  },
  {
    id: 23,
    title: "Cultural Evenings",
    description: "Immerse in local music and dance",
    branch: "jimma",
    categories: ["Activities"],
    type: "story",
  },
  {
    id: 24,
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    title: "Balcony Views",
    branch: "jimma",
    categories: ["Nature"],
    type: "photo",
  },
];
