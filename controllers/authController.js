import express from 'express';
import { User } from '../models/user.js';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

export const loginUser = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {

            console.log('User does not exist');
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (password !== user.password) {

            console.log('Wrong password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful');
        res.status(200).json({ message: 'Login successful', user });
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};


export const loginDonor = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const donor = await Donor.findOne({ email });
        if (!donor) {
            console.log('User does not exist');
            return res.status(400).json({ message: 'User does not exist' });
        }

        if (password !== donor.password) {
            console.log('Wrong password');
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('Login successful');
        res.status(200).json({ message: 'Login successful', donor });
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};