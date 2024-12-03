import express from 'express';
import multer from 'multer';
import { 
addSlum, 
  getAllSlums, 
  getSlumById, 
  uploadSlumImages, 
  showSlumsPage 
} from '../controllers/slumController.js';

const router = express.Router();

// Set up multer for image file upload
const upload = multer({
  dest: 'uploads/', // Temporary folder for image uploads
});

// POST /slums - Create a new Slum
router.post('/slums', upload.array('photos', 10), addSlum); // This line handles 'photos' as the field name

// GET /slums - Get all slums
router.get('/slums', getAllSlums);

// GET /slum/showslums - Show all slums page
router.get('/showslums', showSlumsPage);

// GET /slums/:id - Get a specific slum by ID
router.get('/slums/:id', getSlumById);

// POST /slums/:id/images - Upload images for a slum
router.post('/slums/:id/images', upload.array('photos', 1), uploadSlumImages);

export default router;
