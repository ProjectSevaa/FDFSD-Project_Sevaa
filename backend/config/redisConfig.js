import Redis from "ioredis";

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export const updatePostsCache = async () => {
    try {
        const { Post } = await import("../models/post.js");
        const posts = await Post.find().sort({ timestamp: -1 });
        await redisClient.set("allPosts", JSON.stringify(posts), "EX", 600); // 600 seconds = 10 minutes
        console.log("Posts cache updated");
    } catch (error) {
        console.error("Error updating posts cache:", error);
    }
};

// Start the cache update interval
setInterval(updatePostsCache, 600000); // 600000 ms = 10 minutes

export default redisClient;
