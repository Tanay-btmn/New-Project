const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByUser } = require('../controllers/bookingController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/create', verifyToken, createBooking);
router.get('/user', verifyToken, getBookingsByUser);

module.exports = router;
