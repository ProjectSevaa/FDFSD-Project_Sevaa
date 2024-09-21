import express from 'express';
import { addRequest , getRequests , getAcceptedRequests , acceptRequest , cancelRequest } from "../controllers/requestController.js";

const router = express.Router();


router.get('/getRequests', getRequests);
router.get('/getAcceptedRequests', getAcceptedRequests);

router.post('/addRequest' , addRequest);

router.patch('/acceptRequest/:id', acceptRequest);
router.patch('/cancelRequest/:id', cancelRequest);



export default router;