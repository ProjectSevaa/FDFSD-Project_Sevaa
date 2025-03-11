"use client";
import React from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import Image from "next/image";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import TypewriterEffectSmoothDemo from "./TypewriterEffectSmoothDemo";

export default function HeroScrollDemo() {
    return (
        <div className="flex flex-col overflow-hidden">
            <ContainerScroll
                titleComponent={
                    <>
                        <h1 className="text-4xl font-semibold text-black dark:text-white mb-80">
                            Global Vision for <br />
                            <span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
                                Hunger-Free Tomorrow
                            </span>
                        </h1>
                    </>
                }
            >
                {/* <Image
          src={`/1.webp`}2
          alt="hero"
          height={720}
          width={1400}
          className="mx-auto rounded-2xl object-cover h-full object-left-top"
          draggable={false}
        /> */}

                <TypewriterEffectSmoothDemo />
            </ContainerScroll>
        </div>
    );
}
const testimonials = [
    {
        quote: "It was the best of times when we shared food with those in need, and the worst of times when we wasted it. It was the age of wisdom to redistribute leftovers, and the age of foolishness to ignore hunger. It was a season of hope, turning despair into joy.",
        name: "Charles Dickens",
        title: "Inspired by A Tale of Two Cities",
    },
    {
        quote: "To give, or not to give, that is the question: Whether 'tis nobler to share our abundance with the hungry, or to let it go to waste. By taking action, we not only feed others but also nourish our souls.",
        name: "William Shakespeare",
        title: "Inspired by Hamlet",
    },
    {
        quote: "All that we cook or save can be a dream of sustenance for someone in need. A meal within a meal can spark hope within despair.",
        name: "Edgar Allan Poe",
        title: "Inspired by A Dream Within a Dream",
    },
    {
        quote: "It is a truth universally acknowledged that food left untouched is best shared with those in hunger, rather than wasted.",
        name: "Jane Austen",
        title: "Inspired by Pride and Prejudice",
    },
    {
        quote: "Call me a helper. Some days ago—never mind how long precisely—I saw leftovers that could feed many, and chose to bridge the gap between surplus and scarcity.",
        name: "Herman Melville",
        title: "Inspired by Moby-Dick",
    },
];
