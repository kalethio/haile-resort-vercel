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
  "🏨 Book a Room",
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
    triggers: ["location", "where", "resort locations", "branches", "cities"],
    response:
      "📍 Our resorts are located across Ethiopia: Addis Ababa, Hawassa, Arba Minch, and more coming soon. Visit /locations for a full map and details.",
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
    response:
      "🏨 You can check room availability and book online at /booking. For personalized assistance, contact reception on WhatsApp.",
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
      "🍽 Our restaurants serve Ethiopian cuisine, international dishes, and seasonal specialties. Opening hours: 7 AM - 11 PM. For reservations, contact the restaurant staff on WhatsApp.",
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
      "📞 You can reach our staff via WhatsApp for quick support. Choose the department you want to contact: reception, booking, restaurant, or spa.",
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
      "🛎 Standard check-in: 2 PM, check-out: 12 PM. For early check-in or late check-out, contact reception via WhatsApp.",
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
      "🎉 We host weddings, conferences, and special events. Our event team can assist with booking, setup, and catering. Contact reception or booking for arrangements.",
    role: "reception",
  },

  // Policies / FAQs
  {
    triggers: ["policy", "rules", "covid", "safety", "child", "pets"],
    response:
      "📋 Guests are requested to follow resort policies. Children are welcome; pets are not allowed. For full details, visit /policies or contact reception.",
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
