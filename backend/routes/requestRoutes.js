import express from "express";
import csrf from "csurf";
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
const csrfProtection = csrf({ cookie: true });

router.use(csrfProtection); // Apply CSRF protection to all routes

router.get("/csrf-token", (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

router.get("/getRequests", getRequests);
router.get("/getAcceptedRequests", getAcceptedRequests);
router.get("/getRequestsForPost", getRequestsForPost);

router.get("/getAllDonors", getAllDonors);

router.post("/addRequest", addRequest);

router.patch("/acceptRequest/:id", acceptRequest);
router.patch("/cancelRequest/:id", cancelRequest);

export default router;
