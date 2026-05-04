const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  genre: { type: String },
  duration: { type: Number },
  releaseDate: { type: Date },
  language: { type: String },
  posterUrl: { type: String },
  trailerUrl: { type: String },
  cast: [{ type: String }],
  crew: [{ type: String }]
}, { timestamps: true });

movieSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model('Movie', movieSchema);
