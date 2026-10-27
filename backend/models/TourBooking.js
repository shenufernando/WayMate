const mongoose = require('mongoose');

const tourBookingSchema = new mongoose.Schema({
  tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourPackage', required: true },
  tourTitle: { type: String, required: true },
  destination: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  startDate: { type: String, required: true },
  passengers: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  notes: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Cancelled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

module.exports = mongoose.model('TourBooking', tourBookingSchema);