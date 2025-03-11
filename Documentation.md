FDFSD-Project_Sevaa Documentation
Installation Guide for Backend and Frontend
This project contains two main directories: backend and frontend. Each directory has its own set of dependencies and required setups. Below are the steps to install and run both the backend and frontend servers.

Backend Setup
1. Navigate to the Backend Directory
Open your terminal and navigate to the backend directory:

bash
Copy code
cd FDFSD-Project_Sevaa/backend
2. Install Dependencies
Install the required dependencies using npm:

bash
Copy code
npm install
This will install the required dependencies listed in the package.json file. These dependencies include:

express: Web framework for Node.js.
bcrypt: Password hashing.
jsonwebtoken: JSON Web Token for authentication.
mongoose: MongoDB ORM.
cookie-parser: Middleware for handling cookies.
and many other dependencies for backend functionality.
3. Environment Variables
Ensure that you have a .env file in the backend directory with the following required environment variables:

JWT_SECRET_KEY: Secret key for JWT authentication.
Any other required variables (e.g., database connection strings, cloud storage keys).
Example of .env file:

makefile
Copy code
JWT_SECRET_KEY=yourSecretKey
MONGO_URI=yourMongoDBConnectionURL
CLOUDINARY_URL=yourCloudinaryURL
4. Run the Backend Server
To start the backend server in development mode, use Nodemon:

bash
Copy code
npm run devStart
For production mode, use:

bash
Copy code
npm start
The server will start on http://localhost:9500.

Frontend Setup
1. Navigate to the Frontend Directory
Open your terminal and navigate to the frontend directory:

bash
Copy code
cd FDFSD-Project_Sevaa/frontend
2. Install Dependencies
Install the required dependencies using npm:

bash
Copy code
npm install
This will install the necessary frontend libraries, including:

next: Framework for React-based applications.
axios: For making HTTP requests.
framer-motion: Animation library for React.
tailwindcss: Utility-first CSS framework.
and many other dependencies related to UI components, forms, and more.
3. Run the Frontend Server
To run the frontend server in development mode, use:

bash
Copy code
npm run dev
This will start the frontend development server on http://localhost:3000.

4. Build for Production
To build the project for production, run:

bash
Copy code
npm run build
After building, you can start the production server:

bash
Copy code
npm run start
Final Steps
After following these steps, the backend and frontend servers should be up and running. You can now interact with the application by navigating to:

Backend API: http://localhost:9500
Frontend Application: http://localhost:3000
Folder Structure
lua
Copy code
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
Conclusion
This setup will allow you to work on both the backend (Node.js/Express) and frontend (Next.js) parts of your project simultaneously. Make sure that both servers are running, and you can interact with them as needed.

This documentation provides the basic steps for setting up your backend and frontend servers. Let me know if you need further assistance!