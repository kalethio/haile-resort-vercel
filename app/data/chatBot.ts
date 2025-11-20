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
    response: "✨ Hello! Welcome to Haile Resorts. How can I assist you today?",
  },

  // Booking/Reservation
  {
    triggers: [
      "book",
      "reservation",
      "reserve",
      "booking",
      "availability",
      "booking",
    ],
    response: `You can book your stay through our official website, or by contacting us directly.\nMobile: +251 956 79 79 79 | Hotline: 8169 | Telephone: +251 116 92 20 56/57/58\nE-mail: book@haileresorts.com | groupreservation@haileresorts.com`,
    role: "booking",
  },

  // Room Types
  {
    triggers: [
      "room types",
      "types of rooms",
      "rooms available",
      "room",
      "suite",
      "villa",
    ],
    response:
      "We offer a variety of rooms including standard, suites, and luxury villas to suit your needs.",
    role: "booking",
  },

  // Prices
  {
    triggers: [
      "pricing",
      "rates",
      "cost",
      "price",
      "room cost",
      "fees",
      "prices",
    ],
    response:
      "💰 Room rates vary by season and type. Check pricing online at /booking or contact reception for special offers and packages.",
    role: "booking",
  },

  // Amenities
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

  // Check-in/out times
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
      "Early check-in and late check-out are subject to availability. Please inform us ahead of time to accommodate your request.",
    role: "reception",
  },

  // Wedding & Events
  {
    triggers: [
      "wedding",
      "event",
      "venue",
      "conference",
      "meeting",
      "party",
      "celebration",
    ],
    response:
      "Yes, Haile Hotels and Resorts provide elegant venues and tailored packages for weddings, conferences, and special events.",
    role: "reception",
  },

  // WiFi & Internet
  {
    triggers: ["wifi", "internet", "wi-fi", "wireless"],
    response:
      "Complimentary high-speed Wi-Fi is available in all guest rooms and public areas.",
  },

  // Parking
  {
    triggers: ["parking", "car park", "vehicle"],
    response:
      "Complimentary parking is available for all guests throughout their stay.",
  },

  // Pet Policy
  {
    triggers: ["pet", "pets", "dog", "cat", "animal", "pet policy"],
    response:
      "Our policy is pet-free; animals are prohibited from our properties to maintain a clean environment for guests with allergies.",
  },

  // Cancellation
  {
    triggers: ["cancellation", "cancel", "refund"],
    response:
      "Please refer to our cancellation policy at the time of booking or contact our reservation team for specific terms and conditions.",
    role: "booking",
  },

  // Transportation
  {
    triggers: [
      "transportation",
      "airport shuttle",
      "airport transfer",
      "shuttle",
      "pickup",
    ],
    response:
      "Yes, we offer airport transfers. Please let us know your flight details when booking for a seamless pickup.",
    role: "reception",
  },

  // Special Requests
  {
    triggers: ["special requests", "special request", "request"],
    response:
      "We strive to accommodate all special requests. Please inform us during booking or contact reception in advance.",
    role: "reception",
  },

  // Breakfast
  {
    triggers: ["breakfast", "breakfast included", "meal"],
    response:
      "Please check your booking details as breakfast inclusion varies by room package. We offer multiple dining options serving breakfast daily.",
    role: "restaurant",
  },

  // Pool Hours
  {
    triggers: ["pool hours", "pool", "swimming", "swim"],
    response:
      "Our swimming pools are generally open from 6:00 AM to 10:00 PM. Specific hours may vary by location and season.",
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
      "Yes, we feature multiple restaurants and bars offering local and international cuisines.",
    role: "restaurant",
  },

  // Locations
  {
    triggers: [
      "location",
      "where",
      "resort locations",
      "branches",
      "destinations",
      "how many destinations",
    ],
    response:
      "Haile Hotels and Resorts operate in 10 destinations across Ethiopia: namely we are operational in Addis Ababa, Hawassa, Arba Minch, Adama, Wolaita Sodo, Gondar, Batu (Ziway), Shashemene, Jimma, and Sululta (Yaya Athletics Village).",
  },

  // COVID Safety
  {
    triggers: [
      "covid",
      "covid-19",
      "safety",
      "health",
      "sanitization",
      "hygiene",
    ],
    response:
      "We follow strict health protocols including regular sanitization and executing mandatory hygiene protocols in public areas.",
  },

  // Contact Support
  {
    triggers: [
      "contact",
      "support",
      "help",
      "assist",
      "phone",
      "email",
      "whatsapp",
      "customer support",
    ],
    response:
      "You can reach our 24/7 customer support team via the front desk, phone, or email.",
    role: "reception",
  },

  // Spa & Wellness
  {
    triggers: ["spa", "wellness", "massage", "treatment", "relax", "facial"],
    response:
      "💆 Our spa & wellness centers offer massages, facials, aromatherapy, and wellness treatments. Book your session via WhatsApp with the spa team.",
    role: "spa",
  },
];

export const DEFAULT_RESPONSE =
  "🤔 Sorry, I’m not sure about that. Try rephrasing your question, check for hints or contact support via WhatsApp.";

export const STAFF_CONTACTS: Record<StaffRole, string> = {
  reception: "https://wa.me/251900000001",
  spa: "https://wa.me/251900000002",
  restaurant: "https://wa.me/251900000003",
  booking: "https://wa.me/251900000004",
};
