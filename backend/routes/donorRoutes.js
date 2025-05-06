import express from "express";
import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import {
    getDonorPosts,
    addDonor,
    getDonorHomePage,
    getDonors,
    toggleBan,
    getDonorStats,
} from "../controllers/donorController.js";

/**
 * @swagger
 * components:
 *   schemas:
 *     Donor:
 *       type: object
 *       required:
 *         - username
 *         - mobileNumber
 *         - email
 *         - password
 *         - address
 *       properties:
 *         username:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         address:
 *           type: string
 */

/**
 * @swagger
 * /donor/getDonors:
 *   get:
 *     summary: Get all donors
 *     tags: [Donors]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all donors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Donor'
 */

/**
 * @swagger
 * /donor/getDonorPosts:
 *   get:
 *     summary: Get donor's posts
 *     tags: [Donors]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of donor's posts
 * 
 * /donor/toggleBan/{donorId}:
 *   post:
 *     summary: Toggle donor ban status
 *     tags: [Donors]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: donorId
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
 *               isBanned:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Ban status updated successfully
 */

const __dirname = path.resolve();

const router = express.Router();

// Create rotating write stream for donor logs
const donorLogStream = createStream(
    () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        return `donor_access.log`;
    },
    {
        interval: "6h", // rotate every 6 hours
        path: path.join(__dirname, "log/donor"),
    }
);

// Setup the logger for donor routes
router.use(morgan("combined", { stream: donorLogStream }));

router.get("/donor_homepage", getDonorHomePage);
router.get("/getDonors", getDonors);
router.get("/getDonorPosts", getDonorPosts);
router.get("/donorStats/:donorEmail", getDonorStats);

router.post("/addDonor", addDonor);
router.post("/toggleBan/:donorId", toggleBan);

export default router;
