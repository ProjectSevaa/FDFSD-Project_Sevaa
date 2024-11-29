"use client";

import {
  Calendar,
  Home,
  MessageSquare,
  FileText,
  Settings,
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
  { title: "Calendar", url: "/user/user_homepage", icon: Calendar },
  { title: "Requests", url: "/user/user_homepage", icon: MessageSquare },
  { title: "My Posts", url: "/user/user_homepage", icon: FileText },
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
