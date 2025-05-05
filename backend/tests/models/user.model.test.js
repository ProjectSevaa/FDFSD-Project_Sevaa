import { User } from '../../models/user.js';
import { setupTestDB, teardownTestDB } from '../setup.js';
import mongoose from 'mongoose';

describe('User Model Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('should validate required fields', async () => {
        const userWithoutRequired = new User({});
        const validateError = userWithoutRequired.validateSync();
        expect(validateError.errors.username).toBeDefined();
        expect(validateError.errors.email).toBeDefined();
        expect(validateError.errors.password).toBeDefined();
    });

    it('should calculate registeredDeliveryBoysCount correctly', async () => {
        const user = new User({
            username: "testuser2",
            email: "test2@example.com",
            password: "Test@123",
            mobileNumber: "9876543211",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] }
            },
            deliveryBoys: [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
            ]
        });

        await user.save();
        expect(user.registeredDeliveryBoysCount).toBe(2);
    });

    it('should hash password before saving', async () => {
        const user = await User.create({
            username: "testuser3",
            email: "test3@example.com",
            password: "Test@123",
            mobileNumber: "9876543212",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] }
            }
        });

        expect(user.password).not.toBe("Test@123");
        expect(user.password).toHaveLength(60);
    });

    it('should initialize counters with zero', async () => {
        const user = await User.create({
            username: "testuser4",
            email: "test4@example.com",
            password: "Test@123",
            mobileNumber: "9876543213",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] }
            }
        });

        expect(user.donorOrdersCount).toBe(0);
        expect(user.deliveredOrdersCount).toBe(0);
        expect(user.registeredDeliveryBoysCount).toBe(0);
        expect(user.rating).toBe(0);
    });

    it('should validate rating range', async () => {
        const user = new User({
            username: "testuser5",
            email: "test5@example.com",
            password: "Test@123",
            mobileNumber: "9876543214",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] }
            }
        });

        user.rating = 5.1;
        await expect(user.validate()).rejects.toThrow();
    });

    it('should handle address updates', async () => {
        const user = await User.create({
            username: "testuser6",
            email: "test6@example.com",
            password: "Test@123",
            mobileNumber: "9876543215",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] }
            }
        });

        user.address.doorNo = "456";
        user.address.coordinates.coordinates = [81.123, 17.456];
        await user.save();

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.address.doorNo).toBe("456");
        expect(updatedUser.address.coordinates.coordinates).toEqual([81.123, 17.456]);
    });
});
