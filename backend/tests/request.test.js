import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import { Request } from "../models/request.js";
import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import { Donor } from "../models/donor.js";
import jwt from "jsonwebtoken";
import { clearCollections } from './setup.js';

describe("Request Routes", () => {
    let testToken;
    let testPost;
    let donor;
    let user;

    beforeEach(async () => {
        // Clear all collections before each test
        await clearCollections();

        // Create test donor first
        donor = await Donor.create({
            username: 'testdonor',
            email: 'testdonor@example.com',
            password: 'Donor@123', // Valid password format
            mobileNumber: '8765432109', // Valid mobile number format
            address: {
                doorNo: '456',
                street: 'Donor St',
                townCity: 'Donor City',
                state: 'Donor State',
                pincode: '654321'
            }
        });

        // Create test user
        user = await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: 'Test@123', // Valid password format
            mobileNumber: '9876543210', // Valid mobile number format
            address: {
                doorNo: '123',
                street: 'Test St',
                townCity: 'Test City',
                state: 'Test State',
                pincode: '123456',
                coordinates: { type: 'Point', coordinates: [80.123, 16.456] }
            }
        });

        // Create test post
        testPost = await Post.create({
            donorUsername: donor.username,
            availableFood: ["Test Food"],
            location: "Test Location",
            currentlocation: {
                type: "Point",
                coordinates: [80.123, 16.456],
            }
        });

        // Create test token for user
        testToken = jwt.sign(
            { username: user.username, role: "user" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    describe("GET /request/getRequests", () => {
        it("should get user requests", async () => {
            // Create a test request first
            await Request.create({
                donorUsername: donor.username,
                userUsername: user.username,
                location: "Test Location",
                availableFood: ["Test Food"],
                post_id: testPost._id,
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
            const response = await request(app)
                .get("/request/getRequests?donor=testdonor");

            expect(response.status).toBe(401);
        });
    });

    describe("POST /request/addRequest", () => {
        it("should create a new request", async () => {
            const newRequest = {
                donorUsername: donor.username,
                userUsername: user.username,
                location: "New Test Location",
                availableFood: ["New Test Food"],
                post_id: testPost._id
            };

            const response = await request(app)
                .post("/request/addRequest")
                .set("Cookie", [`user_jwt=${testToken}`])
                .send(newRequest);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "Request created successfully");
            expect(response.body.request).toHaveProperty("donorUsername", donor.username);
        });

        it("should reject request without required fields", async () => {
            const invalidRequest = {
                userUsername: user.username
            };

            const response = await request(app)
                .post("/request/addRequest")
                .set("Cookie", [`user_jwt=${testToken}`])
                .send(invalidRequest);

            expect(response.status).toBe(400);
        });
    });

    afterEach(async () => {
        // Clean up after each test
        await clearCollections();
    });
});
