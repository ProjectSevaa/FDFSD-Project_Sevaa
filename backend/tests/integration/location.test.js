import request from 'supertest';
import app from '../../app.js';
import { DeliveryBoy } from '../../models/deliveryboy.js';
import { setupTestDB, teardownTestDB } from '../setup.js';

describe('Location Services Integration Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('should handle invalid coordinates', async () => {
        const invalidCoordinateTests = [
            [null, null],
            [undefined, undefined],
            ['invalid', 'coords'],
            [1000, 1000],
            [-1000, -1000],
            [0, 91],
            [181, 0]
        ];

        for (const [longitude, latitude] of invalidCoordinateTests) {
            const response = await request(app)
                .post('/deliveryboy/createDeliveryBoy')
                .send({
                    deliveryBoyName: 'testboy',
                    mobileNumber: '9876543210',
                    password: 'Test@123',
                    vehicleNo: 'KA01AB1234',
                    drivingLicenseNo: 'KA0120201234567',
                    currentLocation: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    }
                });

            expect(response.status).toBe(400);
        }
    });
});
