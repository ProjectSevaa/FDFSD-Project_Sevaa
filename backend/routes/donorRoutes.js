import express from 'express';
import { addDonor , getDonorHomePage , getDonors } from "../controllers/donorController.js";

const router = express.Router();

router.get('/donor_homepage' , getDonorHomePage);
router.get('/getDonors' , getDonors);

router.post('/addDonor' , addDonor);

export default router;