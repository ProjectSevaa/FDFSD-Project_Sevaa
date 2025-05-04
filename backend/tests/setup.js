import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from '../models/user.js';
import { Donor } from '../models/donor.js';
import { DeliveryBoy } from '../models/deliveryboy.js';

let mongoServer;

// Use this function to connect to the in-memory database
export const setupTestDB = async () => {
    if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
    }
    // Disconnect any existing connection before connecting
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(mongoServer.getUri());
    console.log("Connected to test database");
};

// Add these lines before beforeAll
export const clearCollections = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
};

// Use this function to clean up and disconnect
export const teardownTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }

    if (mongoServer) {
        await mongoServer.stop();
        mongoServer = null;
        console.log("Disconnected from test database");
    }
};

export const setupTestUser = async () => {
    const user = await User.create({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'Test@123', // Meets password requirements
        mobileNumber: '9876543210', // Meets mobile number requirements
        address: {
            doorNo: '123',
            street: 'Test St',
            townCity: 'Test City',
            state: 'Test State',
            pincode: '123456',
            coordinates: { type: 'Point', coordinates: [80.123, 16.456] }
        }
    });
    return user;
};

export const setupTestDonor = async () => {
    const donor = await Donor.create({
        username: 'testdonor',
        email: 'testdonor@example.com',
        password: 'Donor@123', // Meets password requirements
        mobileNumber: '8765432109', // Meets mobile number requirements
        address: {
            doorNo: '123',
            street: 'Test St',
            townCity: 'Test City',
            state: 'Test State',
            pincode: '123456'
        }
    });
    return donor;
};

export const setupTestDeliveryBoy = async () => {
    const deliveryBoy = await DeliveryBoy.create({
        deliveryBoyName: 'testdeliveryboy',
        mobileNumber: '7654321098', // Meets mobile number requirements
        password: 'Delivery@123', // Meets password requirements
        vehicleNo: 'TEST123',
        drivingLicenseNo: 'DL123456',
        currentLocation: {
            type: 'Point',
            coordinates: [80.123, 16.456]
        },
        status: 'available'
    });
    return deliveryBoy;
};

export const setupTestData = async () => {
    await setupTestDonor();
    await setupTestUser();
    await setupTestDeliveryBoy();
};

// Setup for Jest
beforeAll(async () => {
    await setupTestDB();
});

beforeEach(async () => {
    await clearCollections();
    await setupTestData();
});

afterAll(async () => {
    await teardownTestDB();
});
