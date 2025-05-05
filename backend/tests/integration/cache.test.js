import { Post } from '../../models/post.js';
import redisClient, { updatePostsCache } from '../../config/redisConfig.js';
import { setupTestDB, teardownTestDB } from '../setup.js';

describe('Cache Integration Tests', () => {
    beforeAll(async () => {
        await setupTestDB();
    });

    afterAll(async () => {
        await teardownTestDB();
    });

    it('should handle Redis client disconnection gracefully', async () => {
        const originalStatus = redisClient.status;
        redisClient.status = 'error';
        
        const result = await updatePostsCache();
        expect(result).toBe(false);
        
        redisClient.status = originalStatus;
    });

    it('should handle empty posts array', async () => {
        await Post.deleteMany({});
        const result = await updatePostsCache();
        expect(result).toBe(true);
    });

    it('should handle large number of posts', async () => {
        const posts = Array(1000).fill().map((_, i) => ({
            donorUsername: `donor${i}`,
            availableFood: ['Rice'],
            location: 'Test Location',
            currentlocation: {
                type: 'Point',
                coordinates: [80.123, 16.456]
            }
        }));

        await Post.insertMany(posts);
        const result = await updatePostsCache();
        expect(result).toBe(true);
    });
});
