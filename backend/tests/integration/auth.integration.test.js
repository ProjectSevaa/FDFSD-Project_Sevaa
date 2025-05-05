import request from 'supertest';
import app from '../../app.js';
import { setupTestDB, teardownTestDB } from '../setup.js';

describe('Authentication Integration Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    describe('Session Management', () => {
        it('should handle multiple concurrent login sessions', async () => {
            const loginPromises = Array(10).fill().map(() => 
                request(app)
                    .post('/auth/userLogin')
                    .send({
                        email: 'testuser@example.com',
                        password: 'Test@123'
                    })
            );
            
            const responses = await Promise.all(loginPromises);
            responses.forEach(response => {
                expect(response.status).toBe(200);
                expect(response.headers['set-cookie']).toBeDefined();
            });
        });
    });

    describe('Password Security', () => {
        it('should enforce password complexity requirements', async () => {
            const weakPasswords = [
                'short',
                '12345678',
                'onlylowercase',
                'ONLYUPPERCASE',
                'NoSpecialChar1',
                'no@numbers'
            ];

            const signupPromises = weakPasswords.map(password =>
                request(app)
                    .post('/auth/userSignup')
                    .send({
                        username: 'testuser',
                        email: 'test@example.com',
                        password: password,
                        mobileNumber: '9876543210',
                        address: {
                            doorNo: '123',
                            street: 'Test St',
                            townCity: 'Test City',
                            state: 'Test State',
                            pincode: '123456'
                        }
                    })
            );

            const responses = await Promise.all(signupPromises);
            responses.forEach(response => {
                expect(response.status).not.toBe(201);
            });
        });
    });
});
