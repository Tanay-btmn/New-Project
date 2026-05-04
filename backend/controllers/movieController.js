const Movie = require('../models/Movie');

const getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid Movie ID format' });
    }
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMoviesByLanguage = async (req, res) => {
    try {
        const movies = await Movie.find({ language: req.query.language });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMoviesByGenre = async (req, res) => {
    try {
        const movies = await Movie.find({ genre: req.query.genre });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMoviesByTitle = async (req, res) => {
    try {
        const movies = await Movie.find({ name: { $regex: req.query.title, $options: 'i' } });
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { 
    getAllMovies, 
    getMovieById, 
    addMovie, 
    updateMovie, 
    deleteMovie,
    getMoviesByLanguage,
    getMoviesByGenre,
    getMoviesByTitle
};
