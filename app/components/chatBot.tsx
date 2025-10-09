"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  INITIAL_MESSAGES,
  QUICK_REPLIES,
  BOT_RESPONSES,
  DEFAULT_RESPONSE,
  STAFF_CONTACTS,
  StaffRole,
} from "../data/chatBot";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [currentLink, setCurrentLink] = useState(STAFF_CONTACTS["reception"]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Click outside to close
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Levenshtein distance for typo tolerance
  const levenshteinDistance = (a: string, b: string): number => {
    const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) =>
      Array.from({ length: a.length + 1 }, (_, j) =>
        i === 0 ? j : j === 0 ? i : 0
      )
    );

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        matrix[i][j] =
          b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : 1 +
              Math.min(
                matrix[i - 1][j],
                matrix[i][j - 1],
                matrix[i - 1][j - 1]
              );
      }
    }
    return matrix[b.length][a.length];
  };

  // Match user input to bot response
  const matchResponse = (message: string) => {
    const lower = message.toLowerCase().trim();
    for (const bot of BOT_RESPONSES) {
      for (const trigger of bot.triggers) {
        if (
          lower.includes(trigger.toLowerCase()) ||
          levenshteinDistance(lower, trigger.toLowerCase()) <= 2
        ) {
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

    const { response: botReply, role } = matchResponse(userMessage);
    setCurrentLink(STAFF_CONTACTS[role]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    }, 250);

    setInput("");
  };

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Toggle Button */}
      {/* Toggle Button */}
      {/* Minimal Chat Bubble + Microcopy — paste in place of your current toggle button */}
      {/* Concierge toggle — minimal & premium (color override to ensure primary) */}
      <div className="concierge-wrapper">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open concierge chat"
          title="Concierge"
          className="concierge-toggle"
        >
          <svg
            viewBox="0 0 24 24"
            className="concierge-icon"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-hidden="true"
          >
            <path
              d="M12 3c-3 0-5 1.5-6 3.5V9h12V6.5C17 4.5 15 3 12 3z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 11v2a6 6 0 0012 0v-2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="18.2" r="1.8" fill="currentColor" />
          </svg>
        </button>

        <span className="concierge-label">conceirge</span>

        <style jsx>{`
          .concierge-wrapper {
            color: var(
              --tw-color-primary,
              rgba(120, 17, 45, 1)
            ); /* ensures icon + label use primary */
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
            width: max-content;
            line-height: 1;
          }

          .concierge-toggle {
            width: 64px;
            height: 64px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 9999px;
            background: transparent;
            border: none;
            /* color comes from wrapper (currentColor) */
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(120, 17, 45, 1);
            transition:
              transform 140ms ease,
              box-shadow 140ms ease;
            padding: 0;
          }

          .concierge-toggle:focus {
            outline: none;
            box-shadow: 0 0 0 6px rgba(120, 17, 45, 1);
          }

          .concierge-icon {
            width: 38px;
            height: 38px;
            display: block;
            transform-origin: 50% 45%;
          }

          .concierge-toggle:hover {
            transform: translateY(-3px) scale(1.04);
          }

          .concierge-label {
            display: inline-block;
            color: currentColor; /* will inherit wrapper color */
            font-size: 12px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 9999px;
            background: transparent;
            text-transform: none;
            letter-spacing: 0.2px;
          }

          @media (prefers-reduced-motion: reduce) {
            .concierge-toggle {
              transition: none !important;
              transform: none !important;
            }
          }
        `}</style>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="w-80 h-[480px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary text-white p-3 text-lg font-semibold">
              Haile Resorts Chat
            </div>

            {/* Messages */}
            <div className="flex-1 p-2 space-y-1 overflow-y-auto scrollbar-hide text-sm">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] px-2 py-1 rounded-xl break-words ${
                    msg.from === "bot"
                      ? "bg-primary/10 text-primary self-start"
                      : "bg-primary text-white self-end"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-2 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((qr, i) => (
                <button
                  key={i}
                  className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full hover:bg-primary/30 transition"
                  onClick={() => handleSend(qr)}
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
                onClick={() => handleSend()}
                className="bg-primary text-white px-4 hover:brightness-110 transition"
              >
                ➤
              </button>
            </div>

            {/* WhatsApp CTA */}
            <a
              href={currentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 text-sm font-medium transition"
            >
              Chat on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
