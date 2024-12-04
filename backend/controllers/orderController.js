import "dotenv/config";
import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Request } from "../models/request.js";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { DeliveryBoy } from "../models/deliveryboy.js";
import { recalculateAllRatings } from "./ratingController.js";
const app = express();

const url = process.env.URL;

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cookieParser());

export const assignOrder = async (req, res) => {
  const { requestId, deliveryBoyId, deliveryLocation } = req.body;

  try {
    // Find the request details
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    // Find the post to get the pickup coordinates
    const post = await Post.findById(request.post_id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Find the delivery boy, excluding inactive delivery boys
    const deliveryBoy = await DeliveryBoy.findOne({
      _id: deliveryBoyId,
      status: { $ne: "inactive" }, // Exclude inactive delivery boys
    });

    if (!deliveryBoy)
      return res
        .status(404)
        .json({ message: "Delivery boy not found or inactive" });

    // Check if the delivery boy is already on an ongoing delivery
    if (deliveryBoy.status === "on-going") {
      return res.status(400).json({
        message: `${deliveryBoy.deliveryBoyName} is already assigned to another delivery`,
      });
    }

    // Create a new order
    const newOrder = new Order({
      donorUsername: request.donorUsername,
      userUsername: request.userUsername,
      post_id: request.post_id,
      pickupLocation: post.location || "N/A",
      pickupLocationCoordinates: {
        type: post.currentlocation.type,
        coordinates: post.currentlocation.coordinates,
      },
      deliveryLocation,
      deliveryBoy: deliveryBoyId,
      deliveryBoyName: deliveryBoy.deliveryBoyName,
      status: "on-going",
    });

    // Save the order to the database
    await newOrder.save();

    // Update the request to reflect that the delivery is assigned
    request.deliveryAssigned = true;
    await request.save();

    // Update the delivery boy status to "on-going"
    deliveryBoy.status = "on-going";
    await deliveryBoy.save();

    // Send a success response
    res.status(201).json({
      message: "Order created successfully",
      newOrder,
    });
  } catch (error) {
    console.error("Error assigning order:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const token = req.cookies.user_jwt;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const decodedToken = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    const username = decodedToken.username;

    const userOrders = await Order.find({ userUsername: username });

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found for this user.",
      });
    }

    res.status(200).json({
      success: true,
      assignedOrders: userOrders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const setOrderDelivered = async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check the current status of the order before marking it as delivered
    if (order.status !== "on-going" && order.status !== "picked-up") {
      return res
        .status(400)
        .json({ message: `Order marked as delivered in its current state` });
    }

    // Set order status to 'delivered'
    order.status = "delivered";
    const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy);
    const user = await User.findOne({ username: order.userUsername });
    await order.save();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }
    user.deliveredOrdersCount += 1;
    deliveryBoy.deliveredOrders += 1;
    deliveryBoy.status = "available";
    await deliveryBoy.save();
    await user.save();
    recalculateAllRatings();
    res.status(200).json({ message: "Order delivered successfully" });
  } catch (error) {
    console.error("Error details:", error); // Log the actual error
    res
      .status(500)
      .json({ message: "Error updating order status", error: error.message });
  }
};

export const setOrderPickedUp = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Find the order by ID and update its status
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Set order status to 'picked-up'
    if (order.status !== "on-going") {
      // Optional: Prevent updating if it's not in 'on-going' status
      return res.status(400).json({
        message: "Order must be in ongoing status to be marked as picked up",
      });
    }
    order.status = "picked-up";
    await order.save();

    const deliveryBoy = await DeliveryBoy.findById(order.deliveryBoy);
    if (deliveryBoy) {
      deliveryBoy.status = "on-going";
      await deliveryBoy.save();
    } else {
      console.error("Delivery boy not found");
    }

    res.status(200).json({ message: "Order picked up successfully", order });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
  }
};
