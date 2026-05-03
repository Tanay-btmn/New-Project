const Show = require('../models/Show');

const getAllShows = async (req, res) => {
  try {
    const shows = await Show.find().populate('movie').populate('theater');
    res.json(shows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getShowsByMovieId = async (req, res) => {
    try {
        const shows = await Show.find({ movie: req.params.movieId }).populate('theater');
        res.json(shows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addShow = async (req, res) => {
  try {
    const show = new Show(req.body);
    await show.save();
    res.status(201).json(show);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { getAllShows, getShowsByMovieId, addShow };
