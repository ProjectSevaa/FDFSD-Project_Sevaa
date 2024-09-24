import express from 'express';
import { addDeliveryboy, getDeliveryBoyHomepage, getDeliveryBoysByUser, getAllDeliveryBoys} from "../controllers/deliveryboyController.js";

const router = express.Router();

router.post('/addDeliveryboy', addDeliveryboy);

router.get('/deliveryboyPage', getDeliveryBoyHomepage);
router.get('/deliveryboys/user/:userId', getDeliveryBoysByUser);
router.get('/deliveryboys', getAllDeliveryBoys);

export default router;
