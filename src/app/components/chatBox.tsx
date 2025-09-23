"use client";

import { useRef, useState } from "react";

const faqResponses: Record<string, string> = {
  "check availability":
    "Sure! You can check availability by clicking 'Reserve Your Stay' or using the booking modal.",
  contact:
    "You can reach us at +251 912 345 678 or email: info@hailehotels.com",
  location:
    "We have several resorts across Ethiopia, including Addis Ababa, Hawassa, Arba Minch, and more.",
  price:
    "Prices vary depending on resort and season. Please check our booking section for real-time info.",
  services:
    "We offer spa & wellness, fine dining, pool, conference halls, and 24/7 service.",
  gallery:
    "Feel free to explore our gallery section above to see our beautiful locations.",
};

function getReply(msg: string): string {
  msg = msg.toLowerCase();
  for (const key in faqResponses) {
    if (msg.includes(key)) return faqResponses[key];
  }
  return "🤖 Sorry, I didn't get that. Try asking about availability, contact, location, or services.";
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState<string[]>([
    "👋 Hello! How can I help you today?",
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = `🧑 ${input}`;
    const botMsg = `🤖 ${getReply(input)}`;

    setChatLog((prev) => [...prev, userMsg, botMsg]);
    setInput("");

    // Scroll to bottom
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 0);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[var(--primary)] text-white p-4 rounded-full shadow-xl hover:scale-105 transition"
      >
        💬
      </button>

      {/* Chatbox */}
      {isOpen && (
        <div className="w-80 bg-white rounded-xl shadow-lg mt-3 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[var(--primary)] text-white px-4 py-3 font-semibold flex justify-between items-center">
            <span>Hi there! 👋</span>
            <button onClick={() => setIsOpen(false)} className="text-xl">
              &times;
            </button>
          </div>

          {/* Chat Log */}
          <div
            ref={chatRef}
            className="p-4 h-64 overflow-y-auto text-sm text-gray-800 space-y-2 flex flex-col"
          >
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg ${
                  msg.startsWith("🧑")
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-100 self-start"
                }`}
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t p-2 flex">
            <input
              type="text"
              placeholder="Type a question..."
              className="flex-1 p-2 text-sm border rounded-l focus:outline-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
            <button
              onClick={handleSend}
              className="bg-[var(--primary)] text-white px-4 text-sm rounded-r"
            >
              Send
            </button>
          </div>

          {/* WhatsApp Button */}
          <a
            href="https://wa.me/251912345678"
            target="_blank"
            className="text-center text-sm py-2 bg-green-500 text-white hover:bg-green-600 transition"
          >
            💬 Chat on WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}
