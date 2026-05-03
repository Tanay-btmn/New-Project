const Movie = require('../models/Movie');
const Theater = require('../models/Theater');
const Show = require('../models/Show');
const User = require('../models/User');

const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addTheater = async (req, res) => {
  try {
    const theater = new Theater(req.body);
    await theater.save();
    res.status(201).json(theater);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addShow = async (req, res) => {
  try {
    const { movieId, theaterId, ...showData } = req.body;
    const show = new Show({
      ...showData,
      movie: movieId,
      theater: theaterId
    });
    await show.save();
    res.status(201).json(show);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { addMovie, addTheater, addShow, getAllUsers };
