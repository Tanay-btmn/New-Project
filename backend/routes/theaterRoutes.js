const express = require('express');
const router = express.Router();
const { getAllTheaters, addTheater } = require('../controllers/theaterController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/getAllTheaters', getAllTheaters);
router.post('/addtheater', verifyToken, isAdmin, addTheater);

module.exports = router;
