import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, 
    address: {
        doorNo: { type: String, required: true },
        street: { type: String, required: true }, 
        landmarks: { type: String }, 
        townCity: { type: String, required: true }, 
        state: { type: String, required: true }, 
        pincode: { type: String, required: true } 
    },
    mobileNumber: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
});

export const User = mongoose.model("User", userSchema);
