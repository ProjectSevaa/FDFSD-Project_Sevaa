"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Post {
    _id: string;
    availableFood: string[];
    location: string;
    timestamp: string;
    isDealClosed: boolean;
}

export function CalendarSection() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedDatePosts, setSelectedDatePosts] = useState<Post[]>([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        if (date && posts.length > 0) {
            const selectedDate = new Date(date);
            const filtered = posts.filter((post) => {
                const postDate = new Date(post.timestamp);
                return (
                    postDate.getDate() === selectedDate.getDate() &&
                    postDate.getMonth() === selectedDate.getMonth() &&
                    postDate.getFullYear() === selectedDate.getFullYear()
                );
            });
            setSelectedDatePosts(filtered);
        }
    }, [date, posts]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(
                "http://localhost:9500/donor/getDonorPosts",
                {
                    credentials: "include",
                }
            );
            if (response.ok) {
                const data = await response.json();
                setPosts(data);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    // Get dates with posts for highlighting in calendar
    const datesWithPosts = posts.map((post) => new Date(post.timestamp));

    return (
        <div className="p-6">
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5" />
                            Donation Calendar
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                            modifiers={{
                                hasPost: datesWithPosts,
                            }}
                            modifiersStyles={{
                                hasPost: {
                                    fontWeight: "bold",
                                    backgroundColor: "rgba(0, 128, 0, 0.1)",
                                },
                            }}
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Posts for{" "}
                            {date?.toLocaleDateString(undefined, {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] pr-4">
                            {selectedDatePosts.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">
                                    No posts for this date
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {selectedDatePosts.map((post) => (
                                        <Card
                                            key={post._id}
                                            className="p-4 transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm text-muted-foreground">
                                                    {new Date(
                                                        post.timestamp
                                                    ).toLocaleTimeString()}
                                                </span>
                                                <Badge
                                                    variant={
                                                        post.isDealClosed
                                                            ? "secondary"
                                                            : "success"
                                                    }
                                                >
                                                    {post.isDealClosed
                                                        ? "Closed"
                                                        : "Active"}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="font-medium mb-1">
                                                    Available Food:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {post.availableFood.map(
                                                        (food, index) => (
                                                            <Badge
                                                                key={index}
                                                                variant="outline"
                                                            >
                                                                {food}
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <p className="mt-2 text-sm">
                                                <span className="font-medium">
                                                    Location:
                                                </span>{" "}
                                                {post.location}
                                            </p>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
