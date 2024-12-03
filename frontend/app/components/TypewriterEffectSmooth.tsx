// components/ui/typewriter-effect.tsx
import React, { useEffect, useState } from "react";

interface Word {
  text: string;
  className?: string;
}

interface TypewriterEffectSmoothProps {
  words: Word[];
}

export const TypewriterEffectSmooth: React.FC<TypewriterEffectSmoothProps> = ({ words }) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [wordIndex, setWordIndex] = useState<number>(0);
  const [charIndex, setCharIndex] = useState<number>(0);

  useEffect(() => {
    if (wordIndex < words.length) {
      const word = words[wordIndex].text;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + word[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);

      if (charIndex === word.length) {
        clearInterval(interval);
        setTimeout(() => {
          setWordIndex((prev) => prev + 1);
          setCharIndex(0);
          setDisplayedText("");
        }, 1000);
      }

      return () => clearInterval(interval);
    }
  }, [charIndex, wordIndex, words]);

  return (
    <span className={words[wordIndex]?.className}>{displayedText}</span>
  );
};
