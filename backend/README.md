# Movie Ticket Booking System - Backend (MERN Stack)

This is the Node.js/Express/MongoDB version of the Movie Ticket Booking System backend.

## Tech Stack
- **Node.js** & **Express**
- **MongoDB** with **Mongoose**
- **JWT** for Authentication
- **Bcryptjs** for Password Hashing

## Getting Started

### 1. Installation
```bash
cd backend
npm install
```

### 2. Configuration
Create a `.env` file in the `backend` directory:
```env
PORT=8080
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### 3. Seed Data
To populate the database with initial movies, theaters, and an admin user:
```bash
npm run seed
```
*Note: This will clear existing data in the database.*

### 4. Run Locally
```bash
npm run dev
```

## Deployment to Render

1.  **Create a MongoDB Atlas Database**:
    - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    - Create a free cluster.
    - Add a database user and allow access from anywhere (0.0.0.0/0 for testing, or use Render's IPs).
    - Get the connection string (SRV).
2.  **Push to GitHub**:
    - Create a new repository on GitHub.
    - Push the `backend` folder (ensure `.gitignore` excludes `node_modules` and `.env`).
3.  **Render Setup**:
    - Go to [Render](https://render.com/).
    - Create a new **Web Service**.
    - Connect your GitHub repository.
    - Set the **Root Directory** to `backend`.
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
4.  **Environment Variables**:
    - In Render dashboard, go to **Environment**.
    - Add `MONGODB_URI` (from Atlas).
    - Add `JWT_SECRET`.
    - Add `PORT` (8080 or leave default).

## API Endpoints

- **Auth**: `/api/auth/registernormaluser`, `/api/auth/login`
- **Movies**: `/api/movies/getAllMovies`, `/api/movies/:id`, `/api/movies/getByLanguage`, etc.
- **Theaters**: `/api/theaters/getAllTheaters`, `/api/theaters/addtheater`
- **Shows**: `/api/shows/getAllShows`, `/api/shows/movie/:movieId`
- **Bookings**: `/api/bookings/create`, `/api/bookings/user`
