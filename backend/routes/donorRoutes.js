import express from 'express';
import { addDonor , getDonorHomePage } from "../controllers/donorController.js";

const router = express.Router();

router.get('/donor_homepage' , getDonorHomePage);

router.post('/addDonor' , addDonor);

export default router;