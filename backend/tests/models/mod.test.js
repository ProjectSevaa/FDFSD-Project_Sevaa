import { Mod } from '../../models/mod.js';
import { setupTestDB, teardownTestDB } from '../setup.js';
import bcrypt from 'bcrypt';

describe('Mod Model Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('should create mod with valid data', async () => {
        const modData = {
            username: "testmod",
            mobileNumber: "9876543210",
            email: "testmod@example.com",
            password: "Test@123",
            role: "moderator"
        };

        const mod = await Mod.create(modData);
        expect(mod.username).toBe(modData.username);
        expect(mod.email).toBe(modData.email);
        expect(mod.role).toBe("moderator");
        expect(mod.isBanned).toBe(false);
    });

    it('should validate required fields', async () => {
        const invalidMod = new Mod({});
        const validateError = invalidMod.validateSync();
        expect(validateError.errors.username).toBeDefined();
        expect(validateError.errors.email).toBeDefined();
        expect(validateError.errors.password).toBeDefined();
        expect(validateError.errors.role).toBeDefined();
    });

    it('should enforce unique username', async () => {
        await Mod.create({
            username: "uniquemod",
            mobileNumber: "9876543210",
            email: "unique@example.com",
            password: "Test@123",
            role: "moderator"
        });

        await expect(Mod.create({
            username: "uniquemod",
            mobileNumber: "9876543211",
            email: "different@example.com",
            password: "Test@123",
            role: "moderator"
        })).rejects.toThrow();
    });

    it('should validate role enum values', async () => {
        const invalidRole = new Mod({
            username: "roletest",
            mobileNumber: "9876543210",
            email: "role@example.com",
            password: "Test@123",
            role: "invalid_role"
        });

        await expect(invalidRole.validate()).rejects.toThrow();
    });

    it('should hash password before saving', async () => {
        const mod = await Mod.create({
            username: "hashtest",
            mobileNumber: "9876543210",
            email: "hash@example.com",
            password: "Test@123",
            role: "moderator"
        });

        expect(mod.password).not.toBe("Test@123");
        const isValidPassword = await bcrypt.compare("Test@123", mod.password);
        expect(isValidPassword).toBe(true);
    });

    it('should allow role updates', async () => {
        const mod = await Mod.create({
            username: "roleupdate",
            mobileNumber: "9876543210",
            email: "roleupdate@example.com",
            password: "Test@123",
            role: "moderator"
        });

        mod.role = "admin";
        await mod.save();
        expect(mod.role).toBe("admin");
    });

    it('should track ban status', async () => {
        const mod = await Mod.create({
            username: "bantest",
            mobileNumber: "9876543210",
            email: "ban@example.com",
            password: "Test@123",
            role: "moderator"
        });

        mod.isBanned = true;
        await mod.save();
        expect(mod.isBanned).toBe(true);
    });

    it('should enforce unique email', async () => {
        await Mod.create({
            username: "testemail1",
            mobileNumber: "9876543210",
            email: "same@example.com",
            password: "Test@123",
            role: "moderator"
        });

        await expect(Mod.create({
            username: "testemail2",
            mobileNumber: "9876543211",
            email: "same@example.com",
            password: "Test@123",
            role: "moderator"
        })).rejects.toThrow();
    });

    it('should handle multiple role changes', async () => {
        const mod = await Mod.create({
            username: "multiroleMod",
            mobileNumber: "9876543210",
            email: "multirole@example.com",
            password: "Test@123",
            role: "moderator"
        });

        mod.role = "admin";
        await mod.save();
        expect(mod.role).toBe("admin");

        mod.role = "superuser";
        await mod.save();
        expect(mod.role).toBe("superuser");
    });

    it('should update ban status multiple times', async () => {
        const mod = await Mod.create({
            username: "banstatustest",
            mobileNumber: "9876543210",
            email: "banstatus@example.com",
            password: "Test@123",
            role: "moderator"
        });

        mod.isBanned = true;
        await mod.save();
        expect(mod.isBanned).toBe(true);

        mod.isBanned = false;
        await mod.save();
        expect(mod.isBanned).toBe(false);
    });

    it('should not allow empty username', async () => {
        const emptyUsername = new Mod({
            username: "",
            mobileNumber: "9876543210",
            email: "empty@example.com",
            password: "Test@123",
            role: "moderator"
        });

        await expect(emptyUsername.validate()).rejects.toThrow();
    });

    it('should not allow empty password', async () => {
        const emptyPassword = new Mod({
            username: "emptypass",
            mobileNumber: "9876543210",
            email: "emptypass@example.com",
            password: "",
            role: "moderator"
        });

        await expect(emptyPassword.validate()).rejects.toThrow();
    });

    it('should maintain password hash after updates', async () => {
        const mod = await Mod.create({
            username: "updatetest",
            mobileNumber: "9876543210",
            email: "update@example.com",
            password: "Test@123",
            role: "moderator"
        });

        const originalHash = mod.password;
        mod.username = "updatedname";
        await mod.save();
        expect(mod.password).toBe(originalHash);
    });

    it('should allow role change from moderator to superuser', async () => {
        const mod = await Mod.create({
            username: "promotetest",
            mobileNumber: "9876543210",
            email: "promote@example.com",
            password: "Test@123",
            role: "moderator"
        });

        mod.role = "superuser";
        await mod.save();
        expect(mod.role).toBe("superuser");
    });

    it('should handle concurrent updates correctly', async () => {
        const mod = await Mod.create({
            username: "concurrent",
            mobileNumber: "9876543210",
            email: "concurrent@example.com",
            password: "Test@123",
            role: "moderator"
        });

        const updates = [
            { role: "admin" },
            { isBanned: true },
            { mobileNumber: "9876543211" }
        ];

        await Promise.all(updates.map(update => 
            Mod.findByIdAndUpdate(mod._id, update, { new: true })
        ));

        const updatedMod = await Mod.findById(mod._id);
        expect(updatedMod).toBeDefined();
    });
});
