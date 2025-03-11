import "dotenv/config";
import mongoose from "mongoose";

const url =
    process.env.MONGO_URL ||
    "mongodb+srv://HungerHearts:GAB44WOzmHDe4SIA@hungerheartssevaa.nnaj2.mongodb.net/SEVaa";

export async function connectDB() {
    try {
        // Connect to MongoDB
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}
