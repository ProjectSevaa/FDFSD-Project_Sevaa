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

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User, Donor and Delivery Boy authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCredentials:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *     DonorSignup:
 *       type: object
 *       required:
 *         - username
 *         - mobileNumber
 *         - email
 *         - password
 *         - address
 *       properties:
 *         username:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         address:
 *           type: string
 */

/**
 * @swagger
 * /auth/userLogin:
 *   post:
 *     summary: Login as user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *
 * /auth/donorLogin:
 *   post:
 *     summary: Login as donor
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserCredentials'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */

const router = express.Router();

router.get("/u_logout", logoutUser);
router.get("/d_logout", logoutDonor);

router.post("/donorLogin", loginDonor);
router.post("/userLogin", loginUser);

router.post("/delLogin", loginDel);
router.post("/delSignup", signupDel);

router.post("/userSignup", signupUser);
router.post("/donorSignup", signupDonor);

export default router;
