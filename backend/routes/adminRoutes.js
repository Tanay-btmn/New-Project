const express = require('express');
const router = express.Router();
const { addMovie, addTheater, addShow, getAllUsers } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken, isAdmin);

router.post('/movies', addMovie);
router.post('/theaters', addTheater);
router.post('/shows', addShow);
router.get('/users', getAllUsers);

module.exports = router;
