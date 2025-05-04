import request from "supertest";
import app from "../app.js";
import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";
import bcrypt from "bcrypt";
import { setupTestDB, teardownTestDB } from './setup.js';

describe('Authentication Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Donor.deleteMany({});

        const hashedPassword = await bcrypt.hash('Test@123', 10);
        
        // Create test user
        await User.create({
            username: 'testuser',
            email: 'testuser@example.com',
            password: hashedPassword,
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

        // Create test donor with valid @food.in email
        await Donor.create({
            username: 'testdonor',
            email: 'testdonor@food.in',
            password: hashedPassword,
            mobileNumber: '8765432109',
            address: {
                doorNo: '456',
                street: 'Donor St',
                townCity: 'Donor City',
                state: 'Donor State',
                pincode: '654321'
            }
        });
    });

    describe('User Login', () => {
        it('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/auth/userLogin')
                .send({
                    email: 'testuser@example.com',
                    password: 'WrongPassword'
                });

            expect(response.status).toBe(401);
        });
    });

    describe('Donor Login', () => {
        it('should reject invalid credentials', async () => {
            const response = await request(app)
                .post('/auth/donorLogin')
                .send({
                    email: 'testdonor@food.in',
                    password: 'WrongPassword'
                });

            expect(response.status).toBe(401);
        });

        it('should reject donor with invalid email format', async () => {
            const response = await request(app)
                .post('/auth/donorLogin')
                .send({
                    email: 'testdonor@example.com',
                    password: 'Test@123'
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message', 'Donor does not exist');
        });
    });
});
