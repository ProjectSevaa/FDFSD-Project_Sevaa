import express from 'express';
import { addUser , getUserHomePage , sendRequest } from "../controllers/userController.js";

const router = express.Router();

router.get('/user_homepage' , getUserHomePage);

router.post('/addUser' , addUser);
router.post('/sendRequest' , sendRequest);

export default router;