"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/constants";

interface DeliveryBoy {
    _id: string;
    deliveryBoyName: string;
    status?: string;
    deliveredOrders?: number;
    mobileNumber: string;
    currentLocation?: {
        coordinates: [number, number];
    };
}

export function AddDeliveryBoySection() {
    const [deliveryBoys, setDeliveryBoys] = useState<DeliveryBoy[]>([]);
    const [newDeliveryBoyName, setNewDeliveryBoyName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        fetchDeliveryBoys();
    }, []);

    const fetchDeliveryBoys = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `${BASE_URL}/deliveryboy/getAllDeliveryBoys`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Failed to fetch delivery boys");
            }

            const data = await response.json();
            console.log("Received delivery boys data:", data);

            if (Array.isArray(data.deliveryBoys)) {
                setDeliveryBoys(data.deliveryBoys);
            } else {
                console.error("Unexpected data format:", data);
                setDeliveryBoys([]);
            }
        } catch (error) {
            console.error("Error fetching delivery boys:", error);
            toast({
                title: "Error",
                description: "Failed to fetch delivery boys",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDeliveryBoy = async (deliveryBoy: DeliveryBoy) => {
        try {
            const response = await fetch(
                `${BASE_URL}/deliveryboy/addDeliveryBoyToUser`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        deliveryBoyId: deliveryBoy._id,
                        deliveryBoyName: deliveryBoy.deliveryBoyName,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                // Handle specific error cases
                if (
                    response.status === 400 &&
                    data.message.includes("already added")
                ) {
                    toast({
                        title: "Already Added",
                        description:
                            "This delivery boy is already assigned to you",
                        variant: "default",
                    });
                    return;
                }
                throw new Error(
                    `Failed to add delivery boy: ${
                        response.status
                    } ${JSON.stringify(data)}`
                );
            }

            toast({
                title: "Success",
                description: "Delivery boy added successfully",
            });

            // Refresh the delivery boys list
            fetchDeliveryBoys();
        } catch (error) {
            console.error("Error adding delivery boy:", error);
            toast({
                title: "Error",
                description:
                    error instanceof Error
                        ? error.message
                        : "Failed to add delivery boy",
                variant: "destructive",
            });
        }
    };

    const handleAddNewDeliveryBoy = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newDeliveryBoyName.trim()) {
            await handleAddDeliveryBoy(
                deliveryBoys.find(
                    (boy) => boy.deliveryBoyName === newDeliveryBoyName
                ) || ({} as DeliveryBoy)
            );
            setNewDeliveryBoyName("");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
                Manage Delivery Boys
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-2 md:col-span-1">
                    <CardHeader>
                        <CardTitle>Available Delivery Boys</CardTitle>
                        <CardDescription>
                            Click to add a delivery boy to your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin" />
                            </div>
                        ) : (
                            <ScrollArea className="h-[400px] pr-4">
                                {deliveryBoys.length > 0 ? (
                                    deliveryBoys.map((boy) => (
                                        <Card key={boy._id} className="mb-4">
                                            <CardContent className="flex justify-between items-center p-4">
                                                <div>
                                                    <p className="font-semibold">
                                                        {boy.deliveryBoyName}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Status:{" "}
                                                        {boy.status ||
                                                            "Available"}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Delivered Orders:{" "}
                                                        {boy.deliveredOrders ||
                                                            0}
                                                    </p>
                                                </div>
                                                <Button
                                                    onClick={() =>
                                                        handleAddDeliveryBoy(
                                                            boy
                                                        )
                                                    }
                                                    disabled={isAdding}
                                                >
                                                    {isAdding ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Plus className="h-4 w-4" />
                                                    )}
                                                    Add
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))
                                ) : (
                                    <p className="text-center text-muted-foreground">
                                        No delivery boys available.
                                    </p>
                                )}
                            </ScrollArea>
                        )}
                    </CardContent>
                </Card>
                <Card className="col-span-2 md:col-span-1">
                    <CardHeader>
                        <CardTitle>Add New Delivery Boy</CardTitle>
                        <CardDescription>
                            Create a new delivery boy account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={handleAddNewDeliveryBoy}
                            className="space-y-4"
                        >
                            <div className="space-y-2">
                                <label
                                    htmlFor="delivery-boy-name"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    Delivery Boy Name
                                </label>
                                <Input
                                    id="delivery-boy-name"
                                    placeholder="Enter delivery boy's name"
                                    value={newDeliveryBoyName}
                                    onChange={(e) =>
                                        setNewDeliveryBoyName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isAdding}
                            >
                                {isAdding ? (
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                    <UserPlus className="h-4 w-4 mr-2" />
                                )}
                                Add Delivery Boy
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
