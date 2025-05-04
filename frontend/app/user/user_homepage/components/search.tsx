"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { Badge } from "@/components/ui/badge";
import { BASE_URL } from "@/constants";

interface Post {
    _id: string;
    donorUsername: string;
    availableFood: string[];
    location: string;
    timestamp: string;
    isDealClosed?: boolean;
}

export function SearchSection() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [pendingRequests, setPendingRequests] = useState<Set<string>>(
        new Set()
    );
    const { toast } = useToast();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`${BASE_URL}/post/getAllPosts`, {
                    method: "GET",
                    credentials: "include",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch posts");
                }

                const data = await response.json();
                if (data.success && Array.isArray(data.posts)) {
                    setPosts(data.posts);
                } else {
                    throw new Error("Invalid data format received");
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                toast({
                    title: "Error",
                    description: "Failed to fetch posts. Please try again.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [toast]);

    const filteredPosts = posts.filter(
        (post) =>
            post.availableFood.some((food) =>
                food.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            post.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.donorUsername.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRequest = async (postId: string) => {
        if (pendingRequests.has(postId)) return;

        try {
            setPendingRequests((prev) => new Set(prev).add(postId));

            const response = await fetch(`${BASE_URL}/user/sendRequest`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ post_id: postId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message || "Failed to create request"
                );
            }

            const result = await response.json();
            toast({
                title: "Success",
                description: "Request sent successfully",
            });

            // Mark post as requested in UI
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? { ...post, isDealClosed: true } : post
                )
            );
        } catch (error) {
            console.error("Error creating request:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to send request",
                variant: "destructive",
            });
        } finally {
            setPendingRequests((prev) => {
                const newSet = new Set(prev);
                newSet.delete(postId);
                return newSet;
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Search Available Food</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="mb-6">
                        <Input
                            placeholder="Search by food, location, or donor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[calc(100vh-16rem)]">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPosts.length > 0 ? (
                                filteredPosts.map((post) => (
                                    <Card
                                        key={post._id}
                                        className="flex flex-col"
                                    >
                                        <CardHeader className="pb-2">
                                            <CardTitle className="flex justify-between items-center text-lg">
                                                <span>
                                                    {post.donorUsername}
                                                </span>
                                                <Badge
                                                    variant={
                                                        post.isDealClosed
                                                            ? "secondary"
                                                            : "default"
                                                    }
                                                >
                                                    {post.isDealClosed
                                                        ? "Requested"
                                                        : "Available"}
                                                </Badge>
                                            </CardTitle>
                                            <CardDescription>
                                                <span className="flex items-center">
                                                    <MapPin className="h-4 w-4 mr-1" />
                                                    {post.location}
                                                </span>
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground mb-2">
                                                    Available Food
                                                </p>
                                                <div className="flex flex-wrap gap-2">
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
                                            <div className="flex items-center mt-4 text-sm text-muted-foreground">
                                                <Calendar className="h-4 w-4 mr-1" />
                                                {new Date(
                                                    post.timestamp
                                                ).toLocaleString()}
                                            </div>
                                        </CardContent>
                                        <CardFooter className="mt-auto">
                                            {post.isDealClosed ? (
                                                <span className="text-muted-foreground">
                                                    Already Requested
                                                </span>
                                            ) : (
                                                <Button
                                                    onClick={() =>
                                                        handleRequest(post._id)
                                                    }
                                                    disabled={pendingRequests.has(
                                                        post._id
                                                    )}
                                                >
                                                    {pendingRequests.has(
                                                        post._id
                                                    ) ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                            Requesting...
                                                        </>
                                                    ) : (
                                                        "Request Food"
                                                    )}
                                                </Button>
                                            )}
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground col-span-3">
                                    No posts found matching your search.
                                </p>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
