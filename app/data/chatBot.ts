// data/chatbot.ts
export type StaffRole = "reception" | "spa" | "restaurant" | "booking";

export type BotResponse = {
  triggers: string[];
  response: string; // plain text only
  role?: StaffRole;
};

export const INITIAL_MESSAGES = [
  {
    from: "bot",
    text: "👋 Hello! Welcome to Haile Resorts. How can I assist you today?",
  },
];

export const QUICK_REPLIES = [
  "📍 Locations",
  "🏨 Reservation",
  "🍽 Restaurants & Dining",
  "💆 Spa & Wellness",
  "🎉 Events & Conferences",
  "📞 Contact Support",
];

// ---------------------------
// Advanced Bot Responses
// ---------------------------
export const BOT_RESPONSES: BotResponse[] = [
  // Greetings
  {
    triggers: [
      "hi",
      "hello",
      "hey",
      "good morning",
      "good evening",
      "greetings",
    ],
    response:
      "✨ Hello! Welcome to Haile Resorts. Ask me about bookings, restaurants, spa, events, or contact support.",
  },

  // Locations
  {
    triggers: [
      "location",
      "where",
      "resort locations",
      "branches",
      "airport shuttles",
      "destinations",
    ],
    response:
      "📍Haile Hotels and Resorts operate in 10 destinations across Ethiopia: namely we are operational in Addis Ababa, Hawassa, Arba Minch, Adama, Wolaita Sodo, Gondar, Batu (Ziway), Shashemene, Jimma, and Sululta (Yaya Athletics Village).",
  },

  // Room Booking
  {
    triggers: [
      "book",
      "reservation",
      "room",
      "reserve",
      "booking",
      "availability",
    ],
    response: `🏨 You can book your stay through our official website, or by contacting us directly. 
Mobile: +251 956 79 79 79 | Hotline: 8169 | Telephone: +251 116 92 20 56/57/58
E-mail: book@haileresorts.com | groupreservation@haileresorts.com`,
    role: "booking",
  },

  // Restaurant & Dining
  {
    triggers: [
      "restaurant",
      "dining",
      "food",
      "menu",
      "meals",
      "breakfast",
      "lunch",
      "dinner",
    ],
    response:
      "Yes, we feature multiple restaurants and bars offering local and international cuisines",
    role: "restaurant",
  },

  // Spa & Wellness
  {
    triggers: ["spa", "wellness", "massage", "treatment", "relax", "facial"],
    response:
      "💆 Our spa & wellness centers offer massages, facials, aromatherapy, and wellness treatments. Book your session via WhatsApp with the spa team.",
    role: "spa",
  },

  // Contact / Support
  {
    triggers: [
      "contact",
      "support",
      "help",
      "assist",
      "phone",
      "email",
      "whatsapp",
    ],
    response:
      "📞 You can reach our 24/7 customer support team via the front desk, phone, or email",
    role: "reception",
  },

  // Pricing / Room Rates
  {
    triggers: ["pricing", "rates", "cost", "price", "room cost", "fees"],
    response:
      "💰 Room rates vary by season and type. Check pricing online at /booking or contact reception for special offers and packages.",
    role: "booking",
  },

  // Amenities / Facilities
  {
    triggers: [
      "amenities",
      "facilities",
      "services",
      "gym",
      "pool",
      "wifi",
      "internet",
    ],
    response:
      "🏊 Our resorts feature swimming pools, fitness centers, spa, restaurants, conference halls, and high-speed Wi-Fi throughout the property.",
  },

  // Check-in / Check-out
  {
    triggers: [
      "check-in",
      "check out",
      "arrival",
      "departure",
      "early check-in",
      "late check-out",
    ],
    response:
      "🛎 Early check-in and late check-out are subject to availability. Please inform us ahead of time to accommodate your request",
    role: "reception",
  },

  // Events / Conferences
  {
    triggers: [
      "events",
      "conference",
      "meeting",
      "wedding",
      "party",
      "celebration",
    ],
    response:
      "🎉  Haile Hotels and Resorts provide elegant venues and tailored packages for weddings, conferences, and special events.",
    role: "reception",
  },

  // Policies / FAQs
  {
    triggers: ["policy", "rules", "covid", "safety", "child", "pets"],
    response:
      "📋 We follow strict health protocols including regular sanitization and executing mandatory hygiene protocols in public areas. ",
    role: "reception",
  },
];

export const DEFAULT_RESPONSE =
  "🤔 Sorry, I’m not sure about that. Try rephrasing your question or contact support via WhatsApp.";

export const STAFF_CONTACTS: Record<StaffRole, string> = {
  reception: "https://wa.me/251900000001",
  spa: "https://wa.me/251900000002",
  restaurant: "https://wa.me/251900000003",
  booking: "https://wa.me/251900000004",
};
