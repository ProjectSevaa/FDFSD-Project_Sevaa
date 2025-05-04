import "dotenv/config";
import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import multer from "multer";
import { Request } from "../models/request.js";
import { Post } from "../models/post.js";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { DeliveryBoy } from "../models/deliveryboy.js";
import { DeliveryImage } from "../models/deliveryImage.js";
import path from "path";
import fs from "fs";

const app = express();

const url = process.env.URL;

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(
            process.cwd(),
            "public",
            "uploads",
            "delivery-images"
        );
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename with timestamp and original extension
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, "delivery-" + uniqueSuffix + path.extname(file.originalname));
    },
});

// Configure multer upload
const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 1, // Allow only 1 file
    },
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed!"), false);
        }
        cb(null, true);
    },
});

export const assignOrder = async (req, res) => {
    const { requestId, deliveryBoyId, deliveryLocation } = req.body;

    try {
        // Find the request details
        const request = await Request.findById(requestId);
        if (!request)
            return res.status(404).json({ message: "Request not found" });

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
        const token =
            req.cookies.donor_jwt ||
            req.cookies.user_jwt ||
            req.cookies.deliveryboy_jwt;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        let orders;

        // Log the role and username for debugging
        console.log(
            "\x1b[36m%s\x1b[0m",
            `🔍 Fetching orders for ${decoded.role} : ${decoded.username}`
        );

        switch (decoded.role) {
            case "user":
                orders = await Order.find({
                    userUsername: decoded.username,
                }).sort({ timestamp: -1 });
                break;
            case "donor":
                orders = await Order.find({
                    donorUsername: decoded.username,
                }).sort({ timestamp: -1 });
                break;
            case "deliveryboy":
                orders = await Order.find({
                    deliveryBoyName: decoded.username,
                }).sort({ timestamp: -1 });
                break;
            default:
                // For admin or other roles, fetch all orders
                orders = await Order.find().sort({ timestamp: -1 });
        }

        console.log("\x1b[32m%s\x1b[0m", `✅ Found ${orders.length} orders`);

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "❌ Error in getOrders:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const setOrderDelivered = [
    uploadMiddleware.single("image"),
    async (req, res) => {
        try {
            const { orderId } = req.body;
            if (!orderId) {
                return res.status(400).json({
                    success: false,
                    message: "Order ID is required",
                });
            }

            // Check if image file is provided
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "Delivery image is required",
                });
            }

            // Verify delivery boy authentication
            const token = req.cookies.deliveryboy_jwt;
            if (!token) {
                // Clean up uploaded file
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err) console.error("Error deleting file:", err);
                    });
                }
                return res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
            }

            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(
                    token,
                    process.env.JWT_SECRET_KEY,
                    (err, decoded) => {
                        if (err) reject(err);
                        else resolve(decoded);
                    }
                );
            });

            if (decoded.role !== "deliveryboy") {
                // Clean up uploaded file
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err)
                            console.error(
                                "Error deleting unauthorized file:",
                                err
                            );
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: "Not authorized - Must be a delivery boy",
                });
            }

            // Find and update the order
            const order = await Order.findById(orderId);
            if (!order) {
                // Clean up uploaded file
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err)
                            console.error(
                                "Error deleting file for non-existent order:",
                                err
                            );
                    });
                }
                return res.status(404).json({
                    success: false,
                    message: "Order not found",
                });
            }

            // Check if order is assigned to this delivery boy
            if (order.deliveryBoyName !== decoded.username) {
                // Clean up uploaded file
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err)
                            console.error(
                                "Error deleting unauthorized file:",
                                err
                            );
                    });
                }
                return res.status(403).json({
                    success: false,
                    message: "Not authorized to deliver this order",
                });
            }

            if (order.status !== "picked-up") {
                // Clean up uploaded file
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err)
                            console.error(
                                "Error deleting file for invalid status:",
                                err
                            );
                    });
                }
                return res.status(400).json({
                    success: false,
                    message:
                        "Order cannot be delivered - must be picked up first",
                });
            }

            // Check if delivery image already exists
            const existingImage = await DeliveryImage.findOne({ orderId });
            if (existingImage) {
                // Clean up uploaded file
                if (req.file) {
                    fs.unlink(req.file.path, (err) => {
                        if (err)
                            console.error(
                                "Error deleting duplicate file:",
                                err
                            );
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: "Delivery image already exists for this order",
                });
            }

            // Save the delivery image
            const deliveryImage = new DeliveryImage({
                deliveryBoyName: decoded.username,
                orderId,
                image: req.file.path,
                timestamp: new Date(),
            });
            await deliveryImage.save();

            // Update order status
            order.status = "delivered";
            order.deliveryTimestamp = new Date();
            await order.save();

            // Update user and delivery boy stats
            const [user, deliveryBoy] = await Promise.all([
                User.findOne({ username: order.userUsername }),
                DeliveryBoy.findOne({ deliveryBoyName: decoded.username }),
            ]);

            if (user) {
                user.deliveredOrdersCount =
                    (user.deliveredOrdersCount || 0) + 1;
                await user.save();
            }

            if (deliveryBoy) {
                deliveryBoy.deliveredOrders =
                    (deliveryBoy.deliveredOrders || 0) + 1;
                deliveryBoy.status = "available";
                await deliveryBoy.save();
            }

            res.status(200).json({
                success: true,
                message: "Order delivered successfully",
                order,
                imagePath: req.file.path,
            });
        } catch (error) {
            // Clean up uploaded file in case of error
            if (req.file) {
                fs.unlink(req.file.path, (err) => {
                    if (err)
                        console.error("Error deleting file after error:", err);
                });
            }

            console.error("Error in setOrderDelivered:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Server error",
                error: error.message,
            });
        }
    },
];

export const setOrderPickedUp = async (req, res) => {
    try {
        console.log("Received request body:", req.body); // Debug log
        const { orderId } = req.body;

        if (!orderId) {
            console.log("Missing orderId in request:", req.body); // Debug log
            return res.status(400).json({
                success: false,
                message: "Order ID is required",
            });
        }

        // Verify delivery boy authentication
        const token = req.cookies.deliveryboy_jwt;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        if (decoded.role !== "deliveryboy") {
            return res.status(403).json({
                success: false,
                message: "Not authorized - Must be a delivery boy",
            });
        }

        // Find and update the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Check if order is assigned to this delivery boy
        if (order.deliveryBoyName !== decoded.username) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to pick up this order",
            });
        }

        if (order.status !== "on-going") {
            return res.status(400).json({
                success: false,
                message: "Order cannot be picked up - invalid status",
            });
        }

        order.status = "picked-up";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order picked up successfully",
            order,
        });
    } catch (error) {
        console.error("Error in setOrderPickedUp:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const uploadDeliveryImage = [
    uploadMiddleware.single("image"),
    async (req, res) => {
        try {
            const { orderId } = req.body;
            const token = req.cookies.deliveryboy_jwt;
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
            }

            const decoded = await new Promise((resolve, reject) => {
                jwt.verify(
                    token,
                    process.env.JWT_SECRET_KEY,
                    (err, decoded) => {
                        if (err) reject(err);
                        else resolve(decoded);
                    }
                );
            });

            if (decoded.role !== "deliveryboy") {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized - Must be a delivery boy",
                });
            }

            const deliveryImage = new DeliveryImage({
                deliveryBoyName: decoded.username,
                orderId,
                image: req.file.path,
            });

            await deliveryImage.save();

            res.status(201).json({
                success: true,
                message: "Image uploaded successfully",
                deliveryImage,
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            res.status(500).json({
                success: false,
                message: "Server error",
                error: error.message,
            });
        }
    },
];
