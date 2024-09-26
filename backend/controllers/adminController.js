import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { Mod } from '../models/mod.js';
import 'dotenv/config';
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


export const loginAdmin = async (req, res) => {
    try{
        const { username , password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const mod = await Mod.findOne({ username });
        if (!mod) {
            console.log('Mod does not exist');
            return res.status(400).json({ message: 'Mod does not exist' });
        }

        const isPasswordValid = await bcrypt.compare(password, mod.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ username: mod.username , role : mod.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h'
        });

        res.cookie('admin_jwt', token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production'
        });

        console.log('Login successful');

        res.status(200).redirect('/admin/admin_dashboard');
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const signupAdmin = async (req, res) => {
    try{
        const { username , mobileNumber , email , password , role } = req.body;
        if (!username || !mobileNumber || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const mod = await Mod.findOne({ username });
        if (mod) {
            return res.status(400).json({ message: 'Mod already exists' });
        }

        const newMod = new Mod({
            username,
            mobileNumber,
            email,
            password,
            role
        });

        await newMod.save();

        console.log('Mod created successfully');

        res.status(201).redirect('/admin');
    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}


export const getAdminDashboard = async (req, res) => {
    try{
        const token = req.cookies.admin_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
                if (err) reject(err);
                else resolve(decoded);
            });
        });
        
        const username = decodedToken.username;
        const role = decodedToken.role;


        const mod = await Mod.findOne({ username , role });

        res.render('admin_dashboard' , { mod });

    }catch(err){
        console.log(err.message);
        res.status(500).json({ message: 'Error at getAdminDashboard' });
    }

}

export const getModerators = async (req, res) => {
    try {
        const token = req.cookies.admin_jwt;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        const { username, role } = decodedToken;

        const mod = await Mod.findOne({ username, role });

        if (!mod) {
            return res.status(400).json({ message: 'Invalid moderator credentials' });
        }

        // Find all moderators
        const moderators = await Mod.find({ role: 'moderator' });

        res.status(200).json({ moderators });
    } catch (err) {
        console.error('Error in getModerators:', err.message);
        res.status(500).json({ message: 'Server error in retrieving moderators' });
    }
};
