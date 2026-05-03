const express = require('express');
const router = express.Router();
const { getAllShows, getShowsByMovieId, addShow } = require('../controllers/showController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/getAllShows', getAllShows);
router.get('/movie/:movieId', getShowsByMovieId);
router.post('/addshow', verifyToken, isAdmin, addShow);

module.exports = router;
