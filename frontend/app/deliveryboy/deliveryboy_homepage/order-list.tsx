import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface Order {
    _id: string;
    status: string;
    donorUsername: string;
    userUsername: string;
    pickupLocation: string;
    deliveryLocation: string;
    timestamp: string;
}

interface OrderListProps {
    orders: Order[];
    updateOrderStatus: (
        orderId: string,
        status: "picked-up" | "delivered",
        imageFile?: File
    ) => Promise<void>;
    handleOrderDelivered?: (order: Order) => void;
    type: "ongoing" | "delivered";
}

export function OrderList({
    orders,
    updateOrderStatus,
    handleOrderDelivered,
    type,
}: OrderListProps) {
    const { toast } = useToast();

    const handleStatusUpdate = async (
        orderId: string,
        status: "picked-up" | "delivered"
    ) => {
        if (!orderId || typeof orderId !== "string") {
            console.error("Invalid orderId:", orderId);
            toast({
                title: "Error",
                description: "Invalid order ID",
                variant: "destructive",
            });
            return;
        }

        try {
            console.log("Updating order status:", {
                orderId,
                status,
                orderIdType: typeof orderId,
                orderIdLength: orderId.length,
            }); // Enhanced debug log
            await updateOrderStatus(orderId, status);
            toast({
                title: "Success",
                description: `Order ${
                    status === "picked-up" ? "picked up" : "delivered"
                } successfully`,
            });
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Failed to update order status";

            console.error("Error updating order status:", error);
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    if (!Array.isArray(orders)) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500">Error loading orders</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-gray-500">No {type} orders found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => {
                // Ensure order._id exists and is valid
                if (!order || !order._id) {
                    console.error("Invalid order object:", order);
                    return null;
                }

                return (
                    <Card key={order._id}>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span className="text-sm truncate">
                                    Order: {order._id}
                                </span>
                                <Badge
                                    variant={
                                        order.status === "on-going"
                                            ? "destructive"
                                            : order.status === "picked-up"
                                            ? "warning"
                                            : "success"
                                    }
                                >
                                    {order.status}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <p>
                                    <strong>Donor:</strong>{" "}
                                    {order.donorUsername}
                                </p>
                                <p>
                                    <strong>User:</strong> {order.userUsername}
                                </p>
                                <p>
                                    <strong>Pickup:</strong>{" "}
                                    {order.pickupLocation}
                                </p>
                                <p>
                                    <strong>Delivery:</strong>{" "}
                                    {order.deliveryLocation}
                                </p>
                                <p>
                                    <strong>Time:</strong>{" "}
                                    {new Date(order.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                        {type === "ongoing" && (
                            <CardFooter className="justify-end space-x-2">
                                {order.status === "on-going" && (
                                    <Button
                                        onClick={() => {
                                            console.log(
                                                "Clicking pick-up for order:",
                                                {
                                                    orderId: order._id,
                                                    orderType: typeof order._id,
                                                    fullOrder: order,
                                                }
                                            ); // Enhanced debug log
                                            handleStatusUpdate(
                                                order._id,
                                                "picked-up"
                                            );
                                        }}
                                        variant="secondary"
                                    >
                                        Mark as Picked-Up
                                    </Button>
                                )}
                                {order.status === "picked-up" &&
                                    handleOrderDelivered && (
                                        <Button
                                            onClick={() => {
                                                console.log(
                                                    "Clicking deliver for order:",
                                                    order._id
                                                ); // Debug log
                                                handleOrderDelivered(order);
                                            }}
                                        >
                                            Mark as Delivered
                                        </Button>
                                    )}
                            </CardFooter>
                        )}
                    </Card>
                );
            })}
        </div>
    );
}
