import React from "react"
import { Button } from "@/components/ui/button"

interface StatusToggleProps {
  deliveryBoy: {
    _id: string
    status: string
  }
  onStatusChange: () => void
}

export function StatusToggle({ deliveryBoy, onStatusChange }: StatusToggleProps) {
  const toggleDeliveryBoyStatus = async (status: "available" | "inactive") => {
    try {
      const response = await fetch(
        `http://localhost:9500/deliveryboy/toggle-status/${deliveryBoy._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      onStatusChange()
    } catch (error) {
      console.error("Error toggling status:", error)
      alert("Error toggling status")
    }
  }

  return (
    <div className="flex space-x-4">
      <Button
        onClick={() => toggleDeliveryBoyStatus("available")}
        variant={deliveryBoy.status === "available" ? "secondary" : "default"}
        disabled={deliveryBoy.status === "available"}
      >
        Set Available
      </Button>
      <Button
        onClick={() => toggleDeliveryBoyStatus("inactive")}
        variant={deliveryBoy.status === "inactive" ? "secondary" : "destructive"}
        disabled={deliveryBoy.status === "inactive"}
      >
        Set Inactive
      </Button>
    </div>
  )
}

