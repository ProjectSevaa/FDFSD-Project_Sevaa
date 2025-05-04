import express from "express";
import {
    createPost,
    getPosts,
    getAllPosts,
} from "../controllers/postController.js";

const router = express.Router();

router.post("/createPost", createPost);
router.get("/getPosts", getPosts);
router.get("/getAllPosts", getAllPosts);

export default router;
