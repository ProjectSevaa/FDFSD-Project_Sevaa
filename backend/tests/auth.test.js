import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";
import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";
import bcrypt from "bcrypt";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    // Create existing test users
    const hashedPassword = await bcrypt.hash("Final@123", 10);

    await User.create({
        email: "finaluser1@gmail.com",
        password: hashedPassword,
        username: "finaluser1",
        mobileNumber: "1234567890",
        address: "Test Address",
    });

    await Donor.create({
        email: "finaldonor1@food.in",
        password: hashedPassword,
        username: "finaldonor1",
        mobileNumber: "1234567890",
        address: "Test Address",
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Authentication Tests", () => {
    describe("User Authentication", () => {
        test("should login existing user", async () => {
            const response = await request(app).post("/auth/userLogin").send({
                email: "finaluser1@gmail.com",
                password: "Final@123",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Login successful");
            expect(response.body).toHaveProperty(
                "redirectTo",
                "/user/user_homepage"
            );
        });

        test("should signup new user", async () => {
            const newUser = {
                username: "testuser2",
                mobileNumber: "9876543210",
                email: "testuser2@gmail.com",
                password: "Test@123",
                address: "Test Address 2",
            };

            const response = await request(app)
                .post("/auth/userSignup")
                .send(newUser);

            expect(response.status).toBe(302); // Redirect status
            expect(response.header.location).toBe("/u_login");
        });

        test("should reject duplicate user signup", async () => {
            const duplicateUser = {
                username: "finaluser1",
                mobileNumber: "1234567890",
                email: "finaluser1@gmail.com",
                password: "Final@123",
                address: "Test Address",
            };

            const response = await request(app)
                .post("/auth/userSignup")
                .send(duplicateUser);

            expect(response.status).toBe(400);
        });
    });

    describe("Donor Authentication", () => {
        test("should login existing donor", async () => {
            const response = await request(app).post("/auth/donorLogin").send({
                email: "finaldonor1@food.in",
                password: "Final@123",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Login successful");
            expect(response.body).toHaveProperty(
                "redirectTo",
                "/donor/donor_homepage"
            );
        });

        test("should signup new donor", async () => {
            const newDonor = {
                username: "testdonor2",
                mobileNumber: "9876543211",
                email: "testdonor2@food.in",
                password: "Test@123",
                address: "Test Address 3",
            };

            const response = await request(app)
                .post("/auth/donorSignup")
                .send(newDonor);

            expect(response.status).toBe(302); // Redirect status
            expect(response.header.location).toBe("/d_login");
        });
    });

    describe("Authentication Failures", () => {
        test("should reject invalid user login credentials", async () => {
            const response = await request(app).post("/auth/userLogin").send({
                email: "finaluser1@gmail.com",
                password: "wrongpassword",
            });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("success", false);
        });

        test("should reject invalid donor login credentials", async () => {
            const response = await request(app).post("/auth/donorLogin").send({
                email: "finaldonor1@food.in",
                password: "wrongpassword",
            });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty("success", false);
        });

        test("should require all fields for user signup", async () => {
            const incompleteUser = {
                username: "incomplete",
                email: "incomplete@test.com",
            };

            const response = await request(app)
                .post("/auth/userSignup")
                .send(incompleteUser);

            expect(response.status).toBe(500);
        });
    });
});
