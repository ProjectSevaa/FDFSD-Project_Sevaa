import express from "express";
import csrf from "csurf";
import {
    assignOrder,
    getOrders,
    setOrderDelivered,
    setOrderPickedUp,
    uploadDeliveryImage,
} from "../controllers/orderController.js";

const router = express.Router();
const csrfProtection = csrf({ cookie: true });

// CSRF token endpoint
router.get("/csrf-token", csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Protected routes
router.get("/getOrders", csrfProtection, getOrders);
router.post("/assignOrder", csrfProtection, assignOrder);
router.post("/setOrderDelivered", csrfProtection, setOrderDelivered);
router.post("/setOrderPickedUp", csrfProtection, setOrderPickedUp);
router.post("/order/DeliveryImage", csrfProtection, uploadDeliveryImage);

export default router;
