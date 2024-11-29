"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type SectionContextType = {
  activeSection: string;
  setActiveSection: (section: string) => void;
};

const SectionContext = createContext<SectionContextType>({
  activeSection: "Home",
  setActiveSection: () => {},
});

export function SectionProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState("Home");

  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  );
}

export const useSection = () => useContext(SectionContext);
