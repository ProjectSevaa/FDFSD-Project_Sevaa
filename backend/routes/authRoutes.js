import express from "express";
import {
    loginUser,
    loginDonor,
    signupUser,
    signupDonor,
    logoutUser,
    logoutDonor,
    loginDel,
    signupDel,
} from "../controllers/authController.js";
import csrf from "csurf";

const csrfProtection = csrf({ cookie: true });
const router = express.Router();

router.get("/u_logout", csrfProtection, logoutUser);
router.get("/d_logout", csrfProtection, logoutDonor);

router.post("/donorLogin", csrfProtection, loginDonor);
router.post("/userLogin", csrfProtection, loginUser);

router.post("/delLogin", csrfProtection, loginDel);
router.post("/delSignup", csrfProtection, signupDel);

router.post("/userSignup", csrfProtection, signupUser);
router.post("/donorSignup", csrfProtection, signupDonor);

export default router;
