import Redis from "ioredis";

let redisClient;

try {
    redisClient = new Redis({
        host: process.env.REDIS_HOST || "127.0.0.1", // Changed from localhost to 127.0.0.1
        port: process.env.REDIS_PORT || 6379,
        retryStrategy: (times) => {
            const delay = Math.min(times * 50, 2000);
            return times >= 3 ? null : delay; // Stop retrying after 3 attempts
        },
        maxRetriesPerRequest: 1,
        connectTimeout: 10000, // 10 second timeout
    });

    redisClient.on("connect", () => {
        console.log(
            "\x1b[32m%s\x1b[0m",
            "✅ Connected to Redis at " + process.env.REDIS_HOST
        );
    });

    redisClient.on("error", (err) => {
        console.error(
            "\x1b[31m%s\x1b[0m",
            "❌ Redis connection error:",
            err.message
        );
        console.log(
            "\x1b[33m%s\x1b[0m",
            "⚠️ Make sure Redis is running on " +
                process.env.REDIS_HOST +
                ":" +
                process.env.REDIS_PORT
        );
    });
} catch (error) {
    console.log(
        "\x1b[31m%s\x1b[0m",
        "❌ Redis initialization failed:",
        error.message
    );
    redisClient = {
        status: "failed",
        get: async () => null,
        set: async () => null,
    };
}

export const updatePostsCache = async (posts = null) => {
    if (redisClient.status !== "ready") {
        console.log(
            "\x1b[33m%s\x1b[0m",
            "⚠️ Redis not ready, skipping cache update"
        );
        return false;
    }

    try {
        let postsToCache;
        if (!posts) {
            const { Post } = await import("../models/post.js");
            postsToCache = await Post.find().sort({ timestamp: -1 });
        } else {
            postsToCache = posts;
        }

        await redisClient.set(
            "allPosts",
            JSON.stringify(postsToCache),
            "EX",
            600
        );
        console.log(
            "\x1b[32m%s\x1b[0m",
            `✅ Posts cache updated with ${postsToCache.length} posts`
        );
        return true;
    } catch (error) {
        console.error(
            "\x1b[31m%s\x1b[0m",
            "❌ Error updating posts cache:",
            error
        );
        return false;
    }
};

export default redisClient;
