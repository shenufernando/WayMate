const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  shortDescription: { type: String, required: true },
  fullDescription: { type: String, required: true },
  bestTime: { type: String, default: 'Anytime' },
  entryFee: { type: String, default: 'Free' },
}, { timestamps: true });

module.exports = mongoose.model('Attraction', attractionSchema);