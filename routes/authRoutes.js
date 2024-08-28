import express from 'express';
import { loginUser , loginDonor , signupUser , signupDonor } from '../controllers/authController.js';

const router = express.Router();

router.post('/donorLogin', loginDonor);
router.post('/userLogin', loginUser);

router.post('/userSignup' , signupUser);
router.post('/donorSignup' , signupDonor);
export default router;