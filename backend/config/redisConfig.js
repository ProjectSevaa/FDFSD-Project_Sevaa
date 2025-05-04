import Redis from "ioredis";

let redisClient;

try {
    redisClient = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return times >= 3 ? null : delay; // Stop retrying after 3 attempts
        },
        maxRetriesPerRequest: 1,
    });

    redisClient.on("connect", () => {
        console.log("Connected to Redis");
    });

    redisClient.on("error", (err) => {
        console.error("Redis connection error:", err);
    });
} catch (error) {
    console.log("Redis initialization failed, continuing without cache");
    redisClient = {
        status: "failed",
        get: async () => null,
        set: async () => null,
    };
}

export const updatePostsCache = async () => {
    if (redisClient.status !== "ready") return;

    try {
        const { Post } = await import("../models/post.js");
        const posts = await Post.find().sort({ timestamp: -1 });
        await redisClient.set("allPosts", JSON.stringify(posts), "EX", 600); // 600 seconds = 10 minutes
        console.log("Posts cache updated");
    } catch (error) {
        console.error("Error updating posts cache:", error);
    }
};

// Only start interval if Redis is connected
if (redisClient.status === "ready") {
    setInterval(updatePostsCache, 600000); // 600000 ms = 10 minutes
}

export default redisClient;
