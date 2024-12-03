// components/TypewriterEffectSmoothDemo.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { DrawerDemo } from "./DrawerDemo"; // Import the DrawerDemo component

export default function TypewriterEffectSmoothDemo() {
  const words = [
    { text: "Build" },
    { text: "awesome" },
    { text: "apps" },
    { text: "with" },
    { text: "Aceternity.", className: "text-blue-500 dark:text-blue-500" }
  ];

  const [drawerType, setDrawerType] = React.useState<string | null>(null); // Manage which drawer to open
  const [openDrawer, setOpenDrawer] = React.useState(false); // Manage drawer visibility

  const handleDrawerOpen = (type: string) => {
    setDrawerType(type);  // Set the drawer type based on the button clicked
    setOpenDrawer(false);  // Close the drawer before opening it again
    setTimeout(() => {
      setOpenDrawer(true); // Open the drawer after a slight delay
    }, 0);  // This ensures the drawer resets and opens correctly
  };

  return (
    <div className="flex flex-col items-center justify-center h-[35rem]">
      <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base">
        The road to freedom starts from here
      </p>
      <TypewriterEffectSmooth words={words} />

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
        <Button onClick={() => handleDrawerOpen("user")} className="w-40 h-10 rounded-xl bg-black text-white">
          User
        </Button>
        <Button onClick={() => handleDrawerOpen("donor")} className="w-40 h-10 rounded-xl bg-black text-white">
          Donor
        </Button>
        <Button onClick={() => handleDrawerOpen("deliveryBoy")} className="w-40 h-10 rounded-xl bg-black text-white">
          Delivery Boy
        </Button>
      </div>

      {/* Conditional Drawer Rendering */}
      {openDrawer && drawerType && <DrawerDemo drawerType={drawerType} />}
    </div>
  );
}
