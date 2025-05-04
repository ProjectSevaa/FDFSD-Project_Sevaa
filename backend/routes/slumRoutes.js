import express from "express";
import multer from "multer";
import {
    addSlum,
    getAllSlums,
    getSlumById,
    uploadSlumImages,
    showSlumsPage,
} from "../controllers/slumController.js";

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
