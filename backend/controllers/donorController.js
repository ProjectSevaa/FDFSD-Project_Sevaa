import "dotenv/config";
import express from "express";
import axios from "axios";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Donor } from "../models/donor.js";
import { Post } from "../models/post.js";
const app = express();

const url = process.env.URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

export const addDonor = async (req, res) => {
    try {
        const { username, mobileNumber, email, password, address } = req.body;

        if (!username || !mobileNumber || !email || !password || !address) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newDonor = new Donor({
            username,
            mobileNumber,
            email,
            password,
            address,
        });

        try {
            await newDonor.save();
            console.log("Donor added successfully");
        } catch (err) {
            console.log(err.message);
            return res.status(400).json({
                message:
                    "Donor already exists (or) Adding Donor was Unsucessful",
            });
        }

        res.status(201).json({
            message: "Donor created successfully",
            donor: newDonor,
        });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getDonors = async (req, res) => {
    try {
        const donors = await Donor.find();
        res.status(200).json({ donors });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getDonorHomePage = async (req, res) => {
    try {
        const token = req.cookies.donor_jwt;

        if (!token) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorized" });
        }

        const decodedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });

        const username = decodedToken.username;

        const donor = await Donor.findOne({ username });

        if (!donor) {
            return res
                .status(404)
                .json({ success: false, message: "Donor not found" });
        }

        const response = await axios.get(`${url}/post/getPosts`, {
            params: { donorUsername: username },
        });

        const postsList = response.data;

        res.render("donor_homepage", { donor, postsList });
    } catch (err) {
        console.log(err.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const getDonorPosts = async (req, res) => {
    try {
        // Get donor username from JWT token
        const token = req.cookies.donor_jwt;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const donorUsername = decoded.username;

        // Find posts by this donor
        const posts = await Post.find({ donorUsername }).sort({
            timestamp: -1,
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getDonorPosts:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

export const toggleBan = async (req, res) => {
    const { donorId } = req.params;
    const { isBanned } = req.body; // The new ban status

    try {
        // Find the donor by ID and update the isBanned field
        const donor = await Donor.findByIdAndUpdate(
            donorId,
            { isBanned },
            { new: true } // Return the updated document
        );

        if (!donor) {
            return res
                .status(404)
                .json({ success: false, message: "Donor not found" });
        }

        res.status(200).json({
            success: true,
            message: "Ban status updated",
            donor,
        });
    } catch (error) {
        console.error("Error toggling ban status:", error);
        res.status(500).json({
            success: false,
            message: "Server error while toggling ban status",
        });
    }
};

export const getDonorStats = async (req, res) => {
    const { donorEmail } = req.params;

    try {
        const donor = await Donor.findOne({ email: donorEmail });

        if (!donor) {
            return res
                .status(404)
                .json({ success: false, message: "Donor not found" });
        }

        const stats = {
            donationsCount: donor.donationsCount,
            rating: donor.rating,
        };

        res.status(200).json({ success: true, stats });
    } catch (error) {
        console.error("Error fetching donor stats:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const acceptRequest = async (req, res) => {
    try {
        const requestId = req.params.id;

        // ...existing code...

        // Log the donor action
        req.logEvent(
            "donor",
            donor.username,
            `Donor ${donor.username} accepted request ${requestId} for post ${postId}`
        );

        // ...existing code...
    } catch (error) {
        // ...existing code...
    }
};

export const getDonorDetails = async (req, res) => {
    try {
        const { username } = req.params;

        const donor = await Donor.findOne({ username });
        if (!donor) {
            return res
                .status(404)
                .json({ success: false, message: "Donor not found" });
        }

        res.status(200).json({ success: true, donor });
    } catch (error) {
        console.error("Error fetching donor details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
