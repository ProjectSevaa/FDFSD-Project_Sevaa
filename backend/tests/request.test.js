import request from "supertest";
import app from "../app.js";
import { Request } from "../models/request.js";

describe("Request Routes", () => {
    beforeAll(async () => {
        await Request.deleteMany({});
    });

    describe("GET /request/getRequests", () => {
        it("should get user requests", async () => {
            const response = await request(app)
                .get("/request/getRequests")
                .set("Cookie", ["user_jwt=testToken"]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("success", true);
        });
    });
});
