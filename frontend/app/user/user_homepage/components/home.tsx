import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, Star as StarOutline } from "lucide-react"; // Ensure correct import
import { apiFetch } from "@/utils/api";
import { fetchCsrfToken } from "@/utils/csrf";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export function HomeSection() {
    const [stats, setStats] = useState({
        donorOrdersCount: 0,
        deliveredOrdersCount: 0,
        registeredDeliveryBoysCount: 0,
        rating: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast(); // Destructure the toast function from the hook
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
                await fetchCsrfToken();
                await fetchStats();
            } catch (error) {
                console.error("Error initializing home section:", error);
            }
        };

        init();
    }, []);

    const fetchStats = async () => {
        try {
            setIsLoading(true);
            let csrfToken = Cookies.get("XSRF-TOKEN");

            if (!csrfToken) {
                csrfToken = await fetchCsrfToken();
                if (!csrfToken) {
                    throw new Error("Failed to fetch CSRF token");
                }
            }

            const response = await fetch(
                "http://localhost:9500/user/getStats",
                {
                    credentials: "include",
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Server response:", response.status, errorText);

                if (response.status === 401) {
                    return;
                }

                throw new Error(
                    `Failed to fetch stats: ${response.status} ${errorText}`
                );
            }

            const data = await response.json();
            console.log("Stats received:", data);

            if (data.success && data.stats) {
                setStats(data.stats);
            } else {
                throw new Error(data.message || "Failed to fetch stats");
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to fetch stats",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <Star
                        key={index}
                        className="text-yellow-500 fill-current"
                    />
                ))}
                {halfStar && (
                    <StarHalf
                        key="half"
                        className="text-yellow-500 fill-current"
                    />
                )}
                {[...Array(emptyStars)].map((_, index) => (
                    <StarOutline
                        key={`empty-${index}`}
                        className="text-gray-400 fill-current"
                    />
                ))}
            </>
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome Home</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-6 border rounded-lg">
                    <CardHeader>
                        <CardTitle className="font-medium mb-2">
                            Donor Orders Count
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline">
                            {stats.donorOrdersCount}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="p-6 border rounded-lg">
                    <CardHeader>
                        <CardTitle className="font-medium mb-2">
                            Delivered Orders Count
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline">
                            {stats.deliveredOrdersCount}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="p-6 border rounded-lg">
                    <CardHeader>
                        <CardTitle className="font-medium mb-2">
                            Registered Delivery Boys
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge variant="outline">
                            {stats.registeredDeliveryBoysCount}
                        </Badge>
                    </CardContent>
                </Card>
                <Card className="p-6 border rounded-lg">
                    <CardHeader>
                        <CardTitle className="font-medium mb-2">
                            Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            {renderStars(stats.rating)}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
