import express from "express";
import {
    createPost,
    getPosts,
    getAllPosts,
} from "../controllers/postController.js";

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Food donation post management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - availableFood
 *         - location
 *         - currentlocation
 *       properties:
 *         availableFood:
 *           type: array
 *           items:
 *             type: string
 *         location:
 *           type: string
 *         currentlocation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 */

/**
 * @swagger
 * /post/createPost:
 *   post:
 *     summary: Create a new donation post
 *     tags: [Posts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Unauthorized
 *
 * /post/getAllPosts:
 *   get:
 *     summary: Get all donation posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */

const router = express.Router();

router.post("/createPost", createPost);
router.get("/getPosts", getPosts);
router.get("/getAllPosts", getAllPosts);

export default router;
