import express from 'express';
import { loginAdmin , signupAdmin , getAdminDashboard , getModerators } from '../controllers/adminController.js';

const router = express.Router();

router.get('/secret' , (req,res) => {
    res.render('signup_admin');
});

router.get('/admin_dashboard' , getAdminDashboard);
router.get('/getModerators', getModerators);


router.post('/signupAdmin' , signupAdmin);
router.post('/loginAdmin' , loginAdmin);



export default router;