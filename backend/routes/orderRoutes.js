import express from "express";
import {
    assignOrder,
    getOrders,
    setOrderDelivered,
    setOrderPickedUp,
    uploadDeliveryImage,
} from "../controllers/orderController.js";

const router = express.Router();

router.get("/getOrders", getOrders);
router.post("/assignOrder", assignOrder);
router.post("/setOrderDelivered", setOrderDelivered);
router.post("/setOrderPickedUp", setOrderPickedUp);
router.post("/order/DeliveryImage", uploadDeliveryImage);

export default router;
