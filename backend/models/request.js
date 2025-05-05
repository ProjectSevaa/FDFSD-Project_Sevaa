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

requestSchema.index({ donorUsername: 1, userUsername: 1 });
requestSchema.index({ post_id: 1 });
requestSchema.index({ timestamp: -1 });
requestSchema.index({ isAccepted: 1 });
requestSchema.index({ deliveryAssigned: 1 });
requestSchema.index({ isRejected: 1 });

export const Request = mongoose.model("Request", requestSchema);
