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

// Add indexes for better query performance
donorSchema.index({ username: 1 }, { unique: true }); // For username lookups
donorSchema.index({ email: 1 }, { unique: true }); // For email lookups
donorSchema.index({ mobileNumber: 1 }); // For mobile number lookups
donorSchema.index({ isBanned: 1 }); // For filtering banned donors
donorSchema.index({ rating: -1 }); // For sorting by rating
donorSchema.index({ donationsCount: -1 }); // For sorting by donation count
donorSchema.index({ "address.pincode": 1 }); // For location-based queries
donorSchema.index({ rating: -1, donationsCount: -1 }); // Compound index for top donors

export const Donor = mongoose.model('Donor', donorSchema);
