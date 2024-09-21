import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { User } from '../models/user.js';
import { Donor } from '../models/donor.js';
import { Request } from '../models/request.js';
const app = express();


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

export const addRequest = async (req, res) => {
    try {
        const { donorUsername, userUsername, location, availableFood } = req.body;

        console.log(req.body);

        // Validate required fields
        if (!donorUsername || !userUsername || !availableFood) {
            return res.status(400).json({ message: 'Donor username, user username, and available food are required' });
        }

        // Check if the donor exists
        const donorExists = await Donor.exists({ username: donorUsername });
        if (!donorExists) {
            return res.status(400).json({ message: `Donor with username ${donorUsername} does not exist` });
        }

        // Check if the user exists
        const userExists = await User.exists({ username: userUsername });
        if (!userExists) {
            return res.status(400).json({ message: `User with username ${userUsername} does not exist` });
        }

        // Create a new request
        const newRequest = new Request({
            donorUsername,
            userUsername,
            location,
            availableFood
        });

        await newRequest.save();

        res.status(201).json({ message: 'Request created successfully', request: newRequest });

        
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
