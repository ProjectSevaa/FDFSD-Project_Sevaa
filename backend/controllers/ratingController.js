import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";
import { Rating } from "../models/rating.js";

// Recalculate ratings for all users
export const recalculateUserRatings = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            console.warn(`User not found: ${userId}`);
            return;
        }

        // Get all ratings for this user
        const ratings = await Rating.find({ userId });

        // Update the user's rating (the method now handles empty ratings)
        user.updateRating(ratings);

        await user.save();
        console.log(`Updated rating for user ${userId}: ${user.rating}`);
    } catch (error) {
        console.warn("Error recalculating user ratings:", error);
    }
};

// Recalculate ratings for all donors
export const recalculateDonorRatings = async () => {
    try {
        const donors = await Donor.find();

        for (const donor of donors) {
            // Calculate and update rating
            await donor.updateRating();
        }
    } catch (error) {
        console.error("Error recalculating donor ratings:", error);
    }
};

// Function to trigger the recalculation for both users and donors
export const recalculateAllRatings = async () => {
    try {
        // Get all users and recalculate their ratings
        const users = await User.find();
        for (const user of users) {
            await recalculateUserRatings(user._id);
        }

        // Recalculate donor ratings
        await recalculateDonorRatings();
    } catch (error) {
        console.error("Error in recalculateAllRatings:", error);
    }
};
