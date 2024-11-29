// app/user/layout.tsx
"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { SectionProvider, useSection } from "../../context/SectionContext";

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { activeSection } = useSection();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex-1">
          <div className="flex items-center h-14 px-4 border-b border-border">
            <SidebarTrigger className="mr-2" />
            <h1 className="text-xl font-semibold">{activeSection}</h1>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SectionProvider>
      <LayoutContent>{children}</LayoutContent>
    </SectionProvider>
  );
}
