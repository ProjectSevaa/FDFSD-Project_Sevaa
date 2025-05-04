import request from "supertest";
import app from "../app.js";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";
import { Post } from "../models/post.js";
import { Request } from "../models/request.js";
import bcrypt from "bcrypt";

describe("API Integration Tests", () => {
    let mongoServer;
    let userToken;
    let donorToken;
    let postId;
    let requestId;

    beforeAll(async () => {
        // Setup MongoDB memory server
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        // Clean up collections
        await User.deleteMany({});
        await Donor.deleteMany({});
        await Post.deleteMany({});
        await Request.deleteMany({});

        // Create test accounts with hashed passwords
        const hashedPassword = await bcrypt.hash("TestPass123", 10);

        await User.create({
            username: "testuser",
            email: "testuser@example.com",
            password: hashedPassword,
            mobileNumber: "1234567890",
            address: {
                doorNo: "123",
                street: "Main St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] },
            },
        });

        await Donor.create({
            username: "testdonor",
            email: "testdonor@example.com",
            password: hashedPassword,
            mobileNumber: "0987654321",
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
            { username: "testuser", role: "user" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );

        donorToken = jwt.sign(
            { username: "testdonor", role: "donor" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe("Authentication", () => {
        it("should login existing user", async () => {
            const response = await request(app).post("/auth/userLogin").send({
                email: "testuser@example.com",
                password: "TestPass123",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Login successful");
        });

        it("should reject invalid user credentials", async () => {
            const response = await request(app).post("/auth/userLogin").send({
                email: "testuser@example.com",
                password: "WrongPassword",
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

            // Save postId for later tests
            postId = response.body.post._id;
        });

        it("should get all posts", async () => {
            const response = await request(app).get("/post/getAllPosts");

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
