import request from 'supertest';
import app from '../app.js';
import { Order } from '../models/order.js';
import { DeliveryBoy } from '../models/deliveryboy.js';
import { User } from '../models/user.js';
import { Donor } from '../models/donor.js';
import jwt from 'jsonwebtoken';
import { clearCollections } from './setup.js';

describe('Order Routes', () => {
    let testToken;
    let testOrder;
    let deliveryBoy;
    let donor;
    let user;

    beforeEach(async () => {
        // Clear all collections first
        await clearCollections();

        // Create test user with proper validation
        user = await User.create({
            username: 'testorderuser', // Changed username to avoid conflict
            email: 'testorderuser@example.com',
            password: 'Test@123', // Valid password format
            mobileNumber: '9876543210', // Valid mobile number format
            address: {
                doorNo: '123',
                street: 'Test St',
                townCity: 'Test City',
                state: 'Test State',
                pincode: '123456',
                coordinates: { type: 'Point', coordinates: [80.123, 16.456] }
            }
        });

        // Create test donor with proper validation
        donor = await Donor.create({
            username: 'testorderdonor', // Changed username to avoid conflict
            email: 'testorderdonor@example.com',
            password: 'Donor@123', // Valid password format
            mobileNumber: '8765432109', // Valid mobile number format
            address: {
                doorNo: '456',
                street: 'Donor St',
                townCity: 'Donor City',
                state: 'Donor State',
                pincode: '654321'
            }
        });

        // Create test delivery boy with proper validation
        deliveryBoy = await DeliveryBoy.create({
            deliveryBoyName: 'testorderdeliveryboy', // Changed username to avoid conflict
            mobileNumber: '7654321098', // Valid mobile number format
            password: 'Delivery@123', // Valid password format
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

        // Link delivery boy to user
        user.deliveryBoys = [deliveryBoy._id];
        await user.save();

        // Create test token with proper role
        testToken = jwt.sign(
            { username: deliveryBoy.deliveryBoyName, role: 'deliveryboy' },
            process.env.JWT_SECRET_KEY || 'testsecretkey',
            { expiresIn: '1h' }
        );
    });

    describe('GET /order/getOrders', () => {
        it('should get orders for delivery boy', async () => {
            const response = await request(app)
                .get('/order/getOrders')
                .set('Cookie', [`deliveryboy_jwt=${testToken}`]);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('success', true);
            expect(Array.isArray(response.body.orders)).toBe(true);
        });
    });

    describe('POST /order/setOrderPickedUp', () => {
        it('should mark order as picked up', async () => {
            const response = await request(app)
                .post('/order/setOrderPickedUp')
                .set('Cookie', [`deliveryboy_jwt=${testToken}`])
                .send({ orderId: testOrder._id });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.order.status).toBe('picked-up');
        });

        it('should reject unauthorized pickup', async () => {
            const wrongToken = jwt.sign(
                { username: 'wronguser', role: 'deliveryboy' },
                process.env.JWT_SECRET_KEY || 'testsecretkey'
            );

            const response = await request(app)
                .post('/order/setOrderPickedUp')
                .set('Cookie', [`deliveryboy_jwt=${wrongToken}`])
                .send({ orderId: testOrder._id });

            expect(response.status).toBe(403);
        });
    });

    describe('POST /order/setOrderDelivered', () => {
        it('should fail to mark order as delivered without image', async () => {
            const response = await request(app)
                .post('/order/setOrderDelivered')
                .set('Cookie', [`deliveryboy_jwt=${testToken}`])
                .send({ orderId: testOrder._id });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('success', false);
        });
    });

    describe("Order State Transitions", () => {
        it("should not allow delivery without pickup", async () => {
            const response = await request(app)
                .post("/order/setOrderDelivered")
                .set("Cookie", [`deliveryboy_jwt=${testToken}`])
                .send({ orderId: testOrder._id });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });

        it("should not allow status change by unauthorized delivery boy", async () => {
            const wrongToken = jwt.sign(
                { username: "wrongdeliveryboy", role: "deliveryboy" },
                process.env.JWT_SECRET_KEY || "testsecretkey"
            );

            const response = await request(app)
                .post("/order/setOrderPickedUp")
                .set("Cookie", [`deliveryboy_jwt=${wrongToken}`])
                .send({ orderId: testOrder._id });

            expect(response.status).toBe(403);
        });
    });

    afterEach(async () => {
        await clearCollections();
    });
});
