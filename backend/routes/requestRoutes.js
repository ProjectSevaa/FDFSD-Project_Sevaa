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

const router = express.Router();

router.get("/getRequests", getRequests);
router.get("/getAcceptedRequests", getAcceptedRequests);
router.get("/getRequestsForPost", getRequestsForPost);
router.get("/getAllDonors", getAllDonors);
router.post("/addRequest", addRequest);
router.patch("/acceptRequest/:id", acceptRequest);
router.patch("/cancelRequest/:id", cancelRequest);

export default router;
