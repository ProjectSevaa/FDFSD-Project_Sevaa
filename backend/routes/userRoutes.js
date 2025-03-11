import express from "express";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import csrf from "csurf";
import {
    addUser,
    getUserHomePage,
    sendRequest,
    updateUserLocation,
    getUserStats,
} from "../controllers/userController.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Order } from "../models/order.js";
import { Donor } from "../models/donor.js";

const __dirname = path.resolve();

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Create rotating write stream for user logs
const userLogStream = createStream("user_access.log", {
    interval: "6h", // rotate every 6 hours
    path: path.join(__dirname, "log/user"),
});

// Setup the logger for user routes
router.use(morgan("combined", { stream: userLogStream }));

router.use(csrfProtection); // Apply CSRF protection to all routes

router.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.get("/user_homepage", csrfProtection, getUserHomePage);
router.get("/stats", csrfProtection, getUserStats);

router.post("/addUser", csrfProtection, addUser);
router.post(
    "/update-user-location/:userId",
    csrfProtection,
    updateUserLocation
);
router.post("/sendRequest", csrfProtection, sendRequest);

// Add the getStats endpoint
router.get("/getStats", csrfProtection, async (req, res) => {
    try {
        const token = req.cookies.user_jwt;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        const username = decoded.username;
        console.log("Fetching stats for user:", username);

        // Get donor orders count
        const donorOrdersCount = await Order.countDocuments({
            donorUsername: username,
        });

        // Get delivered orders count
        const deliveredOrdersCount = await Order.countDocuments({
            userUsername: username,
            status: "delivered",
        });

        // Get registered delivery boys count
        const user = await User.findOne({ username }).populate("deliveryBoys");
        const registeredDeliveryBoysCount = user?.deliveryBoys?.length || 0;

        // Get average rating if applicable
        const donor = await Donor.findOne({ username });
        const rating = donor?.rating || 0;

        const stats = {
            donorOrdersCount,
            deliveredOrdersCount,
            registeredDeliveryBoysCount,
            rating,
        };

        console.log("Stats:", stats);
        res.json({ success: true, stats });
    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch stats",
            error: error.message,
        });
    }
});

export default router;
