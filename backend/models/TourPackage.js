const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  duration: { type: String, required: true },
  pricePerPerson: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  includes: [String],
  itinerary: [{
    day: Number,
    title: String,
    desc: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('TourPackage', tourPackageSchema);