const mongoose = require('mongoose');
const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const User = require('../models/User');
require('dotenv').config();

const seedData = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie_booking';
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    await Show.deleteMany({});
    await User.deleteMany({});

    // Add Movies
    const movies = await Movie.insertMany([
      { name: 'Inception', description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.', genre: 'Sci-Fi', duration: 148, releaseDate: new Date('2010-07-16'), language: 'English' },
      { name: 'The Dark Knight', description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.', genre: 'Action', duration: 152, releaseDate: new Date('2008-07-18'), language: 'English' }
    ]);

    // Add Theaters
    const theaters = await Theater.insertMany([
      { theaterName: 'PVR Cinemas', location: 'Mumbai', theaterCapacity: 200, screenType: 'IMAX' },
      { theaterName: 'INOX', location: 'Delhi', theaterCapacity: 150, screenType: '4DX' }
    ]);

    // Add Shows
    await Show.insertMany([
      { showTime: new Date('2024-05-10T18:00:00'), price: 350, movie: movies[0]._id, theater: theaters[0]._id },
      { showTime: new Date('2024-05-10T21:00:00'), price: 400, movie: movies[1]._id, theater: theaters[1]._id }
    ]);

    // Add Admin User
    const admin = new User({ username: 'admin', email: 'admin@example.com', password: 'adminpassword', roles: ['ROLE_ADMIN', 'ROLE_USER'] });
    await admin.save();

    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
