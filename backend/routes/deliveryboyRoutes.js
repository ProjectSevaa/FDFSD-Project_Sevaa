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

/**
 * @swagger
 * tags:
 *   name: DeliveryBoys
 *   description: Delivery boy management operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DeliveryBoy:
 *       type: object
 *       required:
 *         - deliveryBoyName
 *         - mobileNumber
 *         - password
 *         - vehicleNo
 *         - drivingLicenseNo
 *         - currentLocation
 *       properties:
 *         deliveryBoyName:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         password:
 *           type: string
 *         vehicleNo:
 *           type: string
 *         drivingLicenseNo:
 *           type: string
 *         currentLocation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               example: Point
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               example: [longitude, latitude]
 */

/**
 * @swagger
 * /deliveryboy/createDeliveryBoy:
 *   post:
 *     summary: Create a new delivery boy
 *     tags: [DeliveryBoys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeliveryBoy'
 *     responses:
 *       201:
 *         description: Delivery boy created successfully
 *       400:
 *         description: Invalid input or error occurred
 */

/**
 * @swagger
 * /deliveryboy/findNearbyPosts:
 *   get:
 *     summary: Find nearby posts for delivery boys
 *     tags: [DeliveryBoys]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to find nearby delivery boys
 *     responses:
 *       200:
 *         description: List of nearby delivery boys
 *       404:
 *         description: Post or delivery boys not found
 */

/**
 * @swagger
 * /deliveryboy/getDeliveryBoyDashboard:
 *   get:
 *     summary: Get delivery boy dashboard data
 *     tags: [DeliveryBoys]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /deliveryboy/addDeliveryBoyToUser:
 *   post:
 *     summary: Add a delivery boy to a user
 *     tags: [DeliveryBoys]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryBoyName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery boy added to user successfully
 *       404:
 *         description: User or delivery boy not found
 *       400:
 *         description: Delivery boy already added
 */

/**
 * @swagger
 * /deliveryboy/toggle-status/{id}:
 *   patch:
 *     summary: Toggle the active status of a delivery boy
 *     tags: [DeliveryBoys]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Delivery boy ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [available, inactive]
 *     responses:
 *       200:
 *         description: Delivery boy status toggled successfully
 *       404:
 *         description: Delivery boy not found
 *       400:
 *         description: Invalid status
 */

/**
 * @swagger
 * /deliveryboy/getAllDeliveryBoys:
 *   get:
 *     summary: Get all delivery boys
 *     tags: [DeliveryBoys]
 *     responses:
 *       200:
 *         description: List of all delivery boys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeliveryBoy'
 *       404:
 *         description: No delivery boys found
 */

/**
 * @swagger
 * /deliveryboy/user/{userId}:
 *   get:
 *     summary: Get delivery boys assigned to a user
 *     tags: [DeliveryBoys]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of delivery boys assigned to the user
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /deliveryboy/getMyDeliveryBoys:
 *   get:
 *     summary: Get delivery boys assigned to the logged-in user
 *     tags: [DeliveryBoys]
 *     responses:
 *       200:
 *         description: List of delivery boys assigned to the logged-in user
 *       401:
 *         description: Unauthorized
 */

// Protected routes
router.post("/createDeliveryBoy", createDeliveryBoy);
router.get("/findNearbyPosts", findNearbyPosts);
router.get("/getDeliveryBoyDashboard", authenticateDeliveryBoy, getDeliveryBoyDashboard);
router.post("/addDeliveryBoyToUser", addDeliveryBoyToUser);
router.patch("/toggle-status/:id", authenticateDeliveryBoy, toggleStatus);
router.get("/getAllDeliveryBoys", getAllDeliveryBoys);
router.get("/user/:userId", getDeliveryBoysByUser);
router.get("/getMyDeliveryBoys", getMyDeliveryBoys);

// Add authentication middleware
function authenticateDeliveryBoy(req, res, next) {
    const token = req.cookies.deliveryboy_jwt;
    if (!token) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'testsecretkey');
        if (decoded.role !== 'deliveryboy') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        req.deliveryBoy = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
}

export default router;
