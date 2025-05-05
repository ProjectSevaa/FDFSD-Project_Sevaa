import request from 'supertest';
import app from '../../app.js';
import { Request } from '../../models/request.js';
import { setupTestDB, teardownTestDB } from '../setup.js';

describe('Request Flow Integration Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('should handle request state transitions correctly', async () => {
        const requestData = {
            donorUsername: 'testdonor',
            userUsername: 'testuser',
            location: 'Test Location',
            availableFood: ['Rice', 'Dal'],
            post_id: '507f1f77bcf86cd799439011'
        };

        // Create request
        const request = await Request.create(requestData);

        // Test state transitions
        const states = [
            { isAccepted: true, deliveryAssigned: false },
            { isAccepted: true, deliveryAssigned: true },
            { isAccepted: false, deliveryAssigned: false }
        ];

        for (const state of states) {
            Object.assign(request, state);
            await request.save();
            const savedState = await Request.findById(request._id);
            expect(savedState.isAccepted).toBe(state.isAccepted);
            expect(savedState.deliveryAssigned).toBe(state.deliveryAssigned);
        }
    });
});
