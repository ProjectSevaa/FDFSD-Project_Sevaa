import request from "supertest";
import app from "../app.js";
import { Donor } from "../models/donor.js";
import { Post } from "../models/post.js";
import jwt from "jsonwebtoken";
import { setupTestDB, teardownTestDB } from './setup.js';

describe("Donor Routes", () => {
    let testToken;
    let testDonor;

    beforeAll(async () => {
        await setupTestDB();

        testDonor = await Donor.create({
            username: "testdonor",
            email: "testdonor@food.in",
            password: "Test@123",
            mobileNumber: "8765432109",
            address: {
                doorNo: "456",
                street: "Donor St",
                townCity: "Donor City",
                state: "Donor State",
                pincode: "654321"
            }
        });

        testToken = jwt.sign(
            { username: testDonor.username, role: "donor" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    describe("Post Management", () => {
        it("should create post with valid data", async () => {
            const response = await request(app)
                .post("/post/createPost")
                .set("Cookie", [`donor_jwt=${testToken}`])
                .send({
                    availableFood: ["Rice", "Dal"],
                    location: "Test Location",
                    currentlocation: {
                        type: "Point",
                        coordinates: [80.123, 16.456]
                    }
                });

            expect(response.status).toBe(201);
        });

        it("should get donor's posts", async () => {
            const response = await request(app)
                .get("/donor/getDonorPosts")
                .set("Cookie", [`donor_jwt=${testToken}`]);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe("Account Management", () => {
        it("should reject login with invalid email domain", async () => {
            const response = await request(app)
                .post("/auth/donorLogin")
                .send({
                    email: "donor@gmail.com",
                    password: "Test@123"
                });

            expect(response.status).toBe(400);
        });
    });
});
