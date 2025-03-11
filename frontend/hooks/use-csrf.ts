"use client";

import { useEffect, useState } from "react";
import { fetchCsrfToken, getCsrfToken } from "@/utils/csrf";
import { useToast } from "@/hooks/use-toast";

export function useCsrf() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const init = async () => {
            try {
                setIsLoading(true);
                await fetchCsrfToken();
                setError(null);
            } catch (err) {
                setError("Failed to fetch CSRF token");
                toast({
                    title: "Error",
                    description:
                        "Failed to fetch CSRF token. Please refresh the page.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        init();
    }, [toast]);

    const refreshToken = async () => {
        try {
            setIsLoading(true);
            await fetchCsrfToken();
            setError(null);
            return true;
        } catch (err) {
            setError("Failed to refresh CSRF token");
            toast({
                title: "Error",
                description:
                    "Failed to refresh CSRF token. Please refresh the page.",
                variant: "destructive",
            });
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, error, refreshToken };
}
