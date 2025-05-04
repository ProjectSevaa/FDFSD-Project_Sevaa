import { Post } from "../models/post.js";
import { Donor } from "../models/donor.js";
import jwt from "jsonwebtoken";
import redisClient, { updatePostsCache } from "../config/redisConfig.js";

// Create a new post with current location
export const createPost = async (req, res) => {
    try {
        const { availableFood, location, currentlocation } = req.body;

        // Get donor username from JWT token
        const token = req.cookies.donor_jwt;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated - Please login as a donor",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            if (decoded.role !== "donor") {
                return res.status(403).json({
                    success: false,
                    message: "Not authorized - Must be a donor to create posts",
                });
            }
            const donorUsername = decoded.username;

            const newPost = new Post({
                donorUsername,
                availableFood: Array.isArray(availableFood)
                    ? availableFood
                    : [availableFood],
                location,
                currentlocation,
            });

            await newPost.save();

            // Update Redis cache immediately after creating new post
            if (redisClient.status === "ready") {
                const allPosts = await Post.find().sort({ timestamp: -1 });
                await updatePostsCache(allPosts);
                console.log(
                    "\x1b[32m%s\x1b[0m",
                    "🆕 Cache updated with new post"
                );
            }

            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: newPost,
            });
        } catch (jwtError) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }
    } catch (error) {
        console.error("Error in createPost:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Get posts for a specific donor
export const getPosts = async (req, res) => {
    const { donorUsername } = req.query;
    try {
        const posts = await Post.find({ donorUsername }).sort({
            timestamp: -1,
        });
        res.json({
            success: true,
            posts,
        });
    } catch (error) {
        console.error("Error in getPosts:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

// Get all posts
export const getAllPosts = async (req, res) => {
    try {
        let posts;
        let source = "database";

        // Try Redis first if available
        if (redisClient.status === "ready") {
            try {
                const cachedPosts = await redisClient.get("allPosts");
                if (cachedPosts) {
                    console.log(
                        "\x1b[36m%s\x1b[0m",
                        "✨ Fetching posts from Redis cache"
                    );
                    posts = JSON.parse(cachedPosts);
                    source = "cache";
                }
            } catch (redisError) {
                console.log(
                    "\x1b[33m%s\x1b[0m",
                    "⚠️ Redis error, falling back to MongoDB"
                );
            }
        }

        // Fetch from MongoDB if not in cache
        if (!posts) {
            console.log("\x1b[33m%s\x1b[0m", "📦 Fetching posts from MongoDB");
            posts = await Post.find().sort({ timestamp: -1 });

            // Update cache with fresh data
            if (redisClient.status === "ready") {
                updatePostsCache(posts).then((success) => {
                    if (success) {
                        console.log(
                            "\x1b[32m%s\x1b[0m",
                            "🔄 Redis cache updated with fresh data"
                        );
                    }
                });
            }
        }

        res.json({
            success: true,
            posts,
            source,
        });
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "❌ Error in getAllPosts:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
