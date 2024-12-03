"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

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
}

export default function DeliveryBoyHomepage() {
  const [deliveryBoy, setDeliveryBoy] = useState<DeliveryBoy | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(
        "http://localhost:9500/deliveryboy/getDeliveryBoyDashboard",
        {
          method: "GET",
          credentials: "include",
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
    }
  };

  const updateOrderStatus = async (
    orderId: string,
    status: "picked-up" | "delivered"
  ) => {
    try {
      const endpoint =
        status === "picked-up" ? "setOrderPickedUp" : "setOrderDelivered";

      const response = await fetch(`http://localhost:9500/order/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies for authentication
        body: JSON.stringify({ orderId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchDashboardData(); // Refresh data after update
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status");
    }
  };

  const toggleDeliveryBoyStatus = async (status: "available" | "inactive") => {
    try {
      const response = await fetch(
        `http://localhost:9500/deliveryboy/toggle-status/${deliveryBoy?._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies for authentication
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      fetchDashboardData(); // Refresh data after update
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Error toggling status");
    }
  };

  if (!deliveryBoy) {
    return <div className="text-white bg-gray-900 min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="bg-gray-900 text-white p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">
          Welcome, {deliveryBoy.deliveryBoyName}
        </h1>

        {/* Toggle Active/Inactive Status Buttons */}
        <div className="mb-6">
          <button
            onClick={() => toggleDeliveryBoyStatus("available")}
            className={`px-6 py-2 text-white bg-green-600 rounded-md mr-4 ${
              deliveryBoy.status === "available"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-500"
            }`}
            disabled={deliveryBoy.status === "available"}
          >
            Set Available
          </button>
          <button
            onClick={() => toggleDeliveryBoyStatus("inactive")}
            className={`px-6 py-2 text-white bg-red-600 rounded-md ${
              deliveryBoy.status === "inactive"
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-red-500"
            }`}
            disabled={deliveryBoy.status === "inactive"}
          >
            Set Inactive
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto whitespace-nowrap border-b border-gray-700 mb-6">
          <button
            onClick={() => setActiveTab("ongoing")}
            className={`inline-flex items-center h-12 px-4 text-white border-b-2 focus:outline-none ${
              activeTab === "ongoing"
                ? "border-red-500"
                : "border-transparent hover:border-gray-500"
            }`}
          >
            <span className="text-base font-semibold">Ongoing</span>
          </button>
          <button
            onClick={() => setActiveTab("delivered")}
            className={`inline-flex items-center h-12 px-4 text-white border-b-2 focus:outline-none ${
              activeTab === "delivered"
                ? "border-red-500"
                : "border-transparent hover:border-gray-500"
            }`}
          >
            <span className="text-base font-semibold">Delivered</span>
          </button>
        </div>

        {/* Orders Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            {activeTab === "ongoing" ? "On-going Orders" : "Delivered Orders"}
          </h2>
          {orders
            .filter((order) =>
              activeTab === "ongoing"
                ? order.status === "on-going" || order.status === "picked-up"
                : order.status === "delivered"
            )
            .map((order) => (
              <div
                key={order._id}
                className="bg-gray-800 rounded-lg shadow-md mb-4 p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">
                    {new Date(order.timestamp).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-3 py-1 text-sm font-bold rounded ${
                      order.status === "on-going"
                        ? "bg-red-500 text-white"
                        : order.status === "picked-up"
                        ? "bg-yellow-500 text-black"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-lg font-semibold">Order ID: {order._id}</p>
                  <p className="text-gray-400">Donor: {order.donorUsername}</p>
                  <p className="text-gray-400">User: {order.userUsername}</p>
                  <p className="text-gray-400">
                    Pickup Location: {order.pickupLocation}
                  </p>
                  <p className="text-gray-400">
                    Delivery Location: {order.deliveryLocation}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-bold text-gray-400">
                    Timestamp: {new Date(order.timestamp).toLocaleString()}
                  </span>
                  {activeTab === "ongoing" && (
                    <div className="space-x-2">
                      {order.status === "on-going" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(order._id, "picked-up")
                          }
                          className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded hover:bg-blue-500"
                        >
                          Mark as Picked-Up
                        </button>
                      )}
                      <button
                        onClick={() =>
                          updateOrderStatus(order._id, "delivered")
                        }
                        className="px-4 py-2 text-sm font-bold text-white bg-green-600 rounded hover:bg-green-500"
                      >
                        Mark as Delivered
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          {orders.filter((order) =>
            activeTab === "ongoing"
              ? order.status === "on-going" || order.status === "picked-up"
              : order.status === "delivered"
          ).length === 0 && (
            <p className="text-gray-400">No {activeTab} orders.</p>
          )}
        </div>
      </div>
    </div>
  );
}
