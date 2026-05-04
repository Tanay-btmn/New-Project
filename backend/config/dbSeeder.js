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
      { 
        name: 'Inception', 
        description: 'A thief who steals corporate secrets through the use of dream-sharing technology...', 
        genre: 'Sci-Fi', 
        duration: 148, 
        releaseDate: new Date('2010-07-16'), 
        language: 'English',
        posterUrl: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop'
      },
      { 
        name: 'The Dark Knight', 
        description: 'When the menace known as the Joker wreaks havoc...', 
        genre: 'Action', 
        duration: 152, 
        releaseDate: new Date('2008-07-18'), 
        language: 'English',
        posterUrl: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2037&auto=format&fit=crop'
      },
      { 
        name: 'Interstellar', 
        description: 'A team of explorers travel through a wormhole in space...', 
        genre: 'Sci-Fi', 
        duration: 169, 
        releaseDate: new Date('2014-11-07'), 
        language: 'English',
        posterUrl: 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?q=80&w=2066&auto=format&fit=crop'
      },
      { 
        name: 'Dune: Part Two', 
        description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge...', 
        genre: 'Sci-Fi', 
        duration: 166, 
        releaseDate: new Date('2024-03-01'), 
        language: 'English',
        posterUrl: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2034&auto=format&fit=crop'
      },
      { 
        name: 'Oppenheimer', 
        description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', 
        genre: 'Biography', 
        duration: 180, 
        releaseDate: new Date('2023-07-21'), 
        language: 'English',
        posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=2070&auto=format&fit=crop'
      }
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
