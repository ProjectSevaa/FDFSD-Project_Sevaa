import { Slum } from '../models/slum.js';  // Assuming the Slum model is already defined
import cloudinary from '../config/cloudinaryConfig.js';  // Adjust the path to your Cloudinary config
import multer from 'multer';

// Show Slums Page
export const showSlumsPage = async (req, res) => {
  try {
    const slums = await Slum.find();  // Fetch all slums from the database
    res.render('slums', { slums });  // Render the 'slums' EJS page, passing slums data
  } catch (error) {
    console.error('Error fetching slums:', error);
    res.status(500).send('Error fetching slums');
  }
};

// Set up multer for image file upload
const upload = multer({ 
  dest: 'uploads/', // Temporary folder for image uploads
});

// Add a new Slum (with images)
export const addSlum = async (req, res) => {
  const { name, description } = req.body;
  const photos = req.files; // This will be populated by multer

  console.log(name, description, photos); // Debugging to ensure files are received

  try {
    // Ensure that the required fields are present and at least 10 photos are uploaded
    if (!name || !description || !photos || photos.length < 1) {
      return res.status(400).send('Name, Description, and at least 1 photo is required');
    }

    // Upload photos to Cloudinary
    const photoUrls = [];
    for (const photo of photos) {
      const result = await cloudinary.v2.uploader.upload(photo.path); // Cloudinary upload logic
      photoUrls.push(result.secure_url); // Get the uploaded image URL
    }

    // Create a new slum with the uploaded data
    const newSlum = new Slum({
      name,
      description,
      photos: photoUrls, // Store the URLs of the uploaded images
    });

    // Save the new slum to the database
    await newSlum.save();

    // Send a success response or redirect
    res.status(201).json({ message: 'Slum added successfully', slum: newSlum });
  } catch (error) {
    console.error('Error adding slum:', error);
    res.status(500).send('Error adding slum');
  }
};

// Define routes for uploading photos
export const uploadSlumImages = async (req, res) => {
  try {
    const files = req.files;  // Array of uploaded files
    if (!files || files.length < 1) {
      return res.status(400).send('At least 1 image is required');
    }

    const imageUrls = [];
    for (const file of files) {
      const result = await cloudinary.v2.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
    }

    // Find the slum by ID and update its photos
    const slum = await Slum.findById(req.params.id);
    if (!slum) {
      return res.status(404).send('Slum not found');
    }

    slum.photos = imageUrls;  // Update the photos field
    await slum.save();

    res.status(200).json({ message: 'Slum images uploaded successfully', slum });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('Error uploading images');
  }
};
// Get all slums
export const getAllSlums = async (req, res) => {
  try {
    const slums = await Slum.find();
    res.status(200).json(slums);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching slums', error });
  }
};

// Get a specific slum by ID
export const getSlumById = async (req, res) => {
  try {
    const slum = await Slum.findById(req.params.id);
    if (!slum) {
      return res.status(404).json({ message: 'Slum not found' });
    }
    res.status(200).json(slum);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching slum', error });
  }
};
