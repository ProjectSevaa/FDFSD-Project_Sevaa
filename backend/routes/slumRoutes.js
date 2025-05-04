import express from "express";
import multer from "multer";
import {
    addSlum,
    getAllSlums,
    getSlumById,
    uploadSlumImages,
    showSlumsPage,
} from "../controllers/slumController.js";

/**
 * @swagger
 * tags:
 *   name: Slums
 *   description: Slum location management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Slum:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *             format: binary
 */

/**
 * @swagger
 * /slum/slums:
 *   post:
 *     summary: Add a new slum location
 *     tags: [Slums]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/Slum'
 *     responses:
 *       201:
 *         description: Slum location added successfully
 *   get:
 *     summary: Get all slum locations
 *     tags: [Slums]
 *     responses:
 *       200:
 *         description: List of all slum locations
 */

const router = express.Router();

// Set up multer for image file upload
const upload = multer({
    dest: "uploads/", // Temporary folder for image uploads
});

router.post("/slums", upload.array("photos", 10), addSlum);
router.get("/slums", getAllSlums);
router.get("/showslums", showSlumsPage);
router.get("/slums/:id", getSlumById);
router.post("/slums/:id/images", upload.array("photos", 1), uploadSlumImages);

export default router;
