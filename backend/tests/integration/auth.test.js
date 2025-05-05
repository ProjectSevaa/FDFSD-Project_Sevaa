import request from "supertest";
import app from "../../app.js";
import { User } from "../../models/user.js";
import { Donor } from "../../models/donor.js";
import { DeliveryBoy } from "../../models/deliveryboy.js";
import { setupTestDB, teardownTestDB } from '../setup.js';

describe("Authentication Integration Tests", () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    describe("User Authentication", () => {
        const testUser = {
            username: "testuser",
            email: "testuser@example.com",
            password: "Test@123",
            mobileNumber: "9876543210",
            address: {
                doorNo: "123",
                street: "Test St",
                townCity: "Test City",
                state: "Test State",
                pincode: "123456"
            }
        };

        it("should prevent duplicate email registration", async () => {
            await request(app).post("/auth/userSignup").send(testUser);
            const response = await request(app).post("/auth/userSignup").send(testUser);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("User already exists");
        });

        it("should handle concurrent login attempts", async () => {
            const loginAttempts = Array(5).fill().map(() => 
                request(app)
                    .post("/auth/userLogin")
                    .send({
                        email: testUser.email,
                        password: testUser.password
                    })
            );
            const responses = await Promise.all(loginAttempts);
            responses.forEach(response => {
                expect(response.status).toBe(200);
            });
        });
    });

    describe("Donor Authentication", () => {
        it("should validate email domain for donors", async () => {
            const invalidEmails = [
                "donor@gmail.com",
                "donor@yahoo.com",
                "donor@hotmail.com"
            ];
            const responses = await Promise.all(
                invalidEmails.map(email => 
                    request(app)
                        .post("/auth/donorSignup")
                        .send({
                            username: "testdonor",
                            email: email,
                            password: "Donor@123",
                            mobileNumber: "8765432109",
                            address: {
                                doorNo: "456",
                                street: "Donor St",
                                townCity: "Donor City",
                                state: "Donor State",
                                pincode: "654321"
                            }
                        })
                )
            );
            responses.forEach(response => {
                expect(response.status).not.toBe(201);
            });
        });
    });

    describe("DeliveryBoy Authentication", () => {
        const testDeliveryBoy = {
            deliveryBoyName: "testdelivery",
            mobileNumber: "7654321098",
            password: "Delivery@123",
            vehicleNo: "TEST123",
            drivingLicenseNo: "DL123456",
            currentLocation: {
                type: "Point",
                coordinates: [80.123, 16.456]
            }
        };

        it("should validate vehicle number format", async () => {
            const invalidVehicleNos = ["123", "TESTWITHOUTNUM", "12345", "@123"];
            const responses = await Promise.all(
                invalidVehicleNos.map(vehicleNo => 
                    request(app)
                        .post("/auth/delSignup")
                        .send({ ...testDeliveryBoy, vehicleNo })
                )
            );
            responses.forEach(response => {
                expect(response.status).toBe(400);
            });
        });

        it("should validate driving license format", async () => {
            const invalidLicenses = ["123", "INVALID", "SHORT", "NO-FORMAT"];
            const responses = await Promise.all(
                invalidLicenses.map(drivingLicenseNo => 
                    request(app)
                        .post("/auth/delSignup")
                        .send({ ...testDeliveryBoy, drivingLicenseNo })
                )
            );
            responses.forEach(response => {
                expect(response.status).toBe(400);
            });
        });

        it("should validate location coordinates", async () => {
            const invalidCoordinates = [
                [181, 91],
                [-181, -91],
                ["invalid", "coords"],
                [null, null]
            ];
            const responses = await Promise.all(
                invalidCoordinates.map(coordinates => 
                    request(app)
                        .post("/auth/delSignup")
                        .send({
                            ...testDeliveryBoy,
                            currentLocation: {
                                type: "Point",
                                coordinates
                            }
                        })
                )
            );
            responses.forEach(response => {
                expect(response.status).toBe(400);
            });
        });
    });
});
