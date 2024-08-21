import express from 'express';
import { loginUser , loginDonor } from '../controllers/authController.js';

const router = express.Router();

router.post('/donorLogin', loginDonor);
router.post('/userLogin', loginUser);
