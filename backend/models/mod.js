import mongoose from "mongoose";
import bcrypt from "bcrypt";

const modSchema = new mongoose.Schema({
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


modSchema.pre('save', async function (next) {
    const mod = this;
    if (!mod.isModified('password')) return next();
    try {
        const hashedPassword = await bcrypt.hash(mod.password, 10);
        mod.password = hashedPassword;
        next();
    } catch (error) {
        return next(error);
    }
});

export const User = mongoose.model("Mod", modSchema);
