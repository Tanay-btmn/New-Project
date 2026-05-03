const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const booking = new Booking({
      ...req.body,
      user: req.userId // From verifyToken middleware
    });
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId }).populate({
        path: 'show',
        populate: [{ path: 'movie' }, { path: 'theater' }]
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createBooking, getBookingsByUser };
