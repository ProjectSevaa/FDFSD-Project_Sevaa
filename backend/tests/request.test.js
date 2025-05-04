import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js"; // Changed from import { app } to import app
import { Request } from "../models/request.js";
import { User } from "../models/user.js"; // Added import
import { Post } from "../models/post.js"; // Added import
import jwt from "jsonwebtoken"; // Added for token creation

describe("Request Routes", () => {
    let mongoServer;
    let testToken;
    let testPostId;

    beforeAll(async () => {
        // Create MongoDB memory server
        mongoServer = await MongoMemoryServer.create();

        // Clean up requests collection
        await Request.deleteMany({});

        // Create test user
        await User.create({
            username: "testuser",
            mobileNumber: "1234567890",
            email: "test@example.com",
            password: "password123",
            address: {
                doorNo: "123",
                street: "Main St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] },
            },
        });

        // Create test post
        const post = new Post({
            donorUsername: "testdonor",
            availableFood: ["Test Food"],
            location: "Test Location",
            currentlocation: {
                type: "Point",
                coordinates: [80.123, 16.456],
            },
        });
        await post.save();
        testPostId = post._id.toString();

        // Create test token
        testToken = jwt.sign(
            { username: "testuser", role: "user" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    afterEach(async () => {
        // Clean up after each test
        await Request.deleteMany({});
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe("GET /request/getRequests", () => {
        it("should get user requests", async () => {
            // First create a test request
            await Request.create({
                donorUsername: "testdonor",
                userUsername: "testuser",
                location: "Test Location",
                availableFood: ["Test Food"],
                post_id: testPostId,
            });

            const response = await request(app)
                .get("/request/getRequests?donor=testdonor")
                .set("Cookie", [`user_jwt=${testToken}`]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(Array.isArray(response.body.requests)).toBe(true);
            expect(response.body.requests.length).toBeGreaterThan(0);
        });

        it("should reject request without authentication", async () => {
            const response = await request(app).get(
                "/request/getRequests?donor=testdonor"
            );

            expect(response.status).toBe(401);
        });
    });
});
