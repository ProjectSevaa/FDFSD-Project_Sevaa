import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const donorSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  address: {
    doorNo: { type: String, required: true },
    street: { type: String, required: true },
    landmarks: { type: String },
    townCity: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
  },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isBanned: { type: Boolean, default: false },
  donationsCount: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 }, // Store the rating directly
});

// Add these indexes after donorSchema definition
donorSchema.index({ username: 1 }, { unique: true });
donorSchema.index({ email: 1 }, { unique: true });
donorSchema.index({ mobileNumber: 1 });
donorSchema.index({ isBanned: 1 });
donorSchema.index({ rating: -1 });
donorSchema.index({ donationsCount: -1 });

// Pre-save hook to hash the password
donorSchema.pre('save', async function (next) {
  const donor = this;
  if (!donor.isModified('password')) return next();
  try {
    const hashedPassword = await bcrypt.hash(donor.password, 10);
    donor.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

export const Donor = mongoose.model('Donor', donorSchema);
