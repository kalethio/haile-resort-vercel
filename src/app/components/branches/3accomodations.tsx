import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Accommodation } from "@/app/data/branches";

interface Props {
  items: Accommodation[]; // updated to receive prop
}

const Accommodations: React.FC<Props> = ({ items }) => {
  const [cards, setCards] = useState(items); // use passed items
  const centerIndex = Math.floor(cards.length / 2);

  const rotateNext = () => {
    const newCards = [...cards];
    const first = newCards.shift()!;
    newCards.push(first);
    setCards(newCards);
  };

  const rotatePrev = () => {
    const newCards = [...cards];
    const last = newCards.pop()!;
    newCards.unshift(last);
    setCards(newCards);
  };

  return (
    <section className="w-full py-28">
      <h2 className="text-center text-primary m-4 text-3xl md:text-4xl font-serif tracking-widest uppercase mb-16">
        Accommodations
      </h2>

      <div className="relative flex justify-center items-center gap-10 md:gap-12 overflow-hidden py-8 px-4">
        {cards.map((item, index) => {
          const distanceFromCenter = Math.abs(index - centerIndex);
          const isCenter = index === centerIndex;

          return (
            <motion.div
              key={item.title}
              className="flex-shrink-0 cursor-pointer"
              animate={{
                scale: isCenter ? 1.15 : 0.85,
                opacity: distanceFromCenter > 2 ? 0 : 1,
                filter: isCenter
                  ? "blur(0px) brightness(100%)"
                  : "blur(3px) brightness(70%)",
                zIndex: isCenter ? 20 : 5,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                duration: 0.6,
              }}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`rounded-2xl overflow-hidden shadow-md ${
                    isCenter ? "shadow-2xl" : "shadow-lg"
                  } w-64 md:w-80`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-56 md:h-64 object-cover"
                  />
                </div>

                <h3
                  className={`mt-4 font-serif uppercase text-center ${
                    isCenter
                      ? "text-gray-900 text-lg md:text-xl"
                      : "text-gray-500 text-sm md:text-base"
                  }`}
                >
                  {item.title}
                </h3>

                {isCenter && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-center max-w-xs md:max-w-sm"
                  >
                    <p className="text-gray-600 mb-4">{item.description}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-center mt-16 gap-12">
        <button
          onClick={rotatePrev}
          className="w-12 h-12 cursor-pointer bg-primary/20 rounded-full flex items-center justify-center shadow hover:bg-primary/50 transition"
        >
          <FiChevronLeft size={24} />
        </button>
        <button
          onClick={rotateNext}
          className="w-12 h-12 cursor-pointer bg-primary/20 rounded-full flex items-center justify-center shadow hover:bg-primary/50 transition"
        >
          <FiChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default Accommodations;
