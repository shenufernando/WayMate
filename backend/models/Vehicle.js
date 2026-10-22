const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  ownerName: { type: String, required: true },
  ownerContact: { type: String, required: true },
  vehicleType: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  capacity: { type: Number, required: true },
  serviceType: { type: String, enum: ['Self-drive', 'With driver'], required: true },
  pricePerDay: { type: Number, required: true },
  pricePerKm: { type: Number },
  image: { type: String, required: true },
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vehicle', vehicleSchema);