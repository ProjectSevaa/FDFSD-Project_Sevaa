import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js"; // Changed from import { app } to import app
import { Post } from "../models/post.js";
import { Donor } from "../models/donor.js"; // Added import
import jwt from "jsonwebtoken"; // Added for token creation

describe("Post Routes", () => {
    let mongoServer;
    let testToken;

    beforeAll(async () => {
        // Create MongoDB memory server
        mongoServer = await MongoMemoryServer.create();

        // Clean up posts collection
        await Post.deleteMany({});
        await Donor.create({
            username: "testdonor",
            email: "testdonor@example.com",
            password: "password123",
            mobileNumber: "1234567890",
            address: {
                doorNo: "456",
                street: "Second St",
                townCity: "Donor City",
                state: "Donor State",
                pincode: "654321",
                coordinates: { type: "Point", coordinates: [80.456, 16.789] },
            },
        });

        // Create test token for donor
        testToken = jwt.sign(
            { username: "testdonor", role: "donor" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    afterEach(async () => {
        // Clean up after each test
        await Post.deleteMany({});
    });

    afterAll(async () => {
        // Cleanup
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    describe("POST /post/createPost", () => {
        it("should create a new post", async () => {
            const response = await request(app)
                .post("/post/createPost")
                .set("Cookie", [`donor_jwt=${testToken}`])
                .send({
                    availableFood: ["Rice", "Curry"],
                    location: "Test Location",
                    currentlocation: {
                        type: "Point",
                        coordinates: [80.123, 16.456],
                    },
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("success", true);
            expect(response.body.post).toHaveProperty(
                "donorUsername",
                "testdonor"
            );
            expect(response.body.post.availableFood).toContain("Rice");
        });

        it("should reject request without authentication", async () => {
            const response = await request(app)
                .post("/post/createPost")
                .send({
                    availableFood: ["Rice"],
                    location: "Test Location",
                    currentlocation: {
                        type: "Point",
                        coordinates: [80.123, 16.456],
                    },
                });

            expect(response.status).toBe(401);
        });
    });
});
