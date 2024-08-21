import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    mobileNumber: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    role: { 
        type: String, 
        required: true,
        enum: ['moderator', 'admin', 'superuser']
    }
});

export const User = mongoose.model("User", userSchema);
