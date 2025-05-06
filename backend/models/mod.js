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
    },
    isBanned: { type: Boolean, default: false }
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

// Add indexes for better query performance
modSchema.index({ username: 1 }, { unique: true }); // For username lookups
modSchema.index({ email: 1 }, { unique: true }); // For email lookups
modSchema.index({ mobileNumber: 1 }); // For mobile number lookups
modSchema.index({ role: 1 }); // For filtering by role
modSchema.index({ isBanned: 1 }); // For filtering banned moderators
modSchema.index({ role: 1, isBanned: 1 }); // Compound index for role and ban status
modSchema.index({ createdAt: -1 }); // For sorting by registration date

export const Mod = mongoose.model("Mod", modSchema);
