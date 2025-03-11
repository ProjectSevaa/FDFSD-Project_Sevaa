"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, RefreshCw, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface Post {
    _id: string;
    availableFood: string[];
    location: string;
    timestamp: string;
    isDealClosed: boolean;
}

interface Request {
    _id: string;
    userUsername: string;
    location?: string;
    availableFood: string[];
    isAccepted: boolean;
    isRejected: boolean;
    post_id: string;
}

export function MyPostsSection() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [selectedPostRequests, setSelectedPostRequests] = useState<Request[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRequests, setIsLoadingRequests] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const donorToken = Cookies.get("donor_jwt");
            if (!donorToken) {
            }
            return true;
        };

        const init = async () => {
            if (checkAuth()) {
                await fetchPosts();
            }
        };

        init();
    }, [router, toast]);

    const fetchPosts = async () => {
        try {
            setIsLoading(true);

            // Get CSRF token if needed
            let csrfToken = Cookies.get("XSRF-TOKEN");
            if (!csrfToken) {
                const response = await fetch(
                    "http://localhost:9500/csrf-token",
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                csrfToken = data.csrfToken;
                Cookies.set("XSRF-TOKEN", csrfToken);
            }

            const response = await fetch(
                "http://localhost:9500/donor/getDonorPosts",
                {
                    credentials: "include",
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch posts");
            }

            const data = await response.json();
            setPosts(data);
        } catch (err) {
            console.error("Error fetching posts:", err);
            toast({
                title: "Error",
                description: "Failed to fetch posts. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRequests = async (postId: string) => {
        try {
            setIsLoadingRequests(true);

            // Get CSRF token if needed
            let csrfToken = Cookies.get("XSRF-TOKEN");
            if (!csrfToken) {
                const response = await fetch(
                    "http://localhost:9500/csrf-token",
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                csrfToken = data.csrfToken;
                Cookies.set("XSRF-TOKEN", csrfToken);
            }

            const response = await fetch(
                `http://localhost:9500/request/getRequestsForPost?postId=${postId}`,
                {
                    credentials: "include",
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch requests");
            }

            const data = await response.json();
            setSelectedPostRequests(data.requests);
            setIsDialogOpen(true);
        } catch (err) {
            console.error("Error fetching requests:", err);
            toast({
                title: "Error",
                description: "Failed to fetch requests. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoadingRequests(false);
        }
    };

    const acceptRequest = async (requestId: string) => {
        try {
            // Get CSRF token if needed
            let csrfToken = Cookies.get("XSRF-TOKEN");
            if (!csrfToken) {
                const response = await fetch(
                    "http://localhost:9500/csrf-token",
                    {
                        credentials: "include",
                    }
                );
                const data = await response.json();
                csrfToken = data.csrfToken;
                Cookies.set("XSRF-TOKEN", csrfToken);
            }

            const response = await fetch(
                `http://localhost:9500/request/acceptRequest/${requestId}`,
                {
                    method: "PATCH",
                    credentials: "include",
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to accept request");
            }

            const updatedRequest = await response.json();
            toast({
                title: "Success",
                description: `Request accepted: ${updatedRequest._id}`,
            });

            // Update the local state to reflect the changes
            setSelectedPostRequests((prevRequests) =>
                prevRequests.map((req) =>
                    req._id === requestId
                        ? { ...req, isAccepted: true }
                        : { ...req, isRejected: true }
                )
            );

            // Update the posts to reflect the closed deal
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === updatedRequest.post_id
                        ? { ...post, isDealClosed: true }
                        : post
                )
            );
        } catch (err) {
            console.error("Error accepting request:", err);
            toast({
                title: "Error",
                description: "Failed to accept request. Please try again.",
                variant: "destructive",
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">My Posts</h2>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={fetchPosts}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Refresh posts</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <Card
                        key={post._id}
                        className="transition-shadow hover:shadow-lg"
                    >
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span className="text-sm">
                                    Posted on{" "}
                                    {new Date(post.timestamp).toLocaleString()}
                                </span>
                                <Badge
                                    variant={
                                        post.isDealClosed
                                            ? "secondary"
                                            : "success"
                                    }
                                    className={
                                        post.isDealClosed
                                            ? "bg-gray-500"
                                            : "bg-green-500"
                                    }
                                >
                                    {post.isDealClosed ? "Closed" : "Active"}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="font-medium mb-2">
                                    Available Food:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {post.availableFood.map((food, index) => (
                                        <Badge key={index} variant="outline">
                                            {food}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <p>
                                <span className="font-medium">Location:</span>{" "}
                                {post.location}
                            </p>
                            <Button
                                onClick={() => fetchRequests(post._id)}
                                disabled={isLoadingRequests}
                                size="sm"
                                className="w-full"
                                variant={
                                    post.isDealClosed ? "secondary" : "default"
                                }
                            >
                                {isLoadingRequests ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading Requests...
                                    </>
                                ) : (
                                    <>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Requests
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Requests for Post</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="max-h-[60vh]">
                        {selectedPostRequests.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">
                                No requests available for this post.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {selectedPostRequests.map((request) => (
                                    <Card
                                        key={request._id}
                                        className="transition-shadow hover:shadow-md"
                                    >
                                        <CardContent className="pt-6 space-y-2">
                                            <p>
                                                <span className="font-medium">
                                                    User:
                                                </span>{" "}
                                                {request.userUsername}
                                            </p>
                                            <p>
                                                <span className="font-medium">
                                                    Location:
                                                </span>{" "}
                                                {request.location ||
                                                    "Not provided"}
                                            </p>
                                            <div>
                                                <span className="font-medium">
                                                    Available Food:
                                                </span>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    {request.availableFood.map(
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
                                            <div className="flex justify-between items-center mt-4">
                                                <Badge
                                                    variant={
                                                        request.isAccepted
                                                            ? "success"
                                                            : request.isRejected
                                                            ? "destructive"
                                                            : "default"
                                                    }
                                                >
                                                    {request.isAccepted
                                                        ? "Accepted"
                                                        : request.isRejected
                                                        ? "Rejected"
                                                        : "Pending"}
                                                </Badge>
                                                {!request.isAccepted &&
                                                    !request.isRejected && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() =>
                                                                acceptRequest(
                                                                    request._id
                                                                )
                                                            }
                                                        >
                                                            Accept Request
                                                        </Button>
                                                    )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    );
}
