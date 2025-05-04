import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@/context/UserContext"; // Import the useUser hook
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, Star as StarOutline } from "lucide-react"; // Ensure correct import

export function HomeSection() {
    const [stats, setStats] = useState({ donationsCount: 0, rating: 0 });
    const { email } = useUser(); // Get donor ID from UserContext

    useEffect(() => {
        if (email) {
            const fetchStats = async () => {
                try {
                    const response = await axios.get(
                        `http://localhost:9500/donor/donorStats/${email}`
                    );
                    setStats(response.data.stats);
                } catch (error) {
                    console.error("Error fetching donor stats:", error);
                }
            };

            fetchStats();
        }
    }, [email]);

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
                            Quick Stats
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                                <span>Donations Count:</span>
                                <Badge variant="outline">
                                    {stats.donationsCount}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Rating:</span>
                                <div className="flex items-center">
                                    {renderStars(stats.rating)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="p-6 border rounded-lg">
                    <CardHeader>
                        <CardTitle className="font-medium mb-2">
                            Recent Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>{/* Add content */}</CardContent>
                </Card>
                <Card className="p-6 border rounded-lg">
                    <CardHeader>
                        <CardTitle className="font-medium mb-2">
                            Notifications
                        </CardTitle>
                    </CardHeader>
                    <CardContent>{/* Add content */}</CardContent>
                </Card>
            </div>
        </div>
    );
}
