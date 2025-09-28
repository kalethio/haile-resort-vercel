"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Hello! Welcome to Haile Resorts. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close chat when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { from: "user", text: userMessage }]);

    // simple greeting & FAQ logic
    let botReply =
      "🤔 I’m not sure about that, but you can reach us on WhatsApp!";
    const lower = userMessage.toLowerCase();

    if (
      ["hi", "hello", "hey", "good morning", "good evening"].some((g) =>
        lower.includes(g)
      )
    ) {
      botReply =
        "✨ Hello! It’s great to have you here. You can ask me about our locations, bookings, restaurants, spa, or contact support.";
    } else if (lower.includes("location")) {
      botReply =
        "📍 We have resorts across Ethiopia — Addis Ababa, Hawassa, Arba Minch, and more.";
    } else if (lower.includes("book")) {
      botReply =
        "🏨 You can book a room directly on our website or message us on WhatsApp.";
    } else if (lower.includes("restaurant") || lower.includes("dining")) {
      botReply =
        "🍽 We offer fine dining, traditional cuisine, and international menus at our resorts.";
    } else if (lower.includes("spa")) {
      botReply =
        "💆 Our spa & wellness centers offer premium treatments to help you relax.";
    } else if (lower.includes("contact") || lower.includes("support")) {
      botReply =
        "📞 You can contact us via phone, email, or WhatsApp for quick support.";
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    }, 500);

    setInput("");
  };

  const quickReplies = [
    "📍 Locations",
    "🏨 Book a Room",
    "🍽 Restaurants & Dining",
    "💆 Spa & Wellness",
    "📞 Contact Support",
  ];

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">
      {/* Toggle Button */}
      <button
        className="bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        💬
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-80 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-white p-4 text-lg font-semibold">
              Haile Resorts Chat
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2 overflow-y-auto scrollbar-hide">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${
                    msg.from === "bot"
                      ? "bg-primary/10 text-primary self-start"
                      : "bg-primary text-white self-end"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="p-2 flex flex-wrap gap-2">
              {quickReplies.map((qr, i) => (
                <button
                  key={i}
                  className="bg-primary/20 text-primary text-sm px-3 py-1 rounded-full hover:bg-primary/30 transition"
                  onClick={() => {
                    setInput(qr);
                    handleSend();
                  }}
                >
                  {qr}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex border-t border-primary/20">
              <input
                type="text"
                className="flex-1 p-2 outline-none text-sm text-primary"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="bg-primary text-white px-4 hover:brightness-110 transition"
              >
                ➤
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/251900000000"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 text-sm font-medium transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                className="w-4 h-4 fill-current"
              >
                <path d="M16.1 3C9.1 3 3.5 8.6 3.5 15.6c0 2.7.7 5.2 2.1 7.4L3 29l6.2-2c2 1.1 4.3 1.7 6.9 1.7 7 0 12.6-5.6 12.6-12.6S23.1 3 16.1 3zm0 22.7c-2.2 0-4.2-.6-5.9-1.7l-.4-.2-3.7 1.2 1.2-3.6-.2-.4c-1.2-1.7-1.8-3.7-1.8-5.8 0-5.7 4.6-10.3 10.3-10.3 5.7 0 10.3 4.6 10.3 10.3 0 5.7-4.6 10.3-10.3 10.3zm5.7-7.7c-.3-.2-1.7-.8-2-1s-.5-.2-.7.2-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.2-.5-2.2-1.5-.8-.8-1.5-1.7-1.6-2-.2-.3 0-.5.1-.7.1-.1.3-.4.4-.5.2-.2.3-.3.5-.5.2-.2.3-.4.4-.6.1-.2 0-.5 0-.7s-.7-1.7-1-2.3c-.3-.7-.6-.6-.7-.6h-.6c-.2 0-.5.1-.8.4s-1.1 1-1.1 2.5 1.2 2.9 1.4 3.1c.2.2 2.3 3.5 5.6 4.9.8.4 1.4.6 1.8.8.8.2 1.5.2 2.1.1.7-.1 1.7-.7 2-1.3.2-.6.2-1.1.2-1.3-.1-.3-.2-.4-.5-.6z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
