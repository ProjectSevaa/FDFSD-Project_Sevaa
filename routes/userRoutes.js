import express from 'express';
import { addUser , getUserHomePage } from "../controllers/userController.js";

const router = express.Router();

router.get('/user_homepage' , getUserHomePage);

router.post('/addUser' , addUser);

export default router;