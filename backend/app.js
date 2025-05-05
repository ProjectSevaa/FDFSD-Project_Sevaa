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
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";

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
const allowedOrigins = [
    "https://frontend-delta-eight-38.vercel.app",
    "https://frontend-e7abrx4i9-abhiramkothagundus-projects.vercel.app",
    "http://localhost:3000",
];

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
);

// Parse cookies
app.use(cookieParser());

// Parse JSON bodies
app.use(express.json());

// Connect to database
connectDB();

// Set EJS as view engine
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Logging middleware
const allLogsStream = createStream(
    () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        return `${day}-${month}-${year}_${hours}-${hours + 6}_all_access.log`;
    },
    {
        interval: "6h", // rotate every 6 hours
        path: path.join(__dirname, "log"),
    }
);
app.use(morgan("combined", { stream: allLogsStream }));

// Ensure directories exist for delivery and donation logs
const ensureLogDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};
ensureLogDir(path.join(__dirname, "log/delivery"));
ensureLogDir(path.join(__dirname, "log/donation"));

// Ensure directories exist for user-specific logs
ensureLogDir(path.join(__dirname, "log/user"));
ensureLogDir(path.join(__dirname, "log/donor"));
ensureLogDir(path.join(__dirname, "log/deliveryboy"));

// Utility function for logging
const logEvent = (type, username, message) => {
    const logFilePath = path.join(__dirname, `log/${type}/${username}.log`);
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) console.error(`Error writing to ${type} log:`, err);
    });
};

// Attach logEvent to the request object
app.use((req, res, next) => {
    req.logEvent = logEvent;
    next();
});

// Delivery logs
const deliveryLogStream = createStream(
    () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        return `${day}-${month}-${year}_${hours}-${
            hours + 6
        }_delivery_access.log`;
    },
    {
        interval: "6h",
        path: path.join(__dirname, "log/delivery"),
    }
);
app.use("/delivery", morgan("combined", { stream: deliveryLogStream }));

// Donation logs
const donationLogStream = createStream(
    () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        return `${day}-${month}-${year}_${hours}-${
            hours + 6
        }_donation_access.log`;
    },
    {
        interval: "6h",
        path: path.join(__dirname, "log/donation"),
    }
);
app.use("/donation", morgan("combined", { stream: donationLogStream }));

// Swagger UI route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Public Routes
app.get("/", (req, res) => res.render("whoru"));
app.get("/u_login", (req, res) => res.render("login_signup"));
app.get("/d_login", (req, res) => res.render("login_signup_donor"));
app.get("/del_login", (req, res) => res.render("login_signup_deliveryboy"));
app.get("/admin", (req, res) => res.render("login_admin"));

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
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

export default app;
