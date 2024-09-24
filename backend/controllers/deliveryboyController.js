import express from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { User } from '../models/user.js';
import { DeliveryBoy } from '../models/deliveryboy.js';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Controller to render the delivery boy homepage
export const getDeliveryBoyHomepage = (req, res) => {
    try {
        // Fetch all delivery boys from the database
        DeliveryBoy.find({}, (err, deliveryBoys) => {
            if (err) {
                return res.status(500).json({ message: 'Error fetching delivery boys', error: err });
            }

            // Render the 'deliveryboy.ejs' file, passing the delivery boys data to the view
            res.render('deliveryboy', { deliveryBoys });
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to add a new Delivery Boy
export const addDeliveryboy = async (req, res) => {
    const { worksUnder, deliveryBoyName, mobileNumber, vehicleNo, drivingLicenseNo, address } = req.body;

    try {
        // Create a new DeliveryBoy document
        const newDeliveryBoy = new DeliveryBoy({
            worksUnder,          // reference to the user he works for
            deliveryBoyName,     // Name of the delivery boy
            mobileNumber,
            vehicleNo,
            drivingLicenseNo,
            address,
        });

        // Save the new delivery boy to the database
        await newDeliveryBoy.save();

        res.status(201).json({ message: 'Delivery boy added successfully', deliveryBoy: newDeliveryBoy });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add delivery boy', error });
    }
};



// Controller to get all delivery boys assigned under a particular user
export const getDeliveryBoysByUser = async (req, res) => {
    const userId = req.params.userId; // Get the user ID from the request parameters

    try {
        // Fetch delivery boys that work under the specified user
        const deliveryBoys = await DeliveryBoy.find({ worksUnder: userId });

        if (deliveryBoys.length === 0) {
            return res.status(404).json({ message: 'No delivery boys found for this user.' });
        }

        res.status(200).json({ deliveryBoys });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery boys', error });
    }
};

// Controller to get all delivery boys
export const getAllDeliveryBoys = async (req, res) => {
    try {
        // Fetch all delivery boys from the database
        const deliveryBoys = await DeliveryBoy.find({});

        if (deliveryBoys.length === 0) {
            return res.status(404).json({ message: 'No delivery boys found.' });
        }

        res.status(200).json({ deliveryBoys });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching delivery boys', error });
    }
};
