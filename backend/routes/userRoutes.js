import express from "express";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
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

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         address:
 *           type: string
 */

/**
 * @swagger
 * /user/stats:
 *   get:
 *     summary: Get user statistics
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 donorOrdersCount:
 *                   type: integer
 *                 deliveredOrdersCount:
 *                   type: integer
 *                 registeredDeliveryBoysCount:
 *                   type: integer
 *                 rating:
 *                   type: number
 *       401:
 *         description: Unauthorized
 * 
 * /user/update-user-location/{userId}:
 *   post:
 *     summary: Update user location
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Location updated successfully
 */

const __dirname = path.resolve();

const router = express.Router();

// Create rotating write stream for user logs
const userLogStream = createStream(
    () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        return `user_access.log`;
    },
    {
        interval: "6h", // rotate every 6 hours
        path: path.join(__dirname, "log/user"),
    }
);

// Setup the logger for user routes
router.use(morgan("combined", { stream: userLogStream }));

router.get("/user_homepage", getUserHomePage);
router.get("/stats", getUserStats);

router.post("/addUser", addUser);
router.post("/update-user-location/:userId", updateUserLocation);
router.post("/sendRequest", sendRequest);

export default router;
