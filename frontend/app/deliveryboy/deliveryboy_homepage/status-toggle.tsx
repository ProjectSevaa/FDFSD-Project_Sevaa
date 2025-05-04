import React from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Cookies from "js-cookie";

interface StatusToggleProps {
    deliveryBoy: {
        _id: string;
        status: string;
    };
    onStatusChange: () => void;
}

export function StatusToggle({
    deliveryBoy,
    onStatusChange,
}: StatusToggleProps) {
    const { toast } = useToast();

    const toggleDeliveryBoyStatus = async (
        status: "available" | "inactive"
    ) => {
        try {
            // Using the correct endpoint from backend routes
            const response = await fetch(
                `http://localhost:9500/deliveryboy/toggle-status/${deliveryBoy._id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ status }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(
                    errorData.message ||
                        `HTTP error! status: ${response.status}`
                );
            }

            onStatusChange();
            toast({
                title: "Status Updated",
                description: `Status changed to ${status}`,
            });
        } catch (error) {
            console.error("Error toggling status:", error);
            toast({
                title: "Error",
                description: "Failed to update status",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex space-x-4">
            <Button
                onClick={() => toggleDeliveryBoyStatus("available")}
                variant={
                    deliveryBoy.status === "available" ? "secondary" : "default"
                }
                disabled={deliveryBoy.status === "available"}
            >
                Set Available
            </Button>
            <Button
                onClick={() => toggleDeliveryBoyStatus("inactive")}
                variant={
                    deliveryBoy.status === "inactive"
                        ? "secondary"
                        : "destructive"
                }
                disabled={deliveryBoy.status === "inactive"}
            >
                Set Inactive
            </Button>
        </div>
    );
}
