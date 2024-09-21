import express from 'express';
import { addRequest } from "../controllers/requestController.js";

const router = express.Router();


router.post('/addRequest' , addRequest);

export default router;