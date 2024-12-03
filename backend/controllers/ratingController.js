import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";

// Recalculate ratings for all users
export const recalculateUserRatings = async () => {
  try {
    const users = await User.find();

    for (const user of users) {
      await user.updateRating();
    }

  } catch (error) {
    console.error("Error recalculating user ratings:", error);
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
  await recalculateUserRatings();
  await recalculateDonorRatings();
};
