import HeroHighlightDemo from "./components/HeroHighlightDemo";
import HeroScrollDemo from "./components/HeroScrollDemo";
import { WorldMapDemo } from "./components/WorldMapDemo";

export default function Home() {
  return (
    // <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] dark">
    <div className="dark">
      <HeroHighlightDemo />
      <WorldMapDemo />
      <HeroScrollDemo />
    </div>
  );
}
