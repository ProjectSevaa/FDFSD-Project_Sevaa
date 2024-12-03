import 'dotenv/config';
import mongoose from "mongoose";
import { recalculateAllRatings } from '../controllers/ratingController.js'; 

const url = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/SEVaa";

export async function connectDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
    
    
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
