import mongoose from "mongoose";
import { connectDB } from "../db/connectDB.js";
import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";
import { DeliveryBoy } from "../models/deliveryboy.js";
import { Mod } from "../models/mod.js";
import { Post } from "../models/post.js";
import { Order } from "../models/order.js";
import { Request } from "../models/request.js";

async function checkAllIndexes() {
    try {
        // Connect to database
        await connectDB();
        console.log("\n=== Checking All Database Indexes ===\n");

        // Check User indexes
        console.log("👤 User Collection Indexes:");
        const userIndexes = await User.collection.indexes();
        console.log(JSON.stringify(userIndexes, null, 2));

        // Check Donor indexes
        console.log("\n🎁 Donor Collection Indexes:");
        const donorIndexes = await Donor.collection.indexes();
        console.log(JSON.stringify(donorIndexes, null, 2));

        // Check DeliveryBoy indexes
        console.log("\n🚚 DeliveryBoy Collection Indexes:");
        const deliveryBoyIndexes = await DeliveryBoy.collection.indexes();
        console.log(JSON.stringify(deliveryBoyIndexes, null, 2));

        // Check Mod indexes
        console.log("\n👮 Mod Collection Indexes:");
        const modIndexes = await Mod.collection.indexes();
        console.log(JSON.stringify(modIndexes, null, 2));

        // Check Post indexes
        console.log("\n📝 Post Collection Indexes:");
        const postIndexes = await Post.collection.indexes();
        console.log(JSON.stringify(postIndexes, null, 2));

        // Check Order indexes
        console.log("\n📦 Order Collection Indexes:");
        const orderIndexes = await Order.collection.indexes();
        console.log(JSON.stringify(orderIndexes, null, 2));

        // Check Request indexes
        console.log("\n📨 Request Collection Indexes:");
        const requestIndexes = await Request.collection.indexes();
        console.log(JSON.stringify(requestIndexes, null, 2));

        // Disconnect from database
        await mongoose.disconnect();
        console.log("\n✅ All indexes check completed successfully");
    } catch (error) {
        console.error("❌ Error checking indexes:", error);
        process.exit(1);
    }
}

// Run the check
checkAllIndexes(); 