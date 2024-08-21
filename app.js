import express from 'express';
import { connectDB } from './db/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import donorRoutes from './routes/donorRoutes.js';
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB();

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("login_signup");
});
app.use('/user', userRoutes);
app.use('/donor', donorRoutes);

const PORT = process.env.PORT || 9500; 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
