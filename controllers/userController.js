import express from 'express';
import { User } from '../models/user.js';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export const addUser = async (req, res) => {
    try {
        const { username, mobileNumber, email, password, address } = req.body;
        console.log(req.body);
        
        if (!username || !mobileNumber || !email || !password || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const newUser = new User({
            username,
            mobileNumber,
            email,
            password,
            address
        });

        await newUser.save();

        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
