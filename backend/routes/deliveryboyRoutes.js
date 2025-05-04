import express from "express";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import {
    createDeliveryBoy,
    findNearbyPosts,
    getAllDeliveryBoys,
    getDeliveryBoysByUser,
    getDeliveryBoyDashboard,
    addDeliveryBoyToUser,
    toggleStatus,
    getMyDeliveryBoys, // Add this import
} from "../controllers/deliveryboyController.js";
import jwt from "jsonwebtoken";
import { DeliveryBoy } from "../models/deliveryboy.js";
import { Order } from "../models/order.js";

const __dirname = path.resolve();
const router = express.Router();

// Create rotating write stream for delivery boy logs
const deliveryBoyLogStream = createStream(
    () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        return `${day}-${month}-${year}_${hours}-${
            hours + 6
        }_deliveryboy_access.log`;
    },
    {
        interval: "6h", // rotate every 6 hours
        path: path.join(__dirname, "log/deliveryboy"),
    }
);

// Setup the logger for delivery boy routes
router.use(morgan("combined", { stream: deliveryBoyLogStream }));

// Protected routes
router.post("/createDeliveryBoy", createDeliveryBoy);
router.get("/findNearbyPosts", findNearbyPosts);
router.get("/getDeliveryBoyDashboard", getDeliveryBoyDashboard);
router.post("/addDeliveryBoyToUser", addDeliveryBoyToUser);
router.patch("/toggle-status/:id", toggleStatus);
router.get("/getAllDeliveryBoys", getAllDeliveryBoys);
router.get("/user/:userId", getDeliveryBoysByUser);
router.get("/getMyDeliveryBoys", getMyDeliveryBoys);

export default router;
