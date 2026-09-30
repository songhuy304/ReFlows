"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const quotes = [
  {
    text: "This starter template has saved me countless hours of work and helped me deliver projects to my clients faster than ever before",
    author: "Random Dude",
  },
  {
    text: "I’ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.",
    author: "Maya Angelou",
  },
  {
    text: "Life isn't about getting and having, it's about giving and being.",
    author: "Kevin Kruse",
  },
  {
    text: "Whatever the mind of man can conceive and believe, it can achieve.",
    author: "Napoleon Hill",
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  },
];

const Quote = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const quote = quotes[index];
  return (
    <AnimatePresence mode="wait">
      <motion.blockquote
        key={index}
        className="space-y-2"
        initial={{ opacity: 0, y: 8, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -8, filter: "blur(8px)" }}
        transition={{
          duration: 0.7,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <p className="text-lg">&ldquo;{quote.text}&rdquo;</p>
        <footer className="text-sidebar-foreground/70 text-sm">
          {quote.author}
        </footer>
      </motion.blockquote>
    </AnimatePresence>
  );
};

export default Quote;
