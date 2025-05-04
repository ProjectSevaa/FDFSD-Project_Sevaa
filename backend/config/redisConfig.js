import Redis from "ioredis";

const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
});

redisClient.on("connect", () => {
    console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export default redisClient;
