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
    
    // Force-seed once to apply leading slash to posters
    const forceSeed = true; 
    if (forceSeed) {
      console.log('Refreshing database with absolute poster paths...');
      await Movie.deleteMany({}); 
      await Movie.insertMany([
        { 
          name: 'Inception', 
          description: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
          genre: 'Sci-Fi', 
          duration: 148, 
          posterUrl: '/posters/Inception.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
          cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
          crew: ['Christopher Nolan (Director)']
        },
        { 
          name: 'Interstellar', 
          description: 'A team of explorers travel through a wormhole in space...',
          genre: 'Sci-Fi', 
          duration: 169, 
          posterUrl: '/posters/Interstellar.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
          cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
          crew: ['Christopher Nolan (Director)']
        },
        { 
          name: 'The Dark Knight', 
          description: 'When the menace known as the Joker wreaks havoc...',
          genre: 'Action', 
          duration: 152, 
          posterUrl: '/posters/The Dark Knight.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
          cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
          crew: ['Christopher Nolan (Director)']
        },
        { 
          name: 'Project Hail Mary', 
          genre: 'Sci-Fi', 
          duration: 150, 
          posterUrl: '/posters/Project Hail Mary.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=2vU_0l6H3rY',
          cast: ['Ryan Gosling'],
          crew: ['Phil Lord (Director)', 'Christopher Miller (Director)']
        },
        { 
          name: 'Star Wars', 
          genre: 'Sci-Fi', 
          duration: 121, 
          posterUrl: '/posters/Star Wars.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=1g3_CFmnU7k',
          cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
          crew: ['George Lucas (Director)']
        },
        { 
          name: 'The Conjuring', 
          genre: 'Horror', 
          duration: 112, 
          posterUrl: '/posters/The Conjuring.jpeg',
          trailerUrl: 'https://www.youtube.com/watch?v=k10ETZ41q5o',
          cast: ['Vera Farmiga', 'Patrick Wilson', 'Lili Taylor'],
          crew: ['James Wan (Director)']
        }
      ]);
      console.log('Auto-seed complete!');

      // Seed Theaters and Shows
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
          // Add 2 shows per movie per theater
          showsData.push({
            movie: movie._id,
            theater: theater._id,
            showTime: new Date(Date.now() + 86400000), // Tomorrow
            price: 250 + Math.floor(Math.random() * 200)
          });
          showsData.push({
            movie: movie._id,
            theater: theater._id,
            showTime: new Date(Date.now() + 172800000), // Day after
            price: 250 + Math.floor(Math.random() * 200)
          });
        });
      });
      await Show.insertMany(showsData);
      console.log('Theaters and Shows seeded!');
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
