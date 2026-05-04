const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  theaterName: { type: String, required: true },
  location: { type: String, required: true },
  theaterCapacity: { type: Number },
  screenType: { type: String }
}, { timestamps: true });

theaterSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

theaterSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) { delete ret._id }
});

module.exports = mongoose.model('Theater', theaterSchema);
