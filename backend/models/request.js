import mongoose from "mongoose";
import { Donor } from './donor.js'; // Import Donor model
import { User } from './user.js'; // Import User model
import { Post } from './post.js';

const requestSchema = new mongoose.Schema({
    donorUsername: { 
        type: String, 
        ref: 'Donor', 
        required: true 
    },
    userUsername: { 
        type: String, 
        ref: 'User', 
        required: true 
    },
    location: { 
        type: String, 
        required: false  
    },
    availableFood: {
        type: [String], 
        required: true
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post', 
        required: false
    },
    timestamp: {
        type: Date, 
        default: Date.now 
    },
    isAccepted: {
        type: Boolean,
        default: false
    },
    isRejected: {
        type: Boolean,
        default: false
    },
    deliveryAssigned: {
        type: Boolean,
        default: false
    }
});

// Add indexes for better query performance
requestSchema.index({ isAccepted: 1, isRejected: 1 }); // For filtering requests by status
requestSchema.index({ timestamp: -1 }); // For sorting by timestamp
requestSchema.index({ donorUsername: 1, timestamp: -1 }); // For donor's request history
requestSchema.index({ userUsername: 1, timestamp: -1 }); // For user's request history
requestSchema.index({ isAccepted: 1, isRejected: 1, timestamp: -1 }); // Compound index for status and time

requestSchema.pre('save', async function (next) {
    try {
        const donorExists = await Donor.exists({ username: this.donorUsername });
        if (!donorExists) {
            throw new Error(`Donor with username ${this.donorUsername} does not exist`);
        }

        const userExists = await User.exists({ username: this.userUsername });
        if (!userExists) {
            throw new Error(`User with username ${this.userUsername} does not exist`);
        }

        next();
    } catch (error) {
        next(error);
    }
});

export const Request = mongoose.model("Request", requestSchema);
