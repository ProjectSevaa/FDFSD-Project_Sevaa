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

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY; // Ensure this is set in your environment variables

// Controller to render the delivery boy form page
export const getDeliveryBoyPage = (req, res) => {
    try {
        // Render the 'deliveryboy.ejs' form page
        res.render('deliveryboy');
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Controller to add a new Delivery Boy
export const addDeliveryBoy = async (req, res) => {
    const {
        deliveryBoyName,
        mobileNumber,
        vehicleNo,
        drivingLicenseNo,
        currentlocation
    } = req.body;

    try {
        const newDeliveryBoy = new DeliveryBoy({
            deliveryBoyName,
            mobileNumber,
            vehicleNo,
            drivingLicenseNo,
            currentlocation
        });

        await newDeliveryBoy.save();
        res.status(201).json({ message: 'Delivery boy added successfully!', deliveryBoy: newDeliveryBoy });
    } catch (error) {
        res.status(400).json({ message: 'Error adding delivery boy', error: error.message });
    }
};

// New controller to find nearby users
// export const findNearbyUsers = async (req, res) => {
//     const { deliveryBoyId } = req.params;

//     try {
//         // Fetch the delivery boy by ID
//         const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
//         if (!deliveryBoy) {
//             return res.status(404).json({ message: 'Delivery boy not found' });
//         }

//         const [longitude, latitude] = deliveryBoy.currentlocation.coordinates;

//         // Fetch all users with their locations
//         const users = await User.find({}); // Assuming User model has a 'currentlocation' field

//         // Filter users based on distance
//         const nearbyUsers = users.filter(user => {
//             const userCoordinates = user.currentlocation.coordinates;
//             const distance = getDistance(longitude, latitude, userCoordinates[0], userCoordinates[1]);
//             return distance <= 10000; // For example, 10 km
//         });

//         res.status(200).json({ users: nearbyUsers });
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching nearby users', error });
//     }
// };

// // Helper function to calculate distance (as previously defined)
// const getDistance = (lon1, lat1, lon2, lat2) => {
//     const R = 6371e3; // meters
//     const φ1 = lat1 * Math.PI/180;
//     const φ2 = lat2 * Math.PI/180;
//     const Δφ = (lat2-lat1) * Math.PI/180;
//     const Δλ = (lon2-lon1) * Math.PI/180;

//     const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
//               Math.cos(φ1) * Math.cos(φ2) *
//               Math.sin(Δλ/2) * Math.sin(Δλ/2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

//     return R * c; // in meters
// };

export const findNearbyUsers = async (req, res) => {
    const { deliveryBoyId } = req.params;

    try {
        // Fetch the delivery boy by ID
        const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
        if (!deliveryBoy) {
            return res.status(404).json({ message: 'Delivery boy not found' });
        }

        const [longitude, latitude] = deliveryBoy.currentlocation.coordinates;

        // Fetch all users with their locations
        const users = await User.find({}); // Ensure User model has a 'currentlocation' field

        // Filter users based on distance
        const nearbyUsers = users.filter(user => {
            if (!user.currentlocation || !user.currentlocation.coordinates) {
                console.error(`User ${user._id} has no location data.`);
                return false; // Skip users without location
            }

            const userCoordinates = user.currentlocation.coordinates;
            const distance = getDistance(longitude, latitude, userCoordinates[0], userCoordinates[1]);
            return distance <= 10000; // For example, 10 km
        });

        res.status(200).json({ users: nearbyUsers });
    } catch (error) {
        console.error('Error fetching nearby users:', error); // Log error details
        res.status(500).json({ message: 'Error fetching nearby users', error });
    }
};


// Controller to get all delivery boys assigned under a particular user
export const getDeliveryBoysByUser = async (req, res) => {
    const { userId } = req.params; // Get the user ID from the request parameters

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
