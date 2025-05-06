import { User } from '../../models/user.js';
import { setupTestDB, teardownTestDB } from '../setup.js';

describe('Concurrency Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('should handle concurrent user updates', async () => {
        const user = await User.create({
            username: "concurrentuser",
            email: "concurrent@example.com",
            password: "Test@123",
            mobileNumber: "9876543210",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: {
                    type: "Point",
                    coordinates: [80.123, 16.456]
                }
            }
        });

        const updatePromises = Array(5).fill().map((_, i) => 
            User.findByIdAndUpdate(
                user._id,
                { $inc: { donorOrdersCount: 1 } },
                { new: true }
            )
        );

        await Promise.all(updatePromises);

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.donorOrdersCount).toBe(5);
    });
});
