"use client";

import { useEffect, useState } from "react";
import { fetchCsrfToken } from "../utils/csrf";
import { useToast } from "@/hooks/use-toast";

export function CsrfErrorHandler() {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const refreshCsrfToken = async () => {
            setIsRefreshing(true);
            try {
                await fetchCsrfToken();
                toast({
                    title: "CSRF Token Refreshed",
                    description: "Your session has been refreshed.",
                    variant: "default",
                });
            } catch (error) {
                toast({
                    title: "Session Error",
                    description:
                        "Failed to refresh your session. Please reload the page.",
                    variant: "destructive",
                });
            } finally {
                setIsRefreshing(false);
            }
        };

        // Listen for CSRF errors
        const handleCsrfError = (event: CustomEvent) => {
            refreshCsrfToken();
        };

        window.addEventListener("csrf-error" as any, handleCsrfError);

        return () => {
            window.removeEventListener("csrf-error" as any, handleCsrfError);
        };
    }, [toast]);

    return null; // This component doesn't render anything
}
