import React from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Order {
  _id: string
  status: string
  donorUsername: string
  userUsername: string
  pickupLocation: string
  deliveryLocation: string
  timestamp: string
}

interface OrderListProps {
  orders: Order[]
  updateOrderStatus: (orderId: string, status: "picked-up" | "delivered") => void
  type: "ongoing" | "delivered"
}

export function OrderList({ orders, updateOrderStatus, type }: OrderListProps) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Card key={order._id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Order ID: {order._id}
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
            <p>Donor: {order.donorUsername}</p>
            <p>User: {order.userUsername}</p>
            <p>Pickup Location: {order.pickupLocation}</p>
            <p>Delivery Location: {order.deliveryLocation}</p>
            <p>Timestamp: {new Date(order.timestamp).toLocaleString()}</p>
          </CardContent>
          {type === "ongoing" && (
            <CardFooter className="justify-end space-x-2">
              {order.status === "on-going" && (
                <Button
                  onClick={() => updateOrderStatus(order._id, "picked-up")}
                  variant="secondary"
                >
                  Mark as Picked-Up
                </Button>
              )}
              <Button
                onClick={() => updateOrderStatus(order._id, "delivered")}
              >
                Mark as Delivered
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
      {orders.length === 0 && (
        <p className="text-center text-muted-foreground">
          No {type} orders.
        </p>
      )}
    </div>
  )
}

