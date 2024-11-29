"use client";

import { useState, useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Search, User } from "lucide-react";

interface Request {
  _id: string;
  donorUsername: string;
  availableFood: string[];
  timestamp: string;
  location?: string;
  isAccepted: boolean;
  isRejected: boolean;
}

interface Donor {
  username: string;
  requests: Request[];
}

export function InboxSection() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDonors = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        "http://localhost:9500/request/getAllDonors",
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        } else {
          throw new Error("Server returned an invalid response");
        }
      }

      const data = await response.json();
      if (data.success) {
        setDonors(data.donors);
      } else {
        throw new Error(data.message || "Failed to fetch donors");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching donors");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRequests = async (donorUsername: string) => {
    try {
      setIsLoadingRequests(true);
      setError(null);
      const response = await fetch(
        `http://localhost:9500/request/getRequests?donor=${donorUsername}`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        if (
          response.headers.get("content-type")?.includes("application/json")
        ) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        } else {
          throw new Error("Server returned an invalid response");
        }
      }

      const data = await response.json();
      setDonors((prevDonors) =>
        prevDonors.map((donor) =>
          donor.username === donorUsername
            ? { ...donor, requests: data.requests }
            : donor
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching requests");
    } finally {
      setIsLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchDonors();
  }, []);

  const handleDonorClick = async (donorUsername: string) => {
    setSelectedDonor(donorUsername);
    await fetchRequests(donorUsername);
  };

  const filteredDonors = donors.filter((donor) =>
    donor.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedDonorRequests = selectedDonor
    ? donors.find((donor) => donor.username === selectedDonor)?.requests || []
    : [];

  if (error) {
    return (
      <div className="p-4 text-red-500 flex items-center justify-center">
        <div className="text-center">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <Button onClick={fetchDonors} variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[calc(100vh-4rem)] rounded-lg border"
    >
      <ResizablePanel defaultSize={22} minSize={20}>
        <div className="flex h-full flex-col">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search donors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8"
                disabled={isLoading}
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading donors...
              </div>
            ) : filteredDonors.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No donors found
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredDonors.map((donor) => (
                  <Button
                    key={donor.username}
                    variant={
                      selectedDonor === donor.username ? "secondary" : "ghost"
                    }
                    className="w-full justify-between px-2"
                    onClick={() => handleDonorClick(donor.username)}
                    disabled={isLoadingRequests}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {donor.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{donor.username}</span>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {donor.requests.length} requests
                    </Badge>
                  </Button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={75}>
        <ScrollArea className="h-full">
          {selectedDonor ? (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {selectedDonor.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedDonor}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedDonorRequests.length} total requests
                    </p>
                  </div>
                </div>
                {isLoadingRequests && (
                  <Badge variant="outline">Loading requests...</Badge>
                )}
              </div>
              {selectedDonorRequests.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No requests found for this donor</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDonorRequests.map((request) => (
                    <Card key={request._id}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              {new Date(request.timestamp).toLocaleDateString()}
                            </Badge>
                            <Badge
                              variant={
                                request.isAccepted
                                  ? "default"
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
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Available Food
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {request.availableFood.map((food, index) => (
                              <Badge key={index} variant="secondary">
                                {food}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        {request.location && (
                          <>
                            <Separator />
                            <div>
                              <div className="text-sm font-medium text-muted-foreground mb-1">
                                Location
                              </div>
                              <p>{request.location}</p>
                            </div>
                          </>
                        )}
                        <Separator />
                        <div>
                          <div className="text-sm font-medium text-muted-foreground mb-1">
                            Status
                          </div>
                          <p>
                            {request.isRejected
                              ? "Your request has been rejected"
                              : request.isAccepted
                              ? "You've got a Deal!"
                              : "Pending request, waiting to be accepted by donor"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground flex-col gap-2">
              <User className="h-12 w-12 opacity-50" />
              <p>Select a donor to view their requests</p>
            </div>
          )}
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
