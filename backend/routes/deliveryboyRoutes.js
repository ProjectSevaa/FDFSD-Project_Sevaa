import express from 'express';
import { 
    addDeliveryBoy,        // Corrected method name to match the controller
    getDeliveryBoyPage, 
    getDeliveryBoysByUser, 
    findNearbyUsers,
    getAllDeliveryBoys 
} from "../controllers/deliveryboyController.js";

const router = express.Router();

router.post('/addDeliveryboy', addDeliveryBoy);

router.post('/deliveryboy', addDeliveryBoy);
router.get('/deliveryboy/:deliveryBoyId/nearby-users', findNearbyUsers);

router.get('/deliveryboyPage', getDeliveryBoyPage);
router.get('/deliveryboys/user/:userId', getDeliveryBoysByUser);
router.get('/deliveryboys', getAllDeliveryBoys);

export default router;
