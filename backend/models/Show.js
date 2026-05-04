const mongoose = require('mongoose');

const showSchema = new mongoose.Schema({
  showTime: { type: Date, required: true },
  price: { type: Number, required: true },
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true }
}, { timestamps: true });

showSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

showSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model('Show', showSchema);
