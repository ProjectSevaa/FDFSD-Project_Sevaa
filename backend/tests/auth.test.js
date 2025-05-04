import request from "supertest";
import app from "../app.js";
import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";

describe("Auth Routes", () => {
    beforeAll(async () => {
        await User.deleteMany({});
        await Donor.deleteMany({});
    });

    describe("POST /auth/userLogin", () => {
        it("should login a valid user", async () => {
            const response = await request(app).post("/auth/userLogin").send({
                email: "test@example.com",
                password: "password123",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Login successful");
        });
    });
});
