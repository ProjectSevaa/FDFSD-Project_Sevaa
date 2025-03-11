"use client";

import { HomeSection } from "./components/home";
import { RequestsSection } from "./components/requests";
import { MyPostsSection } from "./components/my-posts";
import { CalendarSection } from "./components/calendar";
import { SettingsSection } from "./components/settings";
import { useSection } from "../../../context/SectionContext";
import { useUser } from "../../../context/UserContext";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { fetchCsrfToken } from "@/utils/csrf";

export default function DonorHomepage() {
    const { activeSection } = useSection();
    const { email } = useUser();
    const { toast } = useToast();

    useEffect(() => {
        const init = async () => {
            try {
                await fetchCsrfToken();
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to fetch CSRF token.",
                    variant: "destructive",
                });
            }
        };

        init();
    }, [toast]);

    const renderSection = () => {
        switch (activeSection) {
            case "Home":
                return <HomeSection />;
            case "Calendar":
                return <CalendarSection />;
            case "Requests":
                return <RequestsSection />;
            case "My Posts":
                return <MyPostsSection />;
            case "Settings":
                return <SettingsSection />;
            default:
                return <HomeSection />;
        }
    };

    return <div className="w-full h-full">{renderSection()}</div>;
}
