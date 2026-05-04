require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Basic Middleware
app.use(cors());
app.use(express.json());

// 2. API Routes (MUST BE BEFORE STATIC FILES)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 3. Static Assets (Posters, etc.)
app.use('/posters', express.static(path.join(__dirname, 'Posters')));

// 4. Frontend Static Files
const frontendPath = path.join(__dirname, '../BMS-Frontend/dist');
app.use(express.static(frontendPath));

// Debugging: Verify frontend files exist
console.log('Checking frontend build at:', frontendPath);
const fs = require('fs');
if (fs.existsSync(frontendPath)) {
  console.log('Frontend build folder found. Contents:', fs.readdirSync(frontendPath));
} else {
  console.warn('WARNING: Frontend build folder NOT FOUND at:', frontendPath);
}

// Database Connection & Auto-Seeding
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_booking';
const Movie = require('./models/Movie');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if we need to seed
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('Database empty, auto-seeding initial data...');
      await Movie.insertMany([
        { 
          name: 'Inception', 
          description: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
          genre: 'Sci-Fi', duration: 148, posterUrl: '/posters/Inception.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
          cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
          crew: ['Christopher Nolan (Director)']
        },
        { 
          name: 'Interstellar', 
          description: 'A team of explorers travel through a wormhole in space...',
          genre: 'Sci-Fi', duration: 169, posterUrl: '/posters/Interstellar.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
          cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
          crew: ['Christopher Nolan (Director)']
        },
        { 
          name: 'The Dark Knight', 
          description: 'When the menace known as the Joker wreaks havoc...',
          genre: 'Action', duration: 152, posterUrl: '/posters/The Dark Knight.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
          cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
          crew: ['Christopher Nolan (Director)']
        },
        { 
          name: 'Project Hail Mary', 
          description: 'An astronaut wakes up with no memory and must use science to save humanity.',
          genre: 'Sci-Fi', duration: 150, posterUrl: '/posters/Project Hail Mary.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=2vU_0l6H3rY',
          cast: ['Ryan Gosling'],
          crew: ['Phil Lord (Director)', 'Christopher Miller (Director)']
        },
        { 
          name: 'Star Wars', 
          description: 'Luke Skywalker joins forces with a Jedi Knight and a cocky pilot to save the galaxy.',
          genre: 'Sci-Fi', duration: 121, posterUrl: '/posters/Star Wars.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=1g3_CFmnU7k',
          cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
          crew: ['George Lucas (Director)']
        },
        { 
          name: 'The Conjuring', 
          description: 'Paranormal investigators work to help a family terrorized by a dark presence.',
          genre: 'Horror', duration: 112, posterUrl: '/posters/The Conjuring.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=k10ETZ41q5o',
          cast: ['Vera Farmiga', 'Patrick Wilson', 'Lili Taylor'],
          crew: ['James Wan (Director)']
        }
      ]);

      const Theater = require('./models/Theater');
      const Show = require('./models/Show');
      const theaters = await Theater.insertMany([
        { theaterName: 'PVR Cinemas', location: 'Mall of India, Noida', theaterCapacity: 200, screenType: 'IMAX' },
        { theaterName: 'INOX', location: 'Cyber City, Gurgaon', theaterCapacity: 150, screenType: '4DX' },
        { theaterName: 'Cinepolis', location: 'Saket, Delhi', theaterCapacity: 180, screenType: 'Standard' }
      ]);

      const movies = await Movie.find();
      const showsData = [];
      movies.forEach(movie => {
        theaters.forEach(theater => {
          showsData.push({
            movie: movie._id, theater: theater._id,
            showTime: new Date(Date.now() + 86400000),
            price: 250 + Math.floor(Math.random() * 200)
          });
        });
      });
      await Show.insertMany(showsData);
      console.log('Seeding complete!');
    }
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

// 5. Frontend Catch-all (MUST BE LAST)
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
