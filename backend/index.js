require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/movies', require('./routes/movieRoutes'));
app.use('/api/theaters', require('./routes/theaterRoutes'));
app.use('/api/shows', require('./routes/showRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Static Folders
app.use('/posters', express.static(path.join(__dirname, 'Posters')));
app.use(express.static(path.join(__dirname, 'dist')));

// Database
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// THE ONLY CATCH-ALL
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (req.path.startsWith('/api') || req.path.includes('.') || !fs.existsSync(indexPath)) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(indexPath);
});

app.listen(PORT, () => console.log(`Server on ${PORT}`));
