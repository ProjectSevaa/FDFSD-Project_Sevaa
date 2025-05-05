import { User } from '../../models/user.js';
import { DeliveryBoy } from '../../models/deliveryboy.js';
import { setupTestDB, teardownTestDB } from '../setup.js';

describe('Model Interactions Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    describe('User-DeliveryBoy Interactions', () => {
        it('should handle multiple delivery boy assignments', async () => {
            const user = await User.create({
                username: "multidb_user",
                email: "multidb@example.com",
                password: "Test@123",
                mobileNumber: "9876543210",
                address: {
                    doorNo: "123",
                    street: "Test St",
                    townCity: "Test City",
                    state: "Test State",
                    pincode: "123456"
                }
            });

            const deliveryBoys = await Promise.all([1, 2, 3].map(i => 
                DeliveryBoy.create({
                    deliveryBoyName: `testboy${i}`,
                    mobileNumber: `987654321${i}`,
                    password: "Test@123",
                    vehicleNo: `KA01AB${i}234`,
                    drivingLicenseNo: `DL12345${i}`,
                    currentLocation: {
                        type: "Point",
                        coordinates: [80.123, 16.456]
                    }
                })
            ));

            user.deliveryBoys = deliveryBoys.map(db => db._id);
            await user.save();

            expect(user.registeredDeliveryBoysCount).toBe(3);
        });
    });
});
