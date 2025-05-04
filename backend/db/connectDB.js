import "dotenv/config";
import mongoose from "mongoose";

const url =
    process.env.NODE_ENV === "test"
        ? "mongodb://localhost:27017/test-db" // This will be overridden by the in-memory server
        : process.env.MONGO_URL ||
          "mongodb+srv://HungerHearts:GAB44WOzmHDe4SIA@hungerheartssevaa.nnaj2.mongodb.net/SEVaa";

export async function connectDB() {
    // Skip connection in test environment as tests manage their own connections
    if (process.env.NODE_ENV === "test") return;

    try {
        // Connect to MongoDB
        await mongoose.connect(url, {
            useNewUrlParser: true,
        });
        console.log("MongoDB connected successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}
