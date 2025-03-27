"use client";
 
import { useState, useEffect } from "react";

export default function TypewriterText({ text, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = text.split(" "); 

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + (prev ? " " : "") + words[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, words, speed]);

  return (
    <span className="inline-block">
      {displayedText}
      {currentIndex < words.length && (
        <span className="inline-block animate-pulse">▋</span>
      )}
    </span>
  );
} 