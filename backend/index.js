require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

// 1. Basic Middleware
app.use(cors());
app.use(express.json());

// 2. Diagnostic Route
app.get('/debug-env', (req, res) => {
  const findDist = (dir, depth = 0) => {
    if (depth > 2) return null;
    const items = fs.readdirSync(dir);
    if (items.includes('dist')) return path.join(dir, 'dist');
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory() && !item.includes('node_modules')) {
        const found = findDist(fullPath, depth + 1);
        if (found) return found;
      }
    }
    return null;
  };

  const rootDist = findDist(path.join(__dirname, '..'));
  res.json({
    cwd: process.cwd(),
    dirname: __dirname,
    foundDist: rootDist,
    env: process.env.NODE_ENV
  });
});

// 3. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// 4. Static Assets
app.use('/posters', express.static(path.join(__dirname, 'Posters')));

// 5. Smart Frontend Serving
const possiblePaths = [
  path.join(__dirname, 'dist'),
  path.join(__dirname, '../BMS-Frontend/dist'),
  path.join(__dirname, '../../BMS-Frontend/dist'),
  path.join(process.cwd(), 'BMS-Frontend/dist'),
  path.join(process.cwd(), 'dist')
];

let finalFrontendPath = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    finalFrontendPath = p;
    console.log('Success! Found frontend build at:', p);
    break;
  }
}

if (finalFrontendPath) {
  app.use(express.static(finalFrontendPath));
  
  // Catch-all route to serve the frontend for any non-API, non-asset requests
  app.get('*', (req, res, next) => {
    // If the request is for an API or asset that wasn't found, let it fall through
    if (req.path.startsWith('/api') || req.path.startsWith('/posters') || req.path.includes('.')) {
      return next();
    }
    res.sendFile(path.join(finalFrontendPath, 'index.html'));
  });
} else {
  console.warn('CRITICAL: Frontend build not found anywhere!');
}

// Database Connection & Seeding
const MONGODB_URI = process.env.MONGODB_URI;
const Movie = require('./models/Movie');

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('Seeding database...');
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
          cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chasten'],
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
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
