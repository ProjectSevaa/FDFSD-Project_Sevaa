import express from "express";
import ejs from "ejs";
import path from "path";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import fs from "fs";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import csrf from "csurf";

import { fileURLToPath } from "url";
import { connectDB } from "./db/connectDB.js";

import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import donorRoutes from "./routes/donorRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import deliveryboyRoutes from "./routes/deliveryboyRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import slumRoutes from "./routes/slumRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Enable CORS with credentials
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Connect to database
connectDB();

// Apply CSRF protection to all routes
const csrfProtection = csrf({
    cookie: true,
    ignoreMethods: ["GET", "HEAD", "OPTIONS"], // Ignore safe methods
});

app.use(csrfProtection);

// Global error handler for CSRF errors
app.use((err, req, res, next) => {
    if (err.code === "EBADCSRFTOKEN") {
        console.error("CSRF token validation failed:", req.method, req.path);
        return res.status(403).json({
            success: false,
            message: "Invalid or missing CSRF token",
        });
    }

    console.error("Unhandled error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

// Set CSRF token in cookie for frontend
app.use((req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
    });
    next();
});

// Set EJS as view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Logging middleware
const allLogsStream = createStream("all_access.log", {
    interval: "6h", // rotate every 6 hours
    path: path.join(__dirname, "log"),
});
app.use(morgan("combined", { stream: allLogsStream }));

// Public Routes
app.get("/", (req, res) => res.render("whoru"));
app.get("/u_login", (req, res) => res.render("login_signup"));
app.get("/d_login", (req, res) => res.render("login_signup_donor"));
app.get("/del_login", (req, res) => res.render("login_signup_deliveryboy"));
app.get("/admin", (req, res) => res.render("login_admin"));

// CSRF Token Route (Optional)
app.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// API Routes
app.use("/admin", adminRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/donor", donorRoutes);
app.use("/request", requestRoutes);
app.use("/post", postRoutes);
app.use("/deliveryboy", deliveryboyRoutes);
app.use("/order", orderRoutes);
app.use("/slum", slumRoutes);

// Start Server
const PORT = process.env.PORT || 9500;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
