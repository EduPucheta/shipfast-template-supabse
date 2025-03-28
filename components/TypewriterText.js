"use client";
 
import { useState, useEffect } from "react";

function formatText(text) {
  // Handle bold text with markdown-style **
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

export default function TypewriterText({ text, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const lines = text.split("\n");
  const words = lines.map(line => line.split(" "));
  const flatWords = words.reduce((acc, lineWords, i) => {
    if (i === 0) return lineWords;
    return [...acc, "\n", ...lineWords];
  }, []);

  useEffect(() => {
    if (currentIndex < flatWords.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => {
          const newWord = flatWords[currentIndex];
          if (newWord === "\n") return prev + "\n";
          return prev + (prev && !prev.endsWith("\n") ? " " : "") + newWord;
        });
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, flatWords, speed]);

  // Format the final text with bold styling
  const formattedText = formatText(displayedText);

  return (
    <span 
      className="inline-block whitespace-pre-wrap"
      dangerouslySetInnerHTML={{ __html: formattedText }}
    >
    </span>
  );
} 