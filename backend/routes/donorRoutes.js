import express from "express";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import csrf from "csurf";
import {
    getDonorPosts,
    addDonor,
    getDonorHomePage,
    getDonors,
    toggleBan,
    getDonorStats,
} from "../controllers/donorController.js";

const __dirname = path.resolve();

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Create rotating write stream for donor logs
const donorLogStream = createStream(() => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    return `${day}-${month}-${year}_${hours}-${hours + 6}_donor_access.log`;
}, {
    interval: "6h", // rotate every 6 hours
    path: path.join(__dirname, "log/donor"),
});

// Setup the logger for donor routes
router.use(morgan("combined", { stream: donorLogStream }));

// Add a route to get CSRF token
router.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.get("/donor_homepage", csrfProtection, getDonorHomePage);
router.get("/getDonors", csrfProtection, getDonors);
router.get("/getDonorPosts", csrfProtection, getDonorPosts);
router.get("/donorStats/:donorEmail", csrfProtection, getDonorStats);

router.post("/addDonor", csrfProtection, addDonor);
router.post("/toggleBan/:donorId", csrfProtection, toggleBan);

export default router;
