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
            // Update Redis cache after creating new post
            await updatePostsCache();

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
        // Try Redis first
        if (redisClient.status === "ready") {
            try {
                const cachedPosts = await redisClient.get("allPosts");
                if (cachedPosts) {
                    console.log(
                        "\x1b[36m%s\x1b[0m",
                        "✨ Fetching posts from Redis cache"
                    );
                    return res.json({
                        success: true,
                        posts: JSON.parse(cachedPosts),
                        source: "cache",
                    });
                }
            } catch (redisError) {
                console.log(
                    "\x1b[33m%s\x1b[0m",
                    "⚠️ Redis error, falling back to MongoDB"
                );
            }
        }

        // Fallback to MongoDB
        console.log("\x1b[33m%s\x1b[0m", "📦 Fetching posts from MongoDB");
        const posts = await Post.find().sort({ timestamp: -1 });
        res.json({
            success: true,
            posts,
            source: "database",
        });

        // Try to update cache if Redis is available
        if (redisClient.status === "ready") {
            await redisClient.set("allPosts", JSON.stringify(posts), "EX", 600);
            console.log(
                "\x1b[32m%s\x1b[0m",
                "🔄 Redis cache updated with fresh data"
            );
        }
    } catch (error) {
        console.error("\x1b[31m%s\x1b[0m", "❌ Error in getAllPosts:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};
