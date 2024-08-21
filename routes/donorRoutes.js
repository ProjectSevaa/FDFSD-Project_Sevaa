import express from 'express';
import { addDonor } from "../controllers/donorController.js";

const router = express.Router();

router.post('/addDonor' , addDonor);

export default router;