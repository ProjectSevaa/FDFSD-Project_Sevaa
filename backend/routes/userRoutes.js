import express from 'express';
import { addUser , getUserHomePage , sendRequest , updateUser} from "../controllers/userController.js";

const router = express.Router();

router.get('/user_homepage' , getUserHomePage);

router.post('/addUser' , addUser);
router.put('/users/:userId', updateUser); 
router.post('/sendRequest' , sendRequest);

export default router;