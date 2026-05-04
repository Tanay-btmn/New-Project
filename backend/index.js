require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../BMS-Frontend/dist')));
// Serve posters
app.use('/posters', express.static(path.join(__dirname, 'Posters')));

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_booking';
const Movie = require('./models/Movie');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Auto-seed if empty
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('Database empty, auto-seeding initial data...');
      await Movie.insertMany([
        { name: 'Inception', genre: 'Sci-Fi', duration: 148, posterUrl: '/posters/Inception.jpeg' },
        { name: 'Interstellar', genre: 'Sci-Fi', duration: 169, posterUrl: '/posters/Interstellar.jpeg' },
        { name: 'The Dark Knight', genre: 'Action', duration: 152, posterUrl: '/posters/The Dark Knight.jpeg' },
        { name: 'Project Hail Mary', genre: 'Sci-Fi', duration: 150, posterUrl: '/posters/Project Hail Mary.jpeg' },
        { name: 'Star Wars', genre: 'Sci-Fi', duration: 121, posterUrl: '/posters/Star Wars.jpeg' },
        { name: 'The Conjuring', genre: 'Horror', duration: 112, posterUrl: '/posters/The Conjuring.jpeg' }
      ]);
      console.log('Auto-seed complete!');
    }
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.get('/', (req, res) => {
  res.send('Movie Ticket Booking System API');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../BMS-Frontend/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
