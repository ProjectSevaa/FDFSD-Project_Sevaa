
# FDFSD-Project_Sevaa

This project consists of a **Backend** and a **Frontend** built to work together. The backend is built with **Node.js/Express** and the frontend is built using **Next.js**. This README will guide you through the setup and how to run both servers.

---

## Table of Contents
1. [Backend Setup](#backend-setup)
   - [Install Dependencies](#install-dependencies)
   - [Set Up Environment Variables](#set-up-environment-variables)
   - [Start Backend Server](#start-backend-server)
2. [Frontend Setup](#frontend-setup)
   - [Install Dependencies](#install-dependencies-1)
   - [Run Frontend Server](#run-frontend-server)
3. [Folder Structure](#folder-structure)
4. [Final Steps](#final-steps)

---

## Backend Setup

1. **Navigate to the Backend Directory**

   Open your terminal and navigate to the `backend` directory:

   ```bash
   cd FDFSD-Project_Sevaa/backend
   ```

2. **Install Dependencies**

   Install the required dependencies using `npm`:

   ```bash
   npm install
   ```

   This will install all the backend dependencies listed in the `package.json` file. These include packages like:

   - `express`: Web framework for Node.js
   - `bcrypt`: Password hashing
   - `jsonwebtoken`: JSON Web Tokens for authentication
   - `mongoose`: MongoDB ORM for database interaction
   - and many others for middleware, utilities, etc.

3. **Set Up Environment Variables**

   You need to create a `.env` file in the `backend` directory to configure some necessary environment variables. Create a `.env` file and add the following values:

   ```bash
   JWT_SECRET_KEY=yourSecretKey
   MONGO_URI=yourMongoDBConnectionURL
   CLOUDINARY_URL=yourCloudinaryURL
   ```

   - **JWT_SECRET_KEY**: Secret key for JWT authentication.
   - **MONGO_URI**: Your MongoDB connection URL.
   - **CLOUDINARY_URL**: Your Cloudinary URL for image storage (if using Cloudinary).

4. **Start Backend Server**

   After the dependencies are installed and environment variables are set, you can run the backend server:

   - **In Development Mode** (with Nodemon):

     ```bash
     npm run devStart
     ```

   - **In Production Mode**:

     ```bash
     npm start
     ```

   The backend server will be running on `http://localhost:9500`.

---

## Frontend Setup

1. **Navigate to the Frontend Directory**

   Open your terminal and navigate to the `frontend` directory:

   ```bash
   cd FDFSD-Project_Sevaa/frontend
   ```

2. **Install Dependencies**

   Install the required dependencies using `npm`:

   ```bash
   npm install
   ```

   This will install all the frontend dependencies listed in the `package.json` file. Some key packages include:

   - `next`: The React framework used for building server-rendered applications
   - `axios`: For making HTTP requests
   - `tailwindcss`: A utility-first CSS framework
   - `framer-motion`: A React animation library
   - and other utility libraries for UI components, forms, etc.

3. **Run Frontend Server**

   After installing the dependencies, run the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend server will be running on `http://localhost:3000`.

4. **Build for Production**

   If you want to build the frontend for production, you can run the following:

   ```bash
   npm run build
   ```

   After the build is complete, you can start the production server:

   ```bash
   npm run start
   ```

   The production build will be served from `http://localhost:3000`.

---

## Folder Structure

Here’s an overview of the project folder structure:

```bash
FDFSD-Project_Sevaa/
│
├── backend/
│   ├── node_modules/
│   ├── app.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── node_modules/
    ├── pages/
    ├── public/
    ├── package.json
    ├── tailwind.config.js
    └── next.config.js
```

---

## Final Steps

After setting up both the backend and frontend, you should have both servers running:

- **Backend API**: `http://localhost:9500`
- **Frontend Application**: `http://localhost:3000`

You can now interact with the application, send requests to the API, and view the frontend UI in your browser.

---

## Conclusion

This guide provides the basic steps to set up and run both the backend and frontend of your project. If you run into any issues, make sure the dependencies are installed properly and the environment variables are correctly set up.
