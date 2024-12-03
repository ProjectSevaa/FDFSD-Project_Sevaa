"use client";

import { useRouter } from "next/navigation";
import {
  Calendar,
  Home,
  MessageSquare,
  FileText,
  Settings,
  LogOut,  // Using the LogOut icon for logout button
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
  const router = useRouter();  // useRouter for navigation

  const handleLogout = async () => {
    try {
      // Trigger the backend logout route (GET request for donor logout)
      const response = await fetch("http://localhost:9500/auth/d_logout", {
        method: "GET",  // Assuming the backend handles GET request for logout
        credentials: "include",  // Include credentials if needed
      });

      if (response.ok) {
        // Redirect to login page or homepage after successful logout
        router.push("/");  // Or any other route you want to redirect after logout
      } else {
        // Handle errors (if backend returns an error)
        console.error("Logout failed with status:", response.status);
        const errorMessage = await response.text();  // Get error details from the response
        console.error("Error details:", errorMessage);
      }
    } catch (error) {
      // Log error if the request fails
      console.error("Error during logout:", error);
    }
  };

  return (
    <Sidebar>
      <SidebarContent className="flex flex-col justify-between h-full">
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
                      <item.icon className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Button at the bottom */}
        <SidebarMenuItem>
          <SidebarMenuButton asChild onClick={handleLogout}>
            <button>
              <LogOut className="h-6 w-6 text-neutral-500 dark:text-neutral-300" />
              <span>Logout</span>
            </button>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarContent>
    </Sidebar>
  );
}
