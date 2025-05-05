import request from "supertest";
import app from "../app.js";
import { DeliveryBoy } from "../models/deliveryboy.js";
import jwt from "jsonwebtoken";
import { setupTestDB, teardownTestDB } from './setup.js';

describe("Delivery System", () => {
    let deliveryBoyToken;
    let testDeliveryBoy;

    beforeAll(async () => {
        await setupTestDB();

        testDeliveryBoy = await DeliveryBoy.create({
            deliveryBoyName: "testdelivery",
            mobileNumber: "7654321098",
            password: "Delivery@123",
            vehicleNo: "TEST123",
            drivingLicenseNo: "DL123456",
            currentLocation: {
                type: "Point",
                coordinates: [80.123, 16.456]
            },
            status: "available"
        });

        deliveryBoyToken = jwt.sign(
            { username: testDeliveryBoy.deliveryBoyName, role: "deliveryboy" },
            process.env.JWT_SECRET_KEY || "testsecretkey",
            { expiresIn: "1h" }
        );
    });

    describe("Authentication", () => {
        it("should reject invalid tokens", async () => {
            const response = await request(app)
                .get("/deliveryboy/getDeliveryBoyDashboard")
                .set("Cookie", ["deliveryboy_jwt=invalid_token"]);

            expect(response.status).toBe(401);
        });
    });

    afterAll(async () => {
        await teardownTestDB();
    });
});
