const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  numberOfSeats: { type: Number, required: true },
  bookingTime: { type: Date, default: Date.now },
  price: { type: Number, required: true },
  bookingStatus: { type: String, enum: ['PENDING', 'CONFIRMED', 'CANCELLED'], default: 'CONFIRMED' },
  seatNumbers: [{ type: String }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true }
}, { timestamps: true });

bookingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model('Booking', bookingSchema);
