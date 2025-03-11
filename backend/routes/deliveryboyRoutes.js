import express from "express";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import csrf from "csurf";
import {
    createDeliveryBoy,
    findNearbyPosts,
    getAllDeliveryBoys,
    getDeliveryBoysByUser,
    getDeliveryBoyDashboard,
    addDeliveryBoyToUser,
    toggleStatus,
} from "../controllers/deliveryboyController.js";
import jwt from "jsonwebtoken";
import { DeliveryBoy } from "../models/deliveryboy.js";
import { Order } from "../models/order.js";

const __dirname = path.resolve();
const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Create rotating write stream for delivery boy logs
const deliveryBoyLogStream = createStream("deliveryboy_access.log", {
    interval: "6h", // rotate every 6 hours
    path: path.join(__dirname, "log/deliveryboy"),
});

// Setup the logger for delivery boy routes
router.use(morgan("combined", { stream: deliveryBoyLogStream }));

// CSRF token endpoint
router.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Protected routes
router.post("/createDeliveryBoy", csrfProtection, createDeliveryBoy);
router.get("/findNearbyPosts", csrfProtection, findNearbyPosts);
router.get("/getDeliveryBoyDashboard", csrfProtection, getDeliveryBoyDashboard);
router.post("/addDeliveryBoyToUser", csrfProtection, addDeliveryBoyToUser);
router.patch("/toggle-status/:id", csrfProtection, toggleStatus);
router.get("/getAllDeliveryBoys", csrfProtection, getAllDeliveryBoys);
router.get("/user/:userId", csrfProtection, getDeliveryBoysByUser);

export default router;
