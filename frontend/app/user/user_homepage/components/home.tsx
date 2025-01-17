import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf, Star as StarOutline } from "lucide-react"; // Ensure correct import

export function HomeSection() {
  const [stats, setStats] = useState({
    donorOrdersCount: 0,
    deliveredOrdersCount: 0,
    registeredDeliveryBoysCount: 0,
    rating: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:9500/user/stats", {
          method: "GET",
          credentials: "include", // Include cookies in the request
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
        } else {
          console.error("Failed to fetch stats");
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    }

    fetchStats();
  }, []);

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={index} className="text-yellow-500 fill-current" />
        ))}
        {halfStar && <StarHalf key="half" className="text-yellow-500 fill-current" />}
        {[...Array(emptyStars)].map((_, index) => (
          <StarOutline key={`empty-${index}`} className="text-gray-400 fill-current" />
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
            <CardTitle className="font-medium mb-2">Donor Orders Count</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{stats.donorOrdersCount}</Badge>
          </CardContent>
        </Card>
        <Card className="p-6 border rounded-lg">
          <CardHeader>
            <CardTitle className="font-medium mb-2">Delivered Orders Count</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{stats.deliveredOrdersCount}</Badge>
          </CardContent>
        </Card>
        <Card className="p-6 border rounded-lg">
          <CardHeader>
            <CardTitle className="font-medium mb-2">Registered Delivery Boys</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline">{stats.registeredDeliveryBoysCount}</Badge>
          </CardContent>
        </Card>
        <Card className="p-6 border rounded-lg">
          <CardHeader>
            <CardTitle className="font-medium mb-2">Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">{renderStars(stats.rating)}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
