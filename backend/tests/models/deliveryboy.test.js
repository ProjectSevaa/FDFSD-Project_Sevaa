import { DeliveryBoy } from '../../models/deliveryboy.js';
import { setupTestDB, teardownTestDB } from '../setup.js';
import bcrypt from 'bcrypt';

describe('DeliveryBoy Model Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('should create delivery boy with valid data', async () => {
        const deliveryBoyData = {
            deliveryBoyName: "testboy",
            mobileNumber: "9876543210",
            password: "Test@123",
            vehicleNo: "KA01AB1234",
            drivingLicenseNo: "KA0120201234567",
            currentLocation: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            }
        };

        const deliveryBoy = await DeliveryBoy.create(deliveryBoyData);
        expect(deliveryBoy.deliveryBoyName).toBe(deliveryBoyData.deliveryBoyName);
        expect(deliveryBoy.status).toBe("available");
    });

    it('should validate required fields', async () => {
        const invalidDeliveryBoy = new DeliveryBoy({});
        const validateError = invalidDeliveryBoy.validateSync();
        expect(validateError.errors.deliveryBoyName).toBeDefined();
        expect(validateError.errors.mobileNumber).toBeDefined();
        expect(validateError.errors.password).toBeDefined();
        expect(validateError.errors.vehicleNo).toBeDefined();
        expect(validateError.errors.drivingLicenseNo).toBeDefined();
    });

    it('should enforce unique deliveryBoyName', async () => {
        const data = {
            deliveryBoyName: "uniqueboy",
            mobileNumber: "9876543210",
            password: "Test@123",
            vehicleNo: "KA01AB1234",
            drivingLicenseNo: "KA0120201234567",
            currentLocation: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            }
        };

        await DeliveryBoy.create(data);
        await expect(DeliveryBoy.create(data)).rejects.toThrow();
    });

    it('should validate status enum values', async () => {
        const invalidStatus = new DeliveryBoy({
            deliveryBoyName: "statustest",
            mobileNumber: "9876543210",
            password: "Test@123",
            vehicleNo: "KA01AB1234",
            drivingLicenseNo: "DL123456",
            currentLocation: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            },
            status: "invalid_status"
        });

        await expect(invalidStatus.validate()).rejects.toThrow();
    });

    it('should track delivered orders count', async () => {
        const deliveryBoy = await DeliveryBoy.create({
            deliveryBoyName: "counttest",
            mobileNumber: "9876543210",
            password: "Test@123",
            vehicleNo: "KA01AB1234",
            drivingLicenseNo: "DL123456",
            currentLocation: {
                type: "Point",
                coordinates: [77.5946, 12.9716]
            }
        });

        expect(deliveryBoy.deliveredOrders).toBe(0);
        deliveryBoy.deliveredOrders += 1;
        await deliveryBoy.save();
        expect(deliveryBoy.deliveredOrders).toBe(1);
    });
});
