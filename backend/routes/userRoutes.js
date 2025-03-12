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
const userLogStream = createStream(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    return `${day}-${month}-${year}_${hours}-${hours + 6}_user_access.log`;
}, {
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

export default router;
