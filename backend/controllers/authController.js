import express from "express";
import bcrypt from "bcrypt";
import axios from "axios";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { User } from "../models/user.js";
import { Donor } from "../models/donor.js";
import { DeliveryBoy } from "../models/deliveryboy.js";
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User does not exist");
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                redirectTo: "/",
            });
        }

        const token = jwt.sign(
            { username: user.username, role: "user" },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("user_jwt", token, {
            httpOnly: true,
            secure: true, // Required for cross-origin HTTPS
            sameSite: "none", // Required for cross-origin
            maxAge: 3600000,
        });

        console.log("Login successful");

        return res.status(200).json({
            message: "Login successful",
            redirectTo: "/user/user_homepage",
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginDonor = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const donor = await Donor.findOne({ email });
        if (!donor) {
            return res.status(400).json({ message: "Donor does not exist" });
        }

        const isPasswordValid = await bcrypt.compare(password, donor.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                redirectTo: "/",
            });
        }

        const token = jwt.sign(
            { username: donor.username, role: "donor" },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("donor_jwt", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 3600000,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            redirectTo: "/donor/donor_homepage",
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const loginDel = async (req, res) => {
    try {
        const { deliveryBoyName, password } = req.body;
        if (!deliveryBoyName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const deliveryboy = await DeliveryBoy.findOne({ deliveryBoyName });
        if (!deliveryboy) {
            console.log("Delivery boy does not exist:", deliveryBoyName);
            return res
                .status(400)
                .json({ message: "Invalid username or password" });
        }

        // Log the retrieved deliveryboy for debugging
        console.log("Found delivery boy:", deliveryboy);

        // console.log(password , deliveryboy.password);

        const isPasswordValid = await bcrypt.compare(
            password,
            deliveryboy.password
        );
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
                redirectTo: "/",
            });
        }

        const token = jwt.sign(
            { username: deliveryboy.deliveryBoyName, role: "deliveryboy" },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h",
            }
        );

        res.cookie("deliveryboy_jwt", token, {
            httpOnly: true,
            secure: true, // Required for cross-origin HTTPS
            sameSite: "none", // Required for cross-origin
            maxAge: 3600000,
        });

        console.log("Login successful");
        // res.status(200).redirect("/deliveryboy/getDeliveryBoyDashboard"); // Adjust this if needed
        return res.status(200).json({
            success: true,
            message: "Login successful",
            redirectTo: "/deliveryboy/deliveryboy_homepage",
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

const url = process.env.URL;
export const signupUser = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existingUser) {
            return res.status(200).json({
                success: true,
                message: "User already exists",
            });
        }

        const userData = {
            username,
            mobileNumber: req.body.mobileNumber,
            email,
            password: req.body.password,
            address: req.body.address,
        };

        const response = await axios.post(`${url}/user/addUser`, userData);

        if (response.status === 201) {
            res.redirect("/u_login");
        } else {
            res.status(response.status).json({
                message: response.data.message,
            });
        }
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signupDonor = async (req, res) => {
    try {
        const { username, email } = req.body;

        // Check if donor already exists
        const existingDonor = await Donor.findOne({
            $or: [{ username }, { email }],
        });
        if (existingDonor) {
            return res.status(200).json({
                success: true,
                message: "Donor already exists",
            });
        }

        const donorData = {
            username,
            mobileNumber: req.body.mobileNumber,
            email,
            password: req.body.password,
            address: req.body.address,
        };

        const response = await axios.post(`${url}/donor/addDonor`, donorData);

        if (response.status === 201) {
            res.redirect("/d_login");
        } else {
            res.status(response.status).json({
                message: response.data.message,
            });
        }
    } catch (error) {
        console.error("Error creating donor:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const signupDel = async (req, res) => {
    try {
        const longitude = parseFloat(req.body.longitude);
        const latitude = parseFloat(req.body.latitude);

        if (isNaN(longitude) || isNaN(latitude)) {
            return res
                .status(400)
                .json({ message: "Invalid coordinates provided." });
        }

        const deliveryboydata = {
            deliveryBoyName: req.body.deliveryBoyName,
            mobileNumber: req.body.mobileNumber,
            password: req.body.passwordDel,
            vehicleNo: req.body.vehicleNo,
            drivingLicenseNo: req.body.drivingLicenseNo,
            currentLocation: {
                type: "Point",
                coordinates: [longitude, latitude],
            },
        };

        const response = await axios.post(
            `${url}/deliveryboy/createDeliveryBoy`,
            deliveryboydata
        );

        if (response.status === 201) {
            return res.status(201).json({
                success: true,
                message: "Delivery boy created successfully",
                redirectTo: "/del_login",
            });
        } else {
            res.status(response.status).json({
                message: response.data.message,
            });
        }
    } catch (error) {
        console.error("Error creating delivery boy:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("user_jwt");
        res.status(200).redirect("/");
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutDonor = async (req, res) => {
    try {
        res.clearCookie("donor_jwt");
        res.status(200).redirect("/");
    } catch (error) {
        console.error("Error logging out:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
