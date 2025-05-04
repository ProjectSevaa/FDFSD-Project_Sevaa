import express from "express";
import {
    assignOrder,
    getOrders,
    setOrderDelivered,
    setOrderPickedUp,
    uploadDeliveryImage,
} from "../controllers/orderController.js";

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management and delivery operations
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - requestId
 *         - deliveryBoyId
 *         - deliveryLocation
 *       properties:
 *         requestId:
 *           type: string
 *         deliveryBoyId:
 *           type: string
 *         deliveryLocation:
 *           type: string
 *     DeliveryImage:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *           format: binary
 */

/**
 * @swagger
 * /order/assignOrder:
 *   post:
 *     summary: Assign an order to a delivery boy
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       201:
 *         description: Order assigned successfully
 *
 * /order/setOrderDelivered:
 *   post:
 *     summary: Mark order as delivered with proof
 *     tags: [Orders]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               orderId:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Order marked as delivered
 */

const router = express.Router();

router.get("/getOrders", getOrders); // Ensure this route exists and is not duplicated
// Remove any duplicate route definitions if they exist
router.post("/assignOrder", assignOrder);
router.post("/setOrderDelivered", setOrderDelivered);
router.post("/setOrderPickedUp", setOrderPickedUp);
router.post("/uploadDeliveryImage", uploadDeliveryImage);

export default router;
