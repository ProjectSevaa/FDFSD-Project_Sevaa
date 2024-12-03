"use client";
import { motion } from "framer-motion";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import HeroScrollDemo from "./HeroScrollDemo";

export default function HeroHighlightDemo() {
  return (
    <HeroHighlight>
      <motion.h1
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: [20, -5, 0],
        }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
        }}
        className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold text-neutral-700 dark:text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
      >
        Transforming Leftovers into a Lifesaving Cause{" "}
        <Highlight className="text-black dark:text-white">
        Hunger Heats
        </Highlight>
      </motion.h1>
      <div className="h-[10rem]"></div>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
      />
    </HeroHighlight>
  );
}
const testimonials = [
  {
    quote:
      "It was the best of times when we shared food with those in need, and the worst of times when we wasted it. It was the age of wisdom to redistribute leftovers, and the age of foolishness to ignore hunger. It was a season of hope, turning despair into joy.",
    name: "Charles Dickens",
    title: "Inspired by A Tale of Two Cities",
  },
  {
    quote:
      "To give, or not to give, that is the question: Whether 'tis nobler to share our abundance with the hungry, or to let it go to waste. By taking action, we not only feed others but also nourish our souls.",
    name: "William Shakespeare",
    title: "Inspired by Hamlet",
  },
  {
    quote:
      "All that we cook or save can be a dream of sustenance for someone in need. A meal within a meal can spark hope within despair.",
    name: "Edgar Allan Poe",
    title: "Inspired by A Dream Within a Dream",
  },
  {
    quote:
      "It is a truth universally acknowledged that food left untouched is best shared with those in hunger, rather than wasted.",
    name: "Jane Austen",
    title: "Inspired by Pride and Prejudice",
  },
  {
    quote:
      "Call me a helper. Some days ago—never mind how long precisely—I saw leftovers that could feed many, and chose to bridge the gap between surplus and scarcity.",
    name: "Herman Melville",
    title: "Inspired by Moby-Dick",
  },
];