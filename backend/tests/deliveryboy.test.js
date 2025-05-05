/**
 * @jest-environment node
 */

import request from 'supertest';
import app from '../app.js';
import { DeliveryBoy } from '../models/deliveryboy.js';
import { User } from '../models/user.js';
import { Donor } from '../models/donor.js';
import { Order } from '../models/order.js';
import jwt from 'jsonwebtoken';

describe('DeliveryBoy Routes', () => {
    let testToken;
    let deliveryBoy;
    let donor;
    let user;
    let testOrder;

    beforeEach(async () => {
        // Create test user with valid credentials
        user = await User.create({
            username: 'testorderuser',
            email: 'testorderuser@example.com',
            password: 'Test@123',
            mobileNumber: '9876543210',
            address: {
                doorNo: '123',
                street: 'Test St',
                townCity: 'Test City',
                state: 'Test State',
                pincode: '123456',
                coordinates: { type: 'Point', coordinates: [80.123, 16.456] }
            }
        });

        // Create test donor with valid credentials
        donor = await Donor.create({
            username: 'testorderdonor',
            email: 'testorderdonor@example.com',
            password: 'Donor@123',
            mobileNumber: '8765432109',
            address: {
                doorNo: '456',
                street: 'Donor St',
                townCity: 'Donor City',
                state: 'Donor State',
                pincode: '654321'
            }
        });

        // Create test delivery boy with valid credentials
        deliveryBoy = await DeliveryBoy.create({
            deliveryBoyName: 'testorderdeliveryboy',
            mobileNumber: '7654321098',
            password: 'Delivery@123',
            vehicleNo: 'TEST123',
            drivingLicenseNo: 'DL123456',
            currentLocation: {
                type: 'Point',
                coordinates: [80.123, 16.456]
            },
            status: 'available'
        });

        // Create test order
        testOrder = await Order.create({
            donorUsername: donor.username,
            userUsername: user.username,
            deliveryBoy: deliveryBoy._id,
            deliveryBoyName: deliveryBoy.deliveryBoyName,
            status: 'on-going',
            pickupLocation: 'Test Location',
            pickupLocationCoordinates: {
                type: 'Point',
                coordinates: [80.123, 16.456]
            }
        });

        // Create auth token
        testToken = jwt.sign(
            { username: deliveryBoy.deliveryBoyName, role: 'deliveryboy' },
            process.env.JWT_SECRET_KEY || 'testsecretkey',
            { expiresIn: '1h' }
        );
    });

    describe('GET /deliveryboy/getDeliveryBoyDashboard', () => {
        it('should get delivery boy dashboard data', async () => {
            // Create some test orders for this delivery boy
            await Order.create({
                donorUsername: 'testdonor',
                userUsername: 'testuser',
                deliveryBoy: deliveryBoy._id,
                deliveryBoyName: 'testdeliveryboy',
                status: 'on-going'
            });

            const response = await request(app)
                .get('/deliveryboy/getDeliveryBoyDashboard')
                .set('Cookie', [`deliveryboy_jwt=${testToken}`]);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.deliveryboy).toBeDefined();
            expect(response.body.orders).toBeDefined();
            expect(response.body.stats).toBeDefined();
        });

        it('should return 401 without auth token', async () => {
            const response = await request(app)
                .get('/deliveryboy/getDeliveryBoyDashboard');

            expect(response.status).toBe(401);
        });
    });

    describe('PATCH /deliveryboy/toggle-status/:id', () => {
        it('should toggle delivery boy status', async () => {
            const response = await request(app)
                .patch(`/deliveryboy/toggle-status/${deliveryBoy._id}`)
                .set('Cookie', [`deliveryboy_jwt=${testToken}`])
                .send({ status: 'inactive' });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.deliveryBoy.status).toBe('inactive');
        });

        it('should reject invalid status', async () => {
            const response = await request(app)
                .patch(`/deliveryboy/toggle-status/${deliveryBoy._id}`)
                .set('Cookie', [`deliveryboy_jwt=${testToken}`])
                .send({ status: 'invalid_status' });

            expect(response.status).toBe(400);
        });

        it('should reject unauthorized access', async () => {
            const wrongToken = jwt.sign(
                { username: 'wronguser', role: 'deliveryboy' },
                process.env.JWT_SECRET_KEY || 'testsecretkey'
            );

            const response = await request(app)
                .patch(`/deliveryboy/toggle-status/${deliveryBoy._id}`)
                .set('Cookie', [`deliveryboy_jwt=${wrongToken}`])
                .send({ status: 'inactive' });

            expect(response.status).toBe(403);
        });
    });

    describe("Delivery Boy Management", () => {
        it("should verify delivery boy exists before updates", async () => {
            const nonExistentId = "507f1f77bcf86cd799439011";
            const response = await request(app)
                .patch(`/deliveryboy/toggle-status/${nonExistentId}`)
                .set("Cookie", [`deliveryboy_jwt=${testToken}`])
                .send({ status: "inactive" });

            expect(response.status).toBe(404);
        });
    });
});
