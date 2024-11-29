// app/user/components/app-sidebar.tsx
"use client";

import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  Package,
  UserRoundPlus,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSection } from "../../../context/SectionContext";
const items = [
  { title: "Home", url: "/user/user_homepage", icon: Home },
  { title: "Inbox", url: "/user/user_homepage", icon: Inbox },
  { title: "Calendar", url: "/user/user_homepage", icon: Calendar },
  { title: "Manage", url: "/user/user_homepage", icon: Package },
  { title: "Search", url: "/user/user_homepage", icon: Search },
  { title: "Recruit", url: "/user/user_homepage", icon: UserRoundPlus },
  { title: "Settings", url: "/user/user_homepage", icon: Settings },
];

export function AppSidebar() {
  const { setActiveSection } = useSection();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => setActiveSection(item.title)}
                  >
                    <button>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
