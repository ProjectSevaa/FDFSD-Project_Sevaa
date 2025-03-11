import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Donor",
        required: false,
    },
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        validate: {
            validator: function (v) {
                return !isNaN(v) && v >= 0 && v <= 5;
            },
            message: (props) => `${props.value} is not a valid rating value!`,
        },
    },
    comment: {
        type: String,
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create indexes for faster queries
ratingSchema.index({ userId: 1 });
ratingSchema.index({ donorId: 1 });

export const Rating = mongoose.model("Rating", ratingSchema);
