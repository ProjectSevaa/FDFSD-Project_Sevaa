"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Speedometer } from "@/components/speedometer";

export function HomeSection() {
    const [stats, setStats] = useState({
        donorOrdersCount: 0,
        deliveredOrdersCount: 0,
        registeredDeliveryBoysCount: 0,
        rating: 0,
    });
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            try {
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
            const response = await fetch("http://localhost:9500/user/stats", {
                credentials: "include",
            });

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
                    <Star key={`empty-${index}`} className="text-gray-400" />
                ))}
            </>
        );
    };

    // Define max values for each stat for the speedometers
    const maxValues = {
        donorOrdersCount: Math.max(
            stats.donorOrdersCount,
            stats.donorOrdersCount * 1.5
        ),
        deliveredOrdersCount: Math.max(
            stats.deliveredOrdersCount,
            stats.deliveredOrdersCount * 1.5
        ),
        registeredDeliveryBoysCount: Math.max(
            stats.registeredDeliveryBoysCount,
            stats.registeredDeliveryBoysCount * 1.5
        ),
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Donor Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Speedometer
                            value={stats.donorOrdersCount}
                            maxValue={maxValues.donorOrdersCount}
                            title=""
                            color="hsl(var(--primary))"
                            size="md"
                        />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Delivered Orders
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Speedometer
                            value={stats.deliveredOrdersCount}
                            maxValue={maxValues.deliveredOrdersCount}
                            title=""
                            color="hsl(var(--success))"
                            size="md"
                        />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Delivery Personnel
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Speedometer
                            value={stats.registeredDeliveryBoysCount}
                            maxValue={maxValues.registeredDeliveryBoysCount}
                            title=""
                            color="hsl(var(--secondary))"
                            size="md"
                        />
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">
                            Rating
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Speedometer
                            value={stats.rating}
                            maxValue={5}
                            title=""
                            color="hsl(var(--warning))"
                            size="md"
                            unit="★"
                        />
                        <div className="flex items-center justify-center mt-2">
                            {renderStars(stats.rating)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Additional stats in badge format */}
            <div className="grid gap-6 md:grid-cols-3 mt-6">
                <Card className="p-4 border">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Total Donor Orders</h3>
                        <Badge variant="outline" className="text-lg">
                            {stats.donorOrdersCount}
                        </Badge>
                    </div>
                </Card>

                <Card className="p-4 border">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Total Delivered</h3>
                        <Badge variant="outline" className="text-lg">
                            {stats.deliveredOrdersCount}
                        </Badge>
                    </div>
                </Card>

                <Card className="p-4 border">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">Delivery Personnel</h3>
                        <Badge variant="outline" className="text-lg">
                            {stats.registeredDeliveryBoysCount}
                        </Badge>
                    </div>
                </Card>
            </div>
        </div>
    );
}
