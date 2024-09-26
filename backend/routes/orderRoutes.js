import express from 'express';
import { assignOrder , getOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get('/getOrders' , getOrders);

router.post('/assignOrder' , assignOrder);

export default router;