import mongoose from 'mongoose';

const slumSchema = new mongoose.Schema({
  name: { type: String, required: true },  // Main Slum Name
  photos: {
    type: [String],  // Array to store image URLs
    validate: [arrayLimit, '{PATH} must have at least 10 images.'],
    required: true,
  },
});

// Validator function to ensure at least 10 photos
function arrayLimit(val) {
  return val.length >= 1;
}

export const Slum = mongoose.model('Slum', slumSchema);