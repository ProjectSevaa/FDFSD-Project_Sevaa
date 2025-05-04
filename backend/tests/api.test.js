import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";
import { Post } from "../models/post.js";
import { Request } from "../models/request.js";
import bcrypt from "bcrypt";
import { setupTestDB, teardownTestDB } from './setup.js';

describe("API Integration Tests", () => {
    let userToken;
    let donorToken;
    let postId;
    let requestId;

    beforeAll(async () => {
        await setupTestDB();

        // Clean up collections
        await User.deleteMany({});
        await Donor.deleteMany({});
        await Post.deleteMany({});
        await Request.deleteMany({});

        // Create test accounts with hashed passwords
        const hashedPassword = await bcrypt.hash("Test@123", 10);

        // Create test user
        const user = await User.create({
            username: "testuser",
            email: "testuser@example.com",
            password: hashedPassword,
            mobileNumber: "9876543210", // Valid format
            address: {
                doorNo: "123",
                street: "Main St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] },
            },
        });

        // Create test donor
        const donor = await Donor.create({
            username: "testdonor",
            email: "testdonor@example.com",
            password: hashedPassword,
            mobileNumber: "8765432109", // Valid format
            address: {
                doorNo: "456",
                street: "Second St",
                townCity: "Donor City",
                state: "Donor State",
                pincode: "654321",
                coordinates: { type: "Point", coordinates: [80.456, 16.789] },
            },
        });

        // Generate test tokens
        userToken = jwt.sign(
            { username: user.username, role: "user" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );

        donorToken = jwt.sign(
            { username: donor.username, role: "donor" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    describe("Authentication", () => {
        it("should login existing user", async () => {
            const response = await request(app)
                .post("/auth/userLogin")
                .send({
                    email: "testuser@example.com",
                    password: "Test@123"
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Login successful");
        });

        it("should reject invalid user credentials", async () => {
            const response = await request(app)
                .post("/auth/userLogin")
                .send({
                    email: "testuser@example.com",
                    password: "wrongpassword"
                });

            expect(response.status).toBe(401);
        });
    });

    describe("Post Operations", () => {
        it("should create a new post as donor", async () => {
            const response = await request(app)
                .post("/post/createPost")
                .set("Cookie", [`donor_jwt=${donorToken}`])
                .send({
                    availableFood: ["Rice", "Vegetables"],
                    location: "Donor Location",
                    currentlocation: {
                        type: "Point",
                        coordinates: [78.456, 17.789],
                    },
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            postId = response.body.post._id;
        });

        it("should get all posts", async () => {
            const response = await request(app)
                .get("/post/getAllPosts");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
            expect(Array.isArray(response.body.posts)).toBe(true);
        });
    });

    describe("Request Operations", () => {
        it("should create a new request", async () => {
            const response = await request(app)
                .post("/request/addRequest")
                .set("Cookie", [`user_jwt=${userToken}`])
                .send({
                    donorUsername: "testdonor",
                    userUsername: "testuser",
                    availableFood: ["Rice", "Vegetables"],
                    location: "Donor Location",
                    post_id: postId,
                });

            expect(response.status).toBe(201);
            requestId = response.body.request._id;
        });

        it("should get user's requests", async () => {
            const response = await request(app)
                .get("/request/getRequests?donor=testdonor")
                .set("Cookie", [`user_jwt=${userToken}`]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
        });
    });
});
