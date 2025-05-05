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
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: user_jwt
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
 *     LoginInput:
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
 *     SignupInput:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - mobileNumber
 *         - address
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             doorNo:
 *               type: string
 *             street:
 *               type: string
 *             townCity:
 *               type: string
 *             state:
 *               type: string
 *             pincode:
 *               type: string
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
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: user_jwt=abcde12345; Path=/; HttpOnly
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
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *
 * /auth/delLogin:
 *   post:
 *     summary: Login as delivery boy
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deliveryBoyName
 *               - password
 *             properties:
 *               deliveryBoyName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 *
 * /auth/userSignup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInput'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 *
 * /auth/donorSignup:
 *   post:
 *     summary: Register a new donor
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupInput'
 *     responses:
 *       201:
 *         description: Donor created successfully
 *       400:
 *         description: Invalid input
 *
 * /auth/u_logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *
 * /auth/d_logout:
 *   get:
 *     summary: Logout donor
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
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
