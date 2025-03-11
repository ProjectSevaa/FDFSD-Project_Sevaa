import express from "express";
import csrf from "csurf";
import {
    createPost,
    getPosts,
    getAllPosts,
} from "../controllers/postController.js";

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// CSRF token endpoint
router.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Protected routes
router.post("/createPost", csrfProtection, createPost);
router.get("/getPosts", csrfProtection, getPosts);
router.get("/getAllPosts", csrfProtection, getAllPosts);

export default router;
