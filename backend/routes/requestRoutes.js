import express from "express";
import {
    getAllDonors,
    addRequest,
    getRequests,
    getAcceptedRequests,
    getRequestsForPost,
    acceptRequest,
    cancelRequest,
} from "../controllers/requestController.js";

/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Food donation request management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - donorUsername
 *         - userUsername
 *         - availableFood
 *       properties:
 *         donorUsername:
 *           type: string
 *         userUsername:
 *           type: string
 *         availableFood:
 *           type: array
 *           items:
 *             type: string
 *         location:
 *           type: string
 */

/**
 * @swagger
 * /request/addRequest:
 *   post:
 *     summary: Create a new food request
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       201:
 *         description: Request created successfully
 *
 * /request/acceptRequest/{id}:
 *   patch:
 *     summary: Accept a food donation request
 *     tags: [Requests]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Request accepted successfully
 */

const router = express.Router();

router.get("/getRequests", getRequests);
router.get("/getAcceptedRequests", getAcceptedRequests);
router.get("/getRequestsForPost", getRequestsForPost);
router.get("/getAllDonors", getAllDonors);
router.post("/addRequest", addRequest);
router.patch("/acceptRequest/:id", acceptRequest);
router.patch("/cancelRequest/:id", cancelRequest);

export default router;
