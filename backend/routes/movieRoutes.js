const express = require('express');
const router = express.Router();
const { 
    getAllMovies, 
    getMovieById, 
    addMovie, 
    updateMovie, 
    deleteMovie,
    getMoviesByLanguage,
    getMoviesByGenre,
    getMoviesByTitle
} = require('../controllers/movieController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/getAllMovies', getAllMovies);
router.get('/get-all-movies', getAllMovies); // Alias for compatibility
router.get('/getByLanguage', getMoviesByLanguage);
router.get('/getbyGenre', getMoviesByGenre);
router.get('/getbyTitle', getMoviesByTitle);
router.get('/:id', getMovieById);

router.post('/addmovie', verifyToken, isAdmin, addMovie);
router.put('/updatemovie/:id', verifyToken, isAdmin, updateMovie);
router.delete('/deletemovie/:id', verifyToken, isAdmin, deleteMovie);

module.exports = router;
