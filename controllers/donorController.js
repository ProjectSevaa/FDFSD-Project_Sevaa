import express from 'express';
import { Donor } from '../models/donor.js';
const app = express();

app.use(express.urlencoded({ extended: true }));


export const addDonor = async (req, res) => {
    try {
        const { username, mobileNumber, email, password, address } = req.body;
        
        if (!username || !mobileNumber || !email || !password || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newDonor = new Donor({
            username,
            mobileNumber,
            email,
            password,
            address
        });

        try{
            await newDonor.save();
            console.log('Donor added successfully');
        }catch(err){
            console.log(err.message);
            return res.status(400).json({ message: 'Donor already exists (or) Adding Donor was Unsucessful' });
        }


        res.status(201).json({ message: 'Donor created successfully', donor: newDonor });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

