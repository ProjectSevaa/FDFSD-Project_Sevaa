import request from "supertest";
import app from "../app.js";
import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { setupTestDB, teardownTestDB } from './setup.js';

describe("User Routes", () => {
    let testToken;
    let testUser;

    beforeAll(async () => {
        await setupTestDB();

        testUser = await User.create({
            username: "testuser",
            email: "testuser@example.com",
            password: "Test@123",
            mobileNumber: "9876543210",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456",
                coordinates: { type: "Point", coordinates: [80.123, 16.456] }
            }
        });

        testToken = jwt.sign(
            { username: testUser.username, role: "user" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    describe("User Statistics", () => {
        it("should get user statistics", async () => {
            const response = await request(app)
                .get("/user/stats")
                .set("Cookie", [`user_jwt=${testToken}`]);

            expect(response.status).toBe(200);
            expect(response.body.stats).toHaveProperty("donorOrdersCount");
            expect(response.body.stats).toHaveProperty("deliveredOrdersCount");
            expect(response.body.stats).toHaveProperty("registeredDeliveryBoysCount");
            expect(response.body.stats).toHaveProperty("rating");
        });
    });

    // Optional: Add more working test cases here if needed
});
