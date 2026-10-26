const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true }, // 'user' or 'owner'
  text: { type: String, default: '' },
  image: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const bookingSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  vehicleModel: { type: String, required: true },
  ownerEmail: { type: String, required: true, lowercase: true, trim: true },
  ownerContact: { type: String, default: '' },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true, lowercase: true, trim: true },
  userContact: { type: String, required: true },
  pickupDate: { type: String, required: true },
  returnDate: { type: String, required: true },
  destination: { type: String, required: true },
  notes: { type: String, default: '' },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Rejected', 'Cancelled', 'Completed'], 
    default: 'Pending' 
  },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);