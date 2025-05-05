# FDFSD-Project_Sevaa

This project consists of a **Backend** and a **Frontend** built to work together. The backend is built with **Node.js/Express** and the frontend is built using **Next.js**. This README will guide you through the setup, improvements, and how to run both servers.

---

## Table of Contents

1. [Backend Setup](#backend-setup)
2. [Frontend Setup](#frontend-setup)
3. [Dockerization and Local Setup](#dockerization-and-local-setup)
4. [CI/CD Pipeline](#ci-cd-pipeline)
5. [Improvements After WBD Course](#improvements-after-wbd-course)
6. [Folder Structure](#folder-structure)
7. [Final Steps](#final-steps)
8. [Hosted Links](#hosted-links)
9. [Conclusion](#conclusion)

---

## Hosted Links

-   **Frontend**: [https://frontend-delta-eight-38.vercel.app/](https://frontend-delta-eight-38.vercel.app/)
-   **Swagger API Documentation**: [https://fdfsd-project-sevaa.onrender.com/api-docs/](https://fdfsd-project-sevaa.onrender.com/api-docs/)

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
    REDIS_HOST=yourRedisHost
    REDIS_PORT=yourRedisPort
    REDIS_PASSWORD=yourRedisPassword
    REDIS_TLS=true
    ```

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

## Dockerization and Local Setup

1. **Docker Compose**

    We have added a `docker-compose.yml` file to simplify local development. You can run the backend, Redis, and MongoDB services locally using Docker Compose:

    ```bash
    docker-compose up
    ```

    This will start:

    - Backend on `http://localhost:9500`
    - Redis on `http://localhost:6379`
    - MongoDB on `http://localhost:27017`

2. **Dockerized Backend**

    The backend is fully dockerized. The Docker image is built and pushed to Docker Hub. You can pull the image and run it locally:

    ```bash
    docker pull <dockerhub-username>/backend:latest
    docker run -p 9500:9500 <dockerhub-username>/backend:latest
    ```

---

## CI/CD Pipeline

We have implemented a CI/CD pipeline using **GitHub Actions** to automate testing, building, and deployment. Below is a detailed explanation of the workflow:

### Workflow Steps

1. **Trigger**:

    - The pipeline is triggered on every `push` or `pull_request` to the `main` branch.

2. **Backend Tests**:

    - Runs Jest unit tests for the backend.
    - A Redis service is spun up using Docker for testing.
    - Ensures that all backend functionality is working as expected.

3. **Frontend Build and Deploy**:

    - Installs dependencies and builds the frontend using `npm run build`.
    - Deploys the frontend to **Vercel** using the Vercel CLI.

4. **Docker Build and Push**:

    - Builds a Docker image for the backend.
    - Pushes the Docker image to **Docker Hub** for deployment.

5. **Deployment**:
    - The backend is deployed on **Render**, which pulls the Docker image from Docker Hub.
    - The frontend is deployed on **Vercel**.

### CI/CD Workflow Diagram

Below is a simplified diagram of the CI/CD pipeline:

```plaintext
          +-------------------+
          |   Code Changes    |
          +-------------------+
                   |
                   v
          +-------------------+
          |   GitHub Actions  |
          +-------------------+
                   |
    +--------------+--------------+
    |                             |
    v                             v
+----------------+       +-------------------+
| Backend Tests  |       | Frontend Build    |
| (Jest + Redis) |       | and Deploy to     |
+----------------+       | Vercel            |
         |               +-------------------+
         v
+----------------+
| Docker Build   |
| and Push to    |
| Docker Hub     |
+----------------+
         |
         v
+-------------------+
| Backend Deploy to |
| Render (Docker)   |
+-------------------+
```

### Key Features of the Pipeline

-   **Automated Testing**: Ensures code quality by running tests on every push or pull request.
-   **Frontend Deployment**: Automatically deploys the latest frontend build to Vercel.
-   **Backend Deployment**: Uses Docker images for consistent and reliable backend deployment.
-   **Redis Integration**: A Redis service is included in the pipeline for backend testing.

### Benefits

-   **Consistency**: Ensures that the same code is tested and deployed across all environments.
-   **Automation**: Reduces manual effort by automating the entire process.
-   **Scalability**: The pipeline can be extended to include additional steps or services as needed.

For more details, refer to the `.github/workflows/ci-cd.yml` file in the repository.

---

## Improvements After WBD Course

### 1. **Swagger Documentation**

-   Added Swagger API documentation for all backend routes.
-   Accessible at `/api-docs` on the backend server.

### 2. **Jest Unit Tests**

-   Implemented unit tests for backend functionality using Jest.
-   Ensures code quality and reliability.

### 3. **Redis Caching**

-   Integrated Redis (hosted on **Upstash**) to cache all posts.
-   Posts are fetched from Redis instead of querying the database every time.
-   Cache is updated whenever a new post is added.

### 4. **Database Indexing and Query Optimization**

-   Added indexes to MongoDB collections to improve query performance.
-   Optimized database queries for faster response times.

### 5. **Dockerization**

-   Dockerized the backend for consistent deployment.
-   Added a `Dockerfile` and `.dockerignore` for efficient builds.

### 6. **Deployment**

-   Backend is deployed on **Render**, pulling the Docker image from **Docker Hub**.
-   Frontend is deployed on **Vercel**.

### 7. **CI/CD Pipeline**

-   Automated testing, building, and deployment using **GitHub Actions**.

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
│   ├── Dockerfile
│   ├── .env
│   └── tests/
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

-   **Backend API**: `http://localhost:9500`
-   **Frontend Application**: `http://localhost:3000`

You can now interact with the application, send requests to the API, and view the frontend UI in your browser.

---

## Conclusion

This guide provides the basic steps to set up and run both the backend and frontend of your project. The improvements made after the WBD course ensure better performance, scalability, and maintainability. If you run into any issues, make sure the dependencies are installed properly and the environment variables are correctly set up.
