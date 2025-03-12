"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { OrderList } from "./order-list";
import { StatusToggle } from "./status-toggle";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

interface Order {
    _id: string;
    status: string;
    donorUsername: string;
    userUsername: string;
    pickupLocation: string;
    deliveryLocation: string;
    timestamp: string;
}

interface DeliveryBoy {
    _id: string;
    deliveryBoyName: string;
    status: string;
    deliveredOrders: number;
}

export default function DeliveryBoyHomepage() {
    const [deliveryBoy, setDeliveryBoy] = useState<DeliveryBoy | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [activeTab, setActiveTab] = useState("ongoing");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
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
                "http://localhost:9500/deliveryboy/getDeliveryBoyDashboard",
                {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "X-CSRF-Token": csrfToken,
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setDeliveryBoy(data.deliveryboy);
            setOrders(data.orders);
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            toast({
                title: "Error",
                description: "Failed to fetch dashboard data",
                variant: "destructive",
            });
        }
    };

    const updateOrderStatus = async (orderId: string, status: "picked-up" | "delivered", imageFile?: File) => {
        try {
            if (!orderId || typeof orderId !== 'string') {
                console.error('Invalid orderId:', orderId);
                throw new Error("Valid Order ID is required");
            }

            // Get CSRF token
            let csrfToken = Cookies.get("XSRF-TOKEN");
            if (!csrfToken) {
                const response = await fetch("http://localhost:9500/csrf-token", {
                    credentials: "include",
                });
                const data = await response.json();
                csrfToken = data.csrfToken;
                Cookies.set("XSRF-TOKEN", csrfToken);
            }

            if (status === "delivered" && !imageFile) {
                throw new Error("Image is required for delivery confirmation");
            }

            const endpoint = status === "picked-up" ? "setOrderPickedUp" : "setOrderDelivered";
            
            let requestBody: FormData | URLSearchParams;
            let headers: HeadersInit = {
                "X-CSRF-Token": csrfToken,
            };

            if (status === "picked-up") {
                // For picked-up status, use JSON content type
                headers["Content-Type"] = "application/json";
                requestBody = JSON.stringify({ orderId });
            } else {
                // For delivered status, use multipart form data
                // Don't set Content-Type header for FormData
                delete headers["Content-Type"];
                const formData = new FormData();
                formData.append("orderId", orderId);
                if (imageFile) {
                    formData.append("image", imageFile);
                }
                requestBody = formData;
            }

            console.log('Sending request:', {
                endpoint,
                orderId,
                status,
                headers,
                requestBody: status === "picked-up" ? JSON.parse(requestBody as string) : Object.fromEntries((requestBody as FormData).entries())
            });

            const response = await fetch(`http://localhost:9500/order/${endpoint}`, {
                method: "POST",
                headers,
                credentials: "include",
                body: requestBody,
            });

            const data = await response.json();
            console.log('Response:', data); // Debug log

            if (!response.ok) {
                throw new Error(data.message || "Failed to update order status");
            }

            // Refresh the orders list
            await fetchDashboardData();
            return data;

        } catch (error: any) {
            console.error("Error updating order status:", error);
            throw new Error(error.message || "Failed to update order status");
        }
    };

    const handleOrderDelivered = (order: Order) => {
        if (!order._id || typeof order._id !== 'string') {
            console.error('Invalid order:', order);
            toast({
                title: "Error",
                description: "Invalid order ID",
                variant: "destructive",
            });
            return;
        }
        setSelectedOrder(order);
    };

    const handleImageUpload = async (event: React.FormEvent) => {
        event.preventDefault();
        
        if (!selectedOrder || !selectedOrder._id || typeof selectedOrder._id !== 'string') {
            console.error('Invalid selected order:', selectedOrder);
            toast({
                title: "Error",
                description: "Invalid order selection",
                variant: "destructive",
            });
            return;
        }

        if (!imageFile) {
            toast({
                title: "Error",
                description: "Please select an image to upload",
                variant: "destructive",
            });
            return;
        }

        try {
            // Show loading state
            toast({
                title: "Uploading",
                description: "Uploading image and marking order as delivered...",
            });

            console.log('Uploading image for order:', selectedOrder._id); // Debug log
            await updateOrderStatus(selectedOrder._id, "delivered", imageFile);
            
            setSelectedOrder(null);
            setImageFile(null);
            
            toast({
                title: "Success",
                description: "Order marked as delivered successfully",
            });
            
            await fetchDashboardData(); // Refresh the orders list
        } catch (error: any) {
            console.error('Image upload error:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to mark order as delivered",
                variant: "destructive",
            });
        }
    };

    const handleLogout = () => {
        Cookies.remove("deliveryboy_jwt");
        Cookies.remove("XSRF-TOKEN");
        router.push("/");
    };

    if (!deliveryBoy) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Welcome, {deliveryBoy.deliveryBoyName}
                    </CardTitle>
                    <CardDescription>
                        Manage your deliveries and status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StatusToggle
                        deliveryBoy={deliveryBoy}
                        onStatusChange={fetchDashboardData}
                    />

                    {/* Add stats */}
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold">Your Stats</h3>
                        <p>
                            <strong>Delivered Orders:</strong>{" "}
                            {deliveryBoy.deliveredOrders}
                        </p>
                    </div>

                    <Tabs
                        value={activeTab}
                        onValueChange={setActiveTab}
                        className="mt-6"
                    >
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
                            <TabsTrigger value="delivered">
                                Delivered
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="ongoing">
                            <OrderList
                                orders={orders.filter(
                                    (order) =>
                                        order.status === "on-going" ||
                                        order.status === "picked-up"
                                )}
                                updateOrderStatus={updateOrderStatus}
                                handleOrderDelivered={handleOrderDelivered}
                                type="ongoing"
                            />
                        </TabsContent>
                        <TabsContent value="delivered">
                            <OrderList
                                orders={orders.filter(
                                    (order) => order.status === "delivered"
                                )}
                                updateOrderStatus={updateOrderStatus}
                                type="delivered"
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter>
                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="w-full"
                    >
                        Logout
                    </Button>
                </CardFooter>
            </Card>

            {selectedOrder && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Upload Delivery Image</h2>
                        <form onSubmit={handleImageUpload} className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Upload Image (Required)
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            // Reset input if validation fails
                                            if (file.size > 5 * 1024 * 1024) {
                                                toast({
                                                    title: "Error",
                                                    description: "Image size should be less than 5MB",
                                                    variant: "destructive",
                                                });
                                                e.target.value = '';
                                                setImageFile(null);
                                                return;
                                            }
                                            if (!file.type.startsWith('image/')) {
                                                toast({
                                                    title: "Error",
                                                    description: "Please upload only image files",
                                                    variant: "destructive",
                                                });
                                                e.target.value = '';
                                                setImageFile(null);
                                                return;
                                            }
                                            setImageFile(file);
                                        } else {
                                            setImageFile(null);
                                        }
                                    }}
                                    className="w-full border border-gray-300 rounded-md p-2"
                                    required
                                />
                                <p className="text-sm text-gray-500">
                                    Max file size: 5MB. Supported formats: JPG, PNG, GIF
                                </p>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedOrder(null);
                                        setImageFile(null);
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={!imageFile}
                                >
                                    Mark as Delivered
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
