const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema(
  {
    driver: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    date: { type: String, required: true },
    seatsLeft: { type: Number, required: true },
    pricePerSeat: { type: Number, required: true },
    vehicle: { type: String, required: true },
    rating: { type: Number, default: 5.0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ride', rideSchema);