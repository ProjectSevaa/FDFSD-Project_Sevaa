"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Post {
  _id: string;
  donorUsername: string;
  location: string;
  availableFood: string[];
  timestamp: string;
  isDealClosed: boolean;
}

export function SearchSection() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<"all" | "active" | "closed">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(
    new Set()
  );
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:9500/post/getAllPosts", {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      const posts = await response.json();
      setAllPosts(posts);
      setFilteredPosts(posts);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch posts. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendRequest = async (postId: string) => {
    if (pendingRequests.has(postId)) return;

    try {
      setPendingRequests((prev) => new Set(prev).add(postId));

      const response = await fetch("http://localhost:9500/user/sendRequest", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id: postId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send request");
      }

      const data = await response.json();

      // Update UI to show request was sent
      setAllPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, isDealClosed: true } : post
        )
      );

      toast({
        title: "Success",
        description: "Request sent successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to send request",
      });
    } finally {
      setPendingRequests((prev) => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const filterPosts = (criteria: "all" | "active" | "closed") => {
    setFilter(criteria);
    if (criteria === "active") {
      setFilteredPosts(allPosts.filter((post) => !post.isDealClosed));
    } else if (criteria === "closed") {
      setFilteredPosts(allPosts.filter((post) => post.isDealClosed));
    } else {
      setFilteredPosts(allPosts);
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
        <h2 className="text-2xl font-semibold">Available Donations</h2>
        <div className="space-x-2">
          <Button
            onClick={() => filterPosts("all")}
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
          >
            All Deals
          </Button>
          <Button
            onClick={() => filterPosts("active")}
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
          >
            Active Deals
          </Button>
          <Button
            onClick={() => filterPosts("closed")}
            variant={filter === "closed" ? "default" : "outline"}
            size="sm"
          >
            Closed Deals
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map((post) => (
          <Card key={post._id} className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{post.donorUsername || "Unknown Donor"}</span>
                <Badge variant={post.isDealClosed ? "secondary" : "default"}>
                  {post.isDealClosed ? "Deal Closed" : "Open"}
                </Badge>
              </CardTitle>
              <CardDescription>
                {post.location || "Location not specified"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Available Food
                </p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {post.availableFood.map((food, index) => (
                    <Badge key={index} variant="outline">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Posted {new Date(post.timestamp).toLocaleDateString()}
              </p>
            </CardContent>
            <CardFooter className="mt-auto">
              {post.isDealClosed ? (
                <span className="text-muted-foreground">Deal Closed</span>
              ) : (
                <Button
                  onClick={() => sendRequest(post._id)}
                  disabled={pendingRequests.has(post._id)}
                  className="w-fit"
                >
                  {pendingRequests.has(post._id) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    "Send Request"
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
