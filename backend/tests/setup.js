import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

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

// Setup for Jest
beforeAll(async () => {
    await setupTestDB();
});

afterAll(async () => {
    await teardownTestDB();
});
