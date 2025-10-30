"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  INITIAL_MESSAGES,
  BOT_RESPONSES,
  DEFAULT_RESPONSE,
  STAFF_CONTACTS,
  StaffRole,
} from "../data/chatBot";

// FAQ Quick replies - organized by priority
const MAIN_QUICK_REPLIES = ["Booking", "Prices", "Amenities"];
const EXPANDED_FAQ = [
  "Check-in/out times",
  "Room types",
  "WiFi & internet",
  "Parking",
  "Pet policy",
  "Cancellation",
  "Transportation",
  "Special requests",
  "Breakfast included",
  "Pool hours",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [currentLink, setCurrentLink] = useState(STAFF_CONTACTS["reception"]);
  const [showExpandedFAQ, setShowExpandedFAQ] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Auto-open with welcome - INCREASED DELAY
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 3000); // Changed from 1500ms to 3000ms (3 seconds)

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll and focus
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 400);
  }, [messages, isTyping, isOpen]);

  // Enhanced fuzzy matching for better understanding
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "") // Remove punctuation
      .replace(/\s+/g, " "); // Normalize spaces
  };

  const findBestMatch = (message: string) => {
    const normalized = normalizeText(message);

    // Check for exact matches first
    for (const bot of BOT_RESPONSES) {
      for (const trigger of bot.triggers) {
        const normalizedTrigger = normalizeText(trigger);
        if (normalized.includes(normalizedTrigger)) {
          return {
            response: bot.response,
            role: bot.role || ("reception" as StaffRole),
          };
        }
      }
    }

    // Fuzzy matching for common misspellings and variations
    for (const bot of BOT_RESPONSES) {
      for (const trigger of bot.triggers) {
        const normalizedTrigger = normalizeText(trigger);

        // Check if message contains significant parts of the trigger
        const triggerWords = normalizedTrigger.split(" ");
        const messageWords = normalized.split(" ");

        const matchingWords = triggerWords.filter((word) =>
          messageWords.some(
            (msgWord) => msgWord.includes(word) || word.includes(msgWord)
          )
        );

        // If more than 50% of trigger words match, consider it a match
        if (matchingWords.length >= Math.ceil(triggerWords.length * 0.5)) {
          return {
            response: bot.response,
            role: bot.role || ("reception" as StaffRole),
          };
        }
      }
    }

    return { response: DEFAULT_RESPONSE, role: "reception" as StaffRole };
  };

  const handleSend = (customInput?: string) => {
    const userMessage = customInput ?? input.trim();
    if (!userMessage) return;

    setMessages((prev) => [...prev, { from: "user", text: userMessage }]);
    setInput("");
    setShowExpandedFAQ(false);

    setIsTyping(true);

    setTimeout(
      () => {
        const { response: botReply, role } = findBestMatch(userMessage);
        setCurrentLink(STAFF_CONTACTS[role]);

        setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
        setIsTyping(false);
      },
      800 + Math.random() * 400
    );
  };

  const toggleExpandedFAQ = () => {
    setShowExpandedFAQ(!showExpandedFAQ);
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Button */}
      <motion.div
        className="flex flex-col items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <button onClick={() => setIsOpen(!isOpen)} className="">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="visually-hidden "
              ></motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xl w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/90 text-white flex items-center justify-center shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 relative border-2 border-white/20 backdrop-blur-sm"
              >
                💬
              </motion.span>
            )}
          </AnimatePresence>

          {/* Pulse dot */}
          {!isOpen && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 h-[500px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-primary/10 mt-4 backdrop-blur-sm bg-white/95"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/70 to-primary/50 text-white py-2 px-4">
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-bold text-sm">Haile Concierge</div>
                    <div className="text-xs opacity-90">
                      Online • FAQ Assistant
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] px-4 py-3 rounded-2xl break-words ${
                    msg.from === "bot"
                      ? "bg-gray-50 text-gray-800 rounded-bl-none border border-gray-100"
                      : "bg-gradient-to-r from-primary to-primary/90 text-white rounded-br-none ml-auto"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="max-w-[85%] px-4 py-3 rounded-2xl rounded-bl-none bg-gray-50 text-gray-800 border border-gray-100"
                >
                  <div className="flex space-x-1">
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      className="w-2 h-2 bg-gray-400 rounded-full"
                    />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Reply Suggestions */}
            <div className="px-4 pt-2">
              <div className="flex flex-wrap gap-2 justify-start">
                {MAIN_QUICK_REPLIES.map((reply, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSend(reply)}
                    className="px-3 py-1.5 text-primary text-sm font-normal rounded-full hover:bg-primary/5 transition-colors border border-primary/20 whitespace-nowrap"
                  >
                    {reply}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Hint Section */}
            <motion.button
              onClick={toggleExpandedFAQ}
              className="mx-4 my-2 py-2 text-sm text-gray-600 hover:text-primary transition-colors flex items-center justify-center gap-2 bg-gray-100/50 hover:bg-gray-200/50 rounded-full border border-gray-200/50"
              whileHover={{ scale: 1.02 }}
            >
              <span>💡</span>
              more
              <span>▼</span>
            </motion.button>

            {/* Expandable FAQ Section */}
            <AnimatePresence>
              {showExpandedFAQ && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 border-t border-gray-100 bg-gray-50/30 overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold text-gray-700">
                      Common Questions
                    </div>
                    <button
                      onClick={toggleExpandedFAQ}
                      className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      ▲ Hide
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {EXPANDED_FAQ.map((faq, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSend(faq)}
                        className="px-3 py-2 bg-white text-gray-700 text-xs rounded-lg hover:bg-primary/5 hover:text-primary transition-all border border-gray-200 text-left truncate"
                        title={faq}
                      >
                        {faq}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area with WhatsApp Icon - CHANGED TEXT COLOR TO BLACK */}
            <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex gap-2">
                {/* WhatsApp Icon Button */}
                <motion.a
                  href={currentLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full flex items-center justify-center hover:from-green-600 hover:to-green-700 transition-all shadow-sm flex-shrink-0"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.18-1.24-6.17-3.495-8.416" />
                  </svg>
                </motion.a>

                {/* Input Field - CHANGED TEXT COLOR TO BLACK */}
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-sm bg-white/50 backdrop-blur-sm text-black placeholder-gray-500"
                  placeholder="Type your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />

                {/* Send Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-gradient-to-r from-primary to-primary/90 text-white rounded-full flex items-center justify-center hover:from-primary/90 hover:to-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm flex-shrink-0"
                >
                  ➤
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
