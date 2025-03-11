import express from "express";
import multer from "multer";
import csrf from "csurf";
import {
    addSlum,
    getAllSlums,
    getSlumById,
    uploadSlumImages,
    showSlumsPage,
} from "../controllers/slumController.js";

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// Set up multer for image file upload
const upload = multer({
    dest: "uploads/", // Temporary folder for image uploads
});

router.use(csrfProtection); // Apply CSRF protection to all routes

// POST /slums - Create a new Slum
router.post("/slums", upload.array("photos", 10), addSlum); // This line handles 'photos' as the field name
router.get("/slums", csrfProtection, getAllSlums);

// GET /slum/showslums - Show all slums page
router.get("/showslums", csrfProtection, showSlumsPage);

// GET /slums/:id - Get a specific slum by ID
router.get("/slums/:id", csrfProtection, getSlumById);

// POST /slums/:id/images - Upload images for a slum
router.post(
    "/slums/:id/images",
    csrfProtection,
    upload.array("photos", 1),
    uploadSlumImages
);

export default router;
