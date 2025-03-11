"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
    const [hasError, setHasError] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const errorHandler = (error: ErrorEvent) => {
            console.error("Caught error:", error);
            setHasError(true);
            setError(error.error || new Error("Unknown error occurred"));
        };

        window.addEventListener("error", errorHandler);
        return () => window.removeEventListener("error", errorHandler);
    }, []);

    if (hasError) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">
                    Something went wrong
                </h2>
                <p className="mb-6 text-gray-600">
                    {error?.message || "An unexpected error occurred"}
                </p>
                <Button onClick={() => window.location.reload()}>
                    Refresh the page
                </Button>
            </div>
        );
    }

    return <>{children}</>;
}
