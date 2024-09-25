import express from 'express';
import { 
    createDeliveryBoy, 
    findNearbyPosts, 
    getAllDeliveryBoys, 
    getDeliveryBoysByUser 
} from '../controllers/deliveryBoyController.js';

const router = express.Router();

// Add a new delivery boy
router.post('/createDeliveryBoy', createDeliveryBoy);

// Get all delivery boys assigned to a particular user
router.get('/deliveryBoysByUser/:userId', getDeliveryBoysByUser);

// Get all delivery boys
router.get('/getAllDeliveryBoys', getAllDeliveryBoys);

// Find nearby users for a delivery boy
router.get('/findNearbyPosts', findNearbyPosts);

export default router;
