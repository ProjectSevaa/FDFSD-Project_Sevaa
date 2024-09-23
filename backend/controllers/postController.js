import { Post } from '../models/post.js'; // Adjust the path to your Post model

export const createPost = async (req, res) => {
    const { donorUsername, location, availableFood } = req.body;

    try {
        const newPost = new Post({
            donorUsername,
            location,
            availableFood: availableFood.split(',').map(item => item.trim()), 
        });

        await newPost.save();

        res.redirect('/donor/donor_homepage'); 
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
};

export const getPosts = async (req, res) => {
    const { donorUsername } = req.query;

    try {
        const posts = await Post.find({ donorUsername });

        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); 
    }
};


export const getAllPosts = async (req, res) => {
    try {
        // Find and sort all posts by timestamp in descending order
        const posts = await Post.find().sort({ timestamp: -1 });

        // Send the posts back as a JSON response
        res.json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error'); // Handle errors appropriately
    }
};



